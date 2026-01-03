import React, { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { GameSession } from '../../types';
import { Translations } from '../translations';

interface SettingsProps {
  gameState: GameSession;
  socket: Socket;
  codeword: string;
  t: (key: keyof Translations, params?: Record<string, string | number>) => string;
}

const Settings: React.FC<SettingsProps> = ({ gameState, socket, codeword, t }) => {
  const [numImpostors, setNumImpostors] = useState(gameState.settings.numImpostors);
  const [wordsPerPlayer, setWordsPerPlayer] = useState(gameState.settings.wordsPerPlayer);
  const [usersEnterWords, setUsersEnterWords] = useState(gameState.settings.usersEnterWords);
  const [language, setLanguage] = useState(gameState.settings.language);

  useEffect(() => {
    setNumImpostors(gameState.settings.numImpostors);
    setWordsPerPlayer(gameState.settings.wordsPerPlayer);
    setUsersEnterWords(gameState.settings.usersEnterWords);
    setLanguage(gameState.settings.language);
  }, [gameState.settings]);

  const handleUpdateSettings = () => {
    console.log('Settings: Updating settings with values:', {
      codeword,
      numImpostors,
      wordsPerPlayer,
      usersEnterWords,
      language
    });
    socket.emit('update-settings', {
      codeword,
      numImpostors,
      wordsPerPlayer,
      usersEnterWords,
      language
    });
  };

  return (
    <div style={{ marginBottom: '32px', padding: '20px', background: '#f9f9f9', borderRadius: '8px' }}>
      <h2>{t('gameSettings')}</h2>
      <div className="form-group">
        <label htmlFor="numImpostors">{t('numberOfImpostors')}</label>
        <input
          id="numImpostors"
          type="number"
          min="1"
          max={gameState.players.size - 1}
          value={numImpostors}
          onChange={(e) => setNumImpostors(parseInt(e.target.value) || 1)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="wordsPerPlayer">{t('wordsPerPlayer')}</label>
        <input
          id="wordsPerPlayer"
          type="number"
          min="1"
          max="10"
          value={wordsPerPlayer}
          onChange={(e) => setWordsPerPlayer(parseInt(e.target.value) || 1)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="usersEnterWords">{t('usersEnterWords')}</label>
        <select
          id="usersEnterWords"
          value={usersEnterWords ? 'true' : 'false'}
          onChange={(e) => setUsersEnterWords(e.target.value === 'true')}
        >
          <option value="true">{t('yes')}</option>
          <option value="false">{t('noRandom')}</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="language">{t('language')}</label>
        <select
          id="language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="Spanish">Spanish</option>
          <option value="English">English</option>
          <option value="French">French</option>
          <option value="German">German</option>
        </select>
      </div>
      <button onClick={handleUpdateSettings}>{t('updateSettings')}</button>
    </div>
  );
};

export default Settings;

