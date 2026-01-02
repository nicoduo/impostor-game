import React from 'react';
import { Socket } from 'socket.io-client';
import { GameSession, Player } from '../../types';
import { Translations } from '../translations';

interface GameRoundProps {
  gameState: GameSession;
  socket: Socket;
  isAdmin: boolean;
  codeword: string;
  currentPlayer: Player | undefined;
  t: (key: keyof Translations, params?: Record<string, string | number>) => string;
}

const GameRound: React.FC<GameRoundProps> = ({
  gameState,
  socket,
  isAdmin,
  codeword,
  currentPlayer,
  t
}) => {
  const isImpostor = currentPlayer
    ? gameState.currentImpostors.includes(currentPlayer.id)
    : false;

  const displayedWord = isImpostor ? 'IMPOSTOR' : gameState.currentWord || '';
  const totalRounds = gameState.totalRounds;
  const currentRoundNum = gameState.currentRound + 1;

  const handleNextRound = () => {
    socket.emit('next-round', { codeword });
  };

  return (
    <div>
      <div className="round-info">
        {t('round')} {currentRoundNum} {t('of')} {totalRounds}
      </div>
      <div className="game-display">
        <div className="word">{displayedWord}</div>
        <div className="category">{t('category')}: {gameState.currentCategory}</div>
      </div>
      {isAdmin && (
        <button onClick={handleNextRound}>{t('nextRound')}</button>
      )}
    </div>
  );
};

export default GameRound;

