import React from 'react';
import { Socket } from 'socket.io-client';
import { GameSession } from '../../types';
import { Translations } from '../translations';

interface LobbyProps {
  gameState: GameSession;
  socket: Socket;
  isAdmin: boolean;
  t: (key: keyof Translations, params?: Record<string, string | number>) => string;
}

const Lobby: React.FC<LobbyProps> = ({ gameState, socket, isAdmin, t }) => {
  const playerCount = gameState.players.size;

  const handleStartGame = () => {
    socket.emit('start-game', { codeword: gameState.codeword });
  };

  return (
    <div>
      <h2>{t('lobby')}</h2>
      <div className="round-info">
        {t('playersInSession')}: <strong>{playerCount}</strong>
      </div>
      <ul className="player-list">
        {Array.from(gameState.players.values()).map((player) => (
          <li key={player.id} className={player.isAdmin ? 'admin' : ''}>
            <span>{player.name}</span>
            {player.isAdmin && <span>👑 {t('admin')}</span>}
          </li>
        ))}
      </ul>
      {isAdmin && (
        <button onClick={handleStartGame}>{t('startGame')}</button>
      )}
    </div>
  );
};

export default Lobby;

