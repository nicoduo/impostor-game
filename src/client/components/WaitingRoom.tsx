import React from 'react';
import { Socket } from 'socket.io-client';
import { GameSession, Player } from '../../types';
import { Translations } from '../translations';

interface WaitingRoomProps {
  gameState: GameSession;
  socket: Socket;
  isAdmin: boolean;
  codeword: string;
  t: (key: keyof Translations, params?: Record<string, string | number>) => string;
}

const WaitingRoom: React.FC<WaitingRoomProps> = ({ gameState, socket, isAdmin, codeword, t }) => {
  const handleStartGame = () => {
    socket.emit('start-game', { codeword });
  };

  // Recalculate players lists whenever gameState changes
  // This ensures the component updates when game-state is received
  const players = Array.from(gameState.players.values());
  const readyPlayers = players.filter(p => p.isReady);
  const notReadyPlayers = players.filter(p => !p.isReady);

  const allReady = notReadyPlayers.length === 0;
  
  // Log for debugging
  React.useEffect(() => {
    console.log('[WaitingRoom] Player status updated:', {
      total: players.length,
      ready: readyPlayers.length,
      notReady: notReadyPlayers.length,
      readyNames: readyPlayers.map(p => p.name),
      notReadyNames: notReadyPlayers.map(p => p.name)
    });
  }, [players.length, readyPlayers.length, notReadyPlayers.length]);

  return (
    <div>
      <h2>{t('waitingRoom')}</h2>
      
      {allReady ? (
        <div className="waiting-message">
          <p style={{ color: '#3c3', fontWeight: 'bold' }}>{t('allPlayersReady')}</p>
        </div>
      ) : (
        <div className="waiting-message">
          <p>{t('waitingForPlayers')}</p>
          <p style={{ marginTop: '8px', fontSize: '0.9rem', color: '#666' }}>
            {readyPlayers.length} / {players.length} {t('wordsSubmitted').toLowerCase()}
          </p>
        </div>
      )}

      <div style={{ marginTop: '24px' }}>
        {readyPlayers.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ color: '#3c3', marginBottom: '12px', fontSize: '1.1rem' }}>
              ✓ {t('wordsSubmitted')} ({readyPlayers.length})
            </h3>
            <ul className="player-list">
              {readyPlayers.map((player: Player) => (
                <li key={player.id} className={player.isAdmin ? 'admin' : ''} style={{ background: '#e8f5e9' }}>
                  <span>{player.name}</span>
                  <span style={{ color: '#3c3', fontWeight: 'bold' }}>✓ {t('wordsSubmitted')}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {notReadyPlayers.length > 0 && (
          <div>
            <h3 style={{ color: '#f57c00', marginBottom: '12px', fontSize: '1.1rem' }}>
              ⏳ {t('waitingForPlayers')} ({notReadyPlayers.length})
            </h3>
            <ul className="player-list">
              {notReadyPlayers.map((player: Player) => (
                <li key={player.id} className={player.isAdmin ? 'admin' : ''} style={{ background: '#fff3e0' }}>
                  <span>{player.name}</span>
                  <span style={{ color: '#f57c00', fontWeight: 'bold' }}>⏳ {t('word')}...</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div style={{ marginTop: '24px', textAlign: 'center', padding: '16px', background: '#f5f5f5', borderRadius: '8px' }}>
        <p style={{ fontSize: '1rem', marginBottom: '8px' }}>
          {t('totalWordsInPool')}: <strong>{gameState.wordPool.length}</strong>
        </p>
      </div>

      {isAdmin && allReady && (
        <button onClick={handleStartGame} style={{ marginTop: '24px' }}>
          {t('startGame')}
        </button>
      )}
    </div>
  );
};

export default WaitingRoom;

