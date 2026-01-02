import React, { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { GameSession, Player, WordEntry } from '../../types';
import { Translations } from '../translations';

const CATEGORIES = [
  'Sport',
  'Food',
  'Shopping',
  'Nature',
  'Destination',
  'Technology',
  'Vehicles'
];

const getRandomCategory = (): string => {
  return CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
};

interface WordEntryStageProps {
  gameState: GameSession;
  socket: Socket;
  codeword: string;
  currentPlayer: Player | undefined;
  t: (key: keyof Translations, params?: Record<string, string | number>) => string;
}

const WordEntryStage: React.FC<WordEntryStageProps> = ({
  gameState,
  socket,
  codeword,
  currentPlayer,
  t
}) => {
  const [words, setWords] = useState<WordEntry[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const numWords = gameState.settings.wordsPerPlayer;
    const newCategories: string[] = [];
    for (let i = 0; i < numWords; i++) {
      newCategories.push(getRandomCategory());
    }
    setCategories(newCategories);
    setWords(Array(numWords).fill(null).map(() => ({ word: '', category: '' })));
  }, [gameState.settings.wordsPerPlayer]);

  useEffect(() => {
    if (currentPlayer?.words && currentPlayer.words.length > 0) {
      setWords(currentPlayer.words);
    }
  }, [currentPlayer]);

  const handleWordChange = (index: number, value: string) => {
    const newWords = [...words];
    newWords[index] = {
      word: value,
      category: categories[index]
    };
    setWords(newWords);
  };

  const handleSubmit = () => {
    if (words.every((w) => w.word.trim() !== '')) {
      socket.emit('submit-words', { codeword, words });
    }
  };

  const allWordsFilled = words.every((w) => w.word.trim() !== '');
  const isReady = currentPlayer?.isReady || false;

  if (isReady) {
    return (
      <div className="waiting-message">
        <h2>{t('wordsSubmitted')}</h2>
        <p>{t('waitingForPlayers')}</p>
      </div>
    );
  }

  return (
    <div>
      <h2>{t('enterYourWords')}</h2>
      <p style={{ marginBottom: '16px', color: '#666' }}>
        {t('enterWordsDescription', { count: gameState.settings.wordsPerPlayer })}
      </p>
      {words.map((wordEntry, index) => (
        <div key={index} className="word-entry-form">
          <div className="category-badge">{categories[index]}</div>
          <div className="form-group">
            <label htmlFor={`word-${index}`}>{t('word')} {index + 1}</label>
            <input
              id={`word-${index}`}
              type="text"
              value={wordEntry.word}
              onChange={(e) => handleWordChange(index, e.target.value)}
              placeholder={`${t('enterYourWords')} ${t('word')} ${t('category').toLowerCase()} ${categories[index]}`}
              maxLength={50}
            />
          </div>
        </div>
      ))}
      <button onClick={handleSubmit} disabled={!allWordsFilled}>
        {t('submitWords')}
      </button>
    </div>
  );
};

export default WordEntryStage;

