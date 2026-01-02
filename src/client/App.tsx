import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { GameSession, GameStage, Player, WordEntry, Language } from '../types';
import Lobby from './components/Lobby';
import Settings from './components/Settings';
import WordEntryStage from './components/WordEntryStage';
import WaitingRoom from './components/WaitingRoom';
import GameRound from './components/GameRound';
import { useTranslation } from './hooks/useTranslation';
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
  
  // Keep ref updated
  useEffect(() => {
    tRef.current = t;
  }, [t]);

  // Load saved session from cookies on mount
  useEffect(() => {
    const savedCodeword = getCookie('gameCodeword');
    const savedPlayerName = getCookie('playerName');
    
    if (savedCodeword && savedPlayerName) {
      setCodeword(savedCodeword);
      setPlayerName(savedPlayerName);
    }
  }, []);

  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to server');
      
      // Try to reconnect to previous session
      const savedCodeword = getCookie('gameCodeword');
      const savedPlayerName = getCookie('playerName');
      
      if (savedCodeword && savedPlayerName) {
        console.log('Attempting to reconnect to session:', savedCodeword);
        socket.emit('rejoin-session', {
          codeword: savedCodeword,
          playerName: savedPlayerName
        });
      }
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from server');
    });

    socket.on('session-created', (data: { codeword: string; isAdmin: boolean; playerId: string }) => {
      setCodeword(data.codeword);
      setIsAdmin(data.isAdmin);
      setPlayerId(data.playerId);
      setError(null);
      // Save to cookies
      setCookie('gameCodeword', data.codeword);
      setCookie('playerName', playerName);
      setCookie('oldPlayerId', data.playerId);
    });

    socket.on('join-success', (data: { isAdmin: boolean; playerId: string }) => {
      setIsAdmin(data.isAdmin);
      setPlayerId(data.playerId);
      setError(null);
      // Save to cookies
      if (codeword) {
        setCookie('gameCodeword', codeword);
        setCookie('playerName', playerName);
        setCookie('oldPlayerId', data.playerId);
      }
    });
    
    socket.on('rejoin-success', (data: { isAdmin: boolean; playerId: string }) => {
      setIsAdmin(data.isAdmin);
      setPlayerId(data.playerId);
      setError(null);
      // Cookies already set, just update playerId
      setCookie('oldPlayerId', data.playerId);
    });
    
    socket.on('rejoin-error', (data: { message: string }) => {
      // Clear cookies if rejoin failed
      clearSessionCookies();
      setError(data.message);
      setGameState(null);
      setCodeword('');
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
        <>
          {isAdmin && (
            <Settings gameState={gameState} socket={socket} codeword={codeword} t={t} />
          )}
          <WordEntryStage
            gameState={gameState}
            socket={socket}
            codeword={codeword}
            currentPlayer={currentPlayer}
            t={t}
          />
        </>
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
            <button onClick={() => socket.emit('restart-game', { codeword })}>
              {t('restartGame')}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default App;

