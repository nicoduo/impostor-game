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
import { setSessionInUrl, getSessionFromUrl, clearSessionFromUrl } from './utils/urlParams';
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

  // Load saved session from URL or cookies on mount
  useEffect(() => {
    console.log('[mount] Loading session on component mount');
    // Priority 1: Check URL parameters
    const urlSession = getSessionFromUrl();
    if (urlSession.codeword && urlSession.playerName) {
      console.log('[mount] Found session in URL:', urlSession);
      setCodeword(urlSession.codeword);
      setPlayerName(urlSession.playerName);
      // Also save to cookies as backup
      setCookie('gameCodeword', urlSession.codeword);
      setCookie('playerName', urlSession.playerName);
      console.log('[mount] Loaded session from URL and saved to cookies');
      return;
    }
    
    // Priority 2: Check cookies
    const savedCodeword = getCookie('gameCodeword');
    const savedPlayerName = getCookie('playerName');
    
    console.log('[mount] Loading from cookies:', { savedCodeword, savedPlayerName });
    
    if (savedCodeword && savedPlayerName) {
      console.log('[mount] Found session in cookies');
      setCodeword(savedCodeword);
      setPlayerName(savedPlayerName);
      // Update URL to match cookies
      setSessionInUrl(savedCodeword, savedPlayerName);
      console.log('[mount] Loaded session from cookies and updated URL');
    } else {
      console.log('[mount] No valid session found in URL or cookies');
    }
  }, []);

  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true);
      console.log('[connect] Connected to server, socket ID:', socket.id);
      
      // Try to reconnect to previous session (only once per connection)
      if (!reconnectAttemptedRef.current) {
        reconnectAttemptedRef.current = true;
        
        // Priority 1: Check URL parameters
        const urlSession = getSessionFromUrl();
        let savedCodeword = urlSession.codeword;
        let savedPlayerName = urlSession.playerName;
        
        // Priority 2: Fall back to cookies
        if (!savedCodeword || !savedPlayerName) {
          savedCodeword = getCookie('gameCodeword');
          savedPlayerName = getCookie('playerName');
          // If found in cookies but not URL, update URL
          if (savedCodeword && savedPlayerName) {
            setSessionInUrl(savedCodeword, savedPlayerName);
          }
        }
        
        // Priority 3: Use current state if available
        if (!savedCodeword && codeword) {
          savedCodeword = codeword;
        }
        if (!savedPlayerName && playerName) {
          savedPlayerName = playerName;
        }
        
        if (savedCodeword && savedPlayerName) {
          console.log('[connect] Attempting to reconnect to session:', savedCodeword, 'as', savedPlayerName);
          console.log('[connect] Session found - codeword:', savedCodeword, 'playerName:', savedPlayerName);
          // Small delay to ensure socket is fully connected
          setTimeout(() => {
            console.log('[connect] Emitting rejoin-session event...');
            socket.emit('rejoin-session', {
              codeword: savedCodeword!.trim().toLowerCase(),
              playerName: savedPlayerName!.trim()
            });
          }, 300);
        } else {
          console.log('[connect] No saved session found in URL, cookies, or state');
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
      // Save to cookies and URL - use current playerName state or get from input
      const nameToSave = playerName || document.querySelector<HTMLInputElement>('#playerName')?.value || '';
      
      // Update URL and cookies immediately
      setSessionInUrl(data.codeword, nameToSave);
      setCookie('gameCodeword', data.codeword);
      setCookie('playerName', nameToSave);
      setCookie('oldPlayerId', data.playerId);
      
      console.log('[session-created] URL and cookies updated immediately:', { codeword: data.codeword, playerName: nameToSave });
    });

    socket.on('join-success', (data: { isAdmin: boolean; playerId: string }) => {
      setIsAdmin(data.isAdmin);
      setPlayerId(data.playerId);
      setError(null);
      // Save to cookies and URL - use current state values
      // Note: URL should already be updated in handleJoinSession, but update again to be sure
      if (codeword) {
        const nameToSave = playerName || document.querySelector<HTMLInputElement>('#playerName')?.value || '';
        setSessionInUrl(codeword, nameToSave);
        setCookie('gameCodeword', codeword);
        setCookie('playerName', nameToSave);
        setCookie('oldPlayerId', data.playerId);
        console.log('[join-success] URL and cookies updated:', { codeword, playerName: nameToSave });
      }
    });
    
    socket.on('rejoin-success', (data: { isAdmin: boolean; playerId: string }) => {
      setIsAdmin(data.isAdmin);
      setPlayerId(data.playerId);
      setError(null);
      // Cookies and URL already set, just update playerId
      setCookie('oldPlayerId', data.playerId);
      // Ensure URL is up to date
      const currentCodeword = codeword || getCookie('gameCodeword');
      const currentPlayerName = playerName || getCookie('playerName');
      if (currentCodeword && currentPlayerName) {
        setSessionInUrl(currentCodeword, currentPlayerName);
      }
      // Don't clear gameState here - wait for game-state event
      console.log('Rejoin successful, waiting for game state...');
    });
    
    socket.on('rejoin-error', (data: { message: string }) => {
      console.error('Rejoin error:', data.message);
      // Only clear cookies and URL if it's a definitive error (session not found, etc.)
      // Don't clear on "player not found" during gameplay - they might still be able to rejoin
      if (data.message.includes('Session not found') || data.message.includes('Invalid')) {
        clearSessionCookies();
        clearSessionFromUrl();
        setError(data.message);
        setGameState(null);
        setCodeword('');
      } else {
        // For other errors, just show the error but keep cookies and URL
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
      // Clear URL and cookies on join error
      clearSessionCookies();
      clearSessionFromUrl();
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
        // Update URL with new codeword
        const currentPlayerName = playerName || getCookie('playerName');
        if (currentPlayerName) {
          setSessionInUrl(state.codeword, currentPlayerName);
        }
      }
      
      setError(null); // Clear any errors when we receive game state
      console.log('[game-state] Game state updated in UI, stage:', gameState.stage);
    });

    socket.on('codeword-updated', (data: { newCodeword: string }) => {
      setCodeword(data.newCodeword);
      setCookie('gameCodeword', data.newCodeword);
      // Update URL with new codeword
      const currentPlayerName = playerName || getCookie('playerName');
      if (currentPlayerName) {
        setSessionInUrl(data.newCodeword, currentPlayerName);
      }
      console.log('Codeword updated via event:', data.newCodeword);
    });

    socket.on('session-ended', () => {
      setError(tRef.current('sessionEnded'));
      setGameState(null);
      setCodeword('');
      clearSessionCookies();
      clearSessionFromUrl();
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
    // URL will be updated when session-created event is received
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
    const trimmedCodeword = codeword.trim().toLowerCase();
    const trimmedPlayerName = playerName.trim();
    
    // Update URL immediately when joining
    setSessionInUrl(trimmedCodeword, trimmedPlayerName);
    setCookie('gameCodeword', trimmedCodeword);
    setCookie('playerName', trimmedPlayerName);
    console.log('[handleJoinSession] URL and cookies updated immediately:', { codeword: trimmedCodeword, playerName: trimmedPlayerName });
    
    socket.emit('join-session', {
      codeword: trimmedCodeword,
      playerName: trimmedPlayerName
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

  const handleExitGame = () => {
    if (window.confirm(t('exitGame') + '?')) {
      clearSessionCookies();
      clearSessionFromUrl();
      setGameState(null);
      setCodeword('');
      setPlayerName('');
      setPlayerId(null);
      setIsAdmin(false);
      setError(null);
      // Disconnect from current room if in a session
      if (codeword) {
        socket.emit('leave-session', { codeword });
      }
    }
  };

  return (
    <div className="container">
      {gameState && (
        <button
          onClick={handleExitGame}
          className="exit-game-button"
          title={t('exitGame')}
          aria-label={t('exitGame')}
        >
          ✕
        </button>
      )}
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
          {/* Show waiting room view if player has submitted words */}
          {currentPlayer?.isReady ? (
            <WaitingRoom gameState={gameState} socket={socket} isAdmin={isAdmin} codeword={codeword} t={t} />
          ) : (
            <WordEntryStage
              gameState={gameState}
              socket={socket}
              codeword={codeword}
              currentPlayer={currentPlayer}
              t={t}
            />
          )}
        </>
      )}

      {/* Allow players who join during PLAYING to submit words */}
      {gameState.stage === GameStage.PLAYING && !currentPlayer?.isReady && (
        <div>
          <div className="waiting-message" style={{ marginBottom: '24px' }}>
            <p>{t('gameInProgress')}</p>
            <p style={{ marginTop: '8px', fontSize: '0.9rem', color: '#888' }}>
              {t('joinMidGameMessage')}
            </p>
          </div>
          <WordEntryStage
            gameState={gameState}
            socket={socket}
            codeword={codeword}
            currentPlayer={currentPlayer}
            t={t}
          />
        </div>
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
                clearSessionFromUrl();
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
                clearSessionFromUrl();
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

