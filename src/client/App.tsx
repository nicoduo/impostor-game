import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { GameSession, GameStage, Player, WordEntry, Language } from '../types';
import Lobby from './components/Lobby';
import Settings from './components/Settings';
import WordEntryStage from './components/WordEntryStage';
import WaitingRoom from './components/WaitingRoom';
import GameRound from './components/GameRound';
import { useTranslation } from './hooks/useTranslation';
import { setCookie, getCookie, clearSessionCookies } from './utils/cookies';
import './index.css';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';
const socket: Socket = io(SOCKET_URL);

function App() {
  const [playerName, setPlayerName] = useState('');
  const [codeword, setCodeword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [gameState, setGameState] = useState<GameSession | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { t } = useTranslation(gameState);
  const tRef = useRef(t);
  const reconnectAttemptedRef = useRef(false);
  
  // Keep ref updated
  useEffect(() => {
    tRef.current = t;
  }, [t]);

  // Load saved session from cookies on mount
  useEffect(() => {
    const savedCodeword = getCookie('gameCodeword');
    const savedPlayerName = getCookie('playerName');
    
    console.log('Loading cookies on mount:', { savedCodeword, savedPlayerName });
    console.log('All cookies:', document.cookie);
    
    if (savedCodeword && savedPlayerName) {
      setCodeword(savedCodeword);
      setPlayerName(savedPlayerName);
      console.log('Loaded session from cookies');
    } else {
      console.log('No valid session cookies found');
    }
  }, []);

  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to server');
      
      // Try to reconnect to previous session (only once per connection)
      if (!reconnectAttemptedRef.current) {
        reconnectAttemptedRef.current = true;
        const savedCodeword = getCookie('gameCodeword');
        const savedPlayerName = getCookie('playerName');
        
        if (savedCodeword && savedPlayerName) {
          console.log('Attempting to reconnect to session:', savedCodeword, 'as', savedPlayerName);
          console.log('Cookies found - codeword:', savedCodeword, 'playerName:', savedPlayerName);
          // Small delay to ensure socket is fully connected
          setTimeout(() => {
            console.log('Emitting rejoin-session event...');
            socket.emit('rejoin-session', {
              codeword: savedCodeword.trim().toLowerCase(),
              playerName: savedPlayerName.trim()
            });
          }, 200);
        } else {
          console.log('No saved session found in cookies');
        }
      }
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from server');
      // Reset reconnect flag so we can try again on next connection
      reconnectAttemptedRef.current = false;
    });

    socket.on('session-created', (data: { codeword: string; isAdmin: boolean; playerId: string }) => {
      setCodeword(data.codeword);
      setIsAdmin(data.isAdmin);
      setPlayerId(data.playerId);
      setError(null);
      // Save to cookies - use current playerName state or get from input
      const nameToSave = playerName || document.querySelector<HTMLInputElement>('#playerName')?.value || '';
      setCookie('gameCodeword', data.codeword);
      setCookie('playerName', nameToSave);
      setCookie('oldPlayerId', data.playerId);
      console.log('Cookies saved on session-created:', { codeword: data.codeword, playerName: nameToSave });
    });

    socket.on('join-success', (data: { isAdmin: boolean; playerId: string }) => {
      setIsAdmin(data.isAdmin);
      setPlayerId(data.playerId);
      setError(null);
      // Save to cookies - use current state values
      if (codeword) {
        const nameToSave = playerName || document.querySelector<HTMLInputElement>('#playerName')?.value || '';
        setCookie('gameCodeword', codeword);
        setCookie('playerName', nameToSave);
        setCookie('oldPlayerId', data.playerId);
        console.log('Cookies saved on join-success:', { codeword, playerName: nameToSave });
      }
    });
    
    socket.on('rejoin-success', (data: { isAdmin: boolean; playerId: string }) => {
      setIsAdmin(data.isAdmin);
      setPlayerId(data.playerId);
      setError(null);
      // Cookies already set, just update playerId
      setCookie('oldPlayerId', data.playerId);
      // Don't clear gameState here - wait for game-state event
      console.log('Rejoin successful, waiting for game state...');
    });
    
    socket.on('rejoin-error', (data: { message: string }) => {
      console.error('Rejoin error:', data.message);
      // Only clear cookies if it's a definitive error (session not found, etc.)
      // Don't clear on "player not found" during gameplay - they might still be able to rejoin
      if (data.message.includes('Session not found') || data.message.includes('Invalid')) {
        clearSessionCookies();
        setError(data.message);
        setGameState(null);
        setCodeword('');
      } else {
        // For other errors, just show the error but keep cookies
        // This allows retry
        setError(data.message);
      }
    });

    socket.on('join-error', (data: { message: string }) => {
      if (data.message === 'Invalid codeword') {
        setError(tRef.current('invalidCodeword'));
      } else if (data.message === 'Game already in progress') {
        setError(tRef.current('gameInProgress'));
      } else {
        setError(data.message);
      }
    });

    socket.on('game-state', (state: any) => {
      console.log('[game-state] Received game state:', {
        codeword: state.codeword,
        stage: state.stage,
        settings: state.settings,
        playerCount: Object.keys(state.players || {}).length
      });
      
      // Convert players object to Map for React state
      const playersMap = new Map<string, Player>();
      Object.entries(state.players).forEach(([id, player]) => {
        playersMap.set(id, player as Player);
      });
      const gameState: GameSession = {
        ...state,
        players: playersMap
      };
      setGameState(gameState);
      
      // Update codeword if it changed
      if (state.codeword && state.codeword !== codeword) {
        console.log(`[game-state] Codeword changed from ${codeword} to ${state.codeword}`);
        setCodeword(state.codeword);
        setCookie('gameCodeword', state.codeword);
      }
      
      setError(null); // Clear any errors when we receive game state
      console.log('[game-state] Game state updated in UI, stage:', gameState.stage);
    });

    socket.on('codeword-updated', (data: { newCodeword: string }) => {
      setCodeword(data.newCodeword);
      setCookie('gameCodeword', data.newCodeword);
      console.log('Codeword updated via event:', data.newCodeword);
    });

    socket.on('session-ended', () => {
      setError(tRef.current('sessionEnded'));
      setGameState(null);
      setCodeword('');
      clearSessionCookies();
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('session-created');
      socket.off('join-success');
      socket.off('join-error');
      socket.off('rejoin-success');
      socket.off('rejoin-error');
      socket.off('game-state');
      socket.off('codeword-updated');
      socket.off('session-ended');
    };
  }, []);

  const handleCreateSession = () => {
    if (!playerName.trim()) {
      setError(t('enterYourName'));
      return;
    }
    // Get the language from browser or default to English
    const browserLang = typeof navigator !== 'undefined' ? navigator.language.split('-')[0] : 'en';
    const langMap: Record<string, Language> = {
      'es': 'Spanish',
      'fr': 'French',
      'de': 'German',
      'en': 'English'
    };
    const language = langMap[browserLang] || 'English';
    socket.emit('create-session', { playerName: playerName.trim(), language });
  };

  const handleJoinSession = () => {
    if (!playerName.trim()) {
      setError(t('enterYourName'));
      return;
    }
    if (!codeword.trim()) {
      setError(t('enterCodeword'));
      return;
    }
    socket.emit('join-session', {
      codeword: codeword.trim().toLowerCase(),
      playerName: playerName.trim()
    });
  };

  if (!isConnected) {
    return (
      <div className="container">
        <div className="waiting-message">{t('connecting')}</div>
      </div>
    );
  }

  if (!gameState) {
    return (
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <img 
            src="/IMG_7604.jpg" 
            alt="Impostor Game" 
            style={{ 
              maxWidth: '150px', 
              width: '50%', 
              height: 'auto', 
              borderRadius: '12px',
              display: 'block'
            }} 
          />
        </div>
        <h1>{t('gameTitle')}</h1>
        {error && <div className="error">{error}</div>}
        <div className="form-group">
          <label htmlFor="playerName">{t('yourName')}</label>
          <input
            id="playerName"
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder={t('enterYourName')}
            maxLength={50}
          />
        </div>
        <div className="form-group">
          <label htmlFor="codeword">{t('codeword')} ({t('leaveEmptyToCreate')})</label>
          <input
            id="codeword"
            type="text"
            value={codeword}
            onChange={(e) => setCodeword(e.target.value.toLowerCase())}
            placeholder={t('enterCodeword')}
            maxLength={10}
            style={{ textTransform: 'lowercase' }}
          />
        </div>
        {codeword ? (
          <button onClick={handleJoinSession}>{t('joinGame')}</button>
        ) : (
          <button onClick={handleCreateSession}>{t('createNewGame')}</button>
        )}
      </div>
    );
  }

  const currentPlayer = playerId
    ? gameState.players.get(playerId)
    : undefined;

  return (
    <div className="container">
      <h1>{t('gameTitle')}</h1>
      {codeword && (
        <div className="codeword-display">
          <div>{t('sessionCode')}:</div>
          <div className="code" style={{ textTransform: 'capitalize' }}>{codeword}</div>
        </div>
      )}
      {error && <div className="error">{error}</div>}

      {gameState.stage === GameStage.LOBBY && (
        <>
          {isAdmin && (
            <Settings gameState={gameState} socket={socket} codeword={codeword} t={t} />
          )}
          <Lobby gameState={gameState} socket={socket} isAdmin={isAdmin} t={t} />
        </>
      )}

      {gameState.stage === GameStage.WORD_ENTRY && (
        <WordEntryStage
          gameState={gameState}
          socket={socket}
          codeword={codeword}
          currentPlayer={currentPlayer}
          t={t}
        />
      )}

      {gameState.stage === GameStage.WAITING_WORDS && (
        <WaitingRoom gameState={gameState} socket={socket} isAdmin={isAdmin} codeword={codeword} t={t} />
      )}

      {gameState.stage === GameStage.PLAYING && (
        <GameRound
          gameState={gameState}
          socket={socket}
          isAdmin={isAdmin}
          codeword={codeword}
          currentPlayer={currentPlayer}
          t={t}
        />
      )}

      {gameState.stage === GameStage.FINISHED && (
        <div className="waiting-message">
          <h2>{t('gameFinished')}</h2>
          {isAdmin && (
            <>
              <button onClick={() => socket.emit('restart-game', { codeword })}>
                {t('restartGame')}
              </button>
              <button 
                onClick={() => {
                  clearSessionCookies();
                  setGameState(null);
                  setCodeword('');
                  setPlayerName('');
                  setPlayerId(null);
                  setIsAdmin(false);
                  setError(null);
                }}
                style={{ marginTop: '12px', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}
              >
                {t('startNewGame')}
              </button>
            </>
          )}
          {!isAdmin && (
            <button 
              onClick={() => {
                clearSessionCookies();
                setGameState(null);
                setCodeword('');
                setPlayerName('');
                setPlayerId(null);
                setIsAdmin(false);
                setError(null);
              }}
              style={{ marginTop: '12px', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}
            >
              {t('startNewGame')}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default App;

