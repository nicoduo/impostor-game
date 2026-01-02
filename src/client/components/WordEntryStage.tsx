import React, { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { GameSession, Player, WordEntry, Language } from '../../types';
import { Translations, translateCategory } from '../translations';

// English categories (used for random selection, will be translated on display)
const CATEGORIES_EN = [
  'Sport',
  'Food',
  'Shopping',
  'Nature',
  'Destination',
  'Technology',
  'Vehicles',
  'Celebrities'
];

const getRandomCategory = (): string => {
  return CATEGORIES_EN[Math.floor(Math.random() * CATEGORIES_EN.length)];
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
  const [categoryKeys, setCategoryKeys] = useState<string[]>([]); // Store English keys for server

  const language = gameState.settings.language as Language;

  useEffect(() => {
    const numWords = gameState.settings.wordsPerPlayer;
    const newCategoryKeys: string[] = [];
    for (let i = 0; i < numWords; i++) {
      newCategoryKeys.push(getRandomCategory());
    }
    setCategoryKeys(newCategoryKeys);
    
    // Translate categories for display
    const translatedCategories = newCategoryKeys.map(cat => translateCategory(cat, language));
    setCategories(translatedCategories);
    
    setWords(Array(numWords).fill(null).map(() => ({ word: '', category: '' })));
  }, [gameState.settings.wordsPerPlayer, language]);

  useEffect(() => {
    if (currentPlayer?.words && currentPlayer.words.length > 0) {
      setWords(currentPlayer.words);
      // Extract English category keys from player words
      const keys = currentPlayer.words.map(w => w.category);
      setCategoryKeys(keys);
      // Translate for display
      const translated = keys.map(k => translateCategory(k, language));
      setCategories(translated);
    }
  }, [currentPlayer, language]);

  const handleWordChange = (index: number, value: string) => {
    const newWords = [...words];
    // Store the English category key, not the translated version
    newWords[index] = {
      word: value,
      category: categoryKeys[index] // Store English key for server
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
              placeholder={`${t('word')} ${t('category').toLowerCase()} ${categories[index]}`}
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
