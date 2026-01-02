import React from 'react';
import { Socket } from 'socket.io-client';
import { GameSession } from '../../types';
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

  return (
    <div>
      <div className="waiting-message">
        <h2>{t('waitingRoom')}</h2>
        <p>{t('allPlayersReady')}</p>
        <p style={{ marginTop: '16px', fontSize: '1rem' }}>
          {t('totalWordsInPool')}: <strong>{gameState.wordPool.length}</strong>
        </p>
        {isAdmin && (
          <button onClick={handleStartGame} style={{ marginTop: '24px' }}>
            {t('startGame')}
          </button>
        )}
      </div>
    </div>
  );
};

export default WaitingRoom;

