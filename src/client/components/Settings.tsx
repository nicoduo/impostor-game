import React, { useState, useEffect, useRef } from 'react';
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
  
  // Track if this is the initial mount to avoid emitting on first render
  const isInitialMount = useRef(true);

  useEffect(() => {
    setNumImpostors(gameState.settings.numImpostors);
    setWordsPerPlayer(gameState.settings.wordsPerPlayer);
    setUsersEnterWords(gameState.settings.usersEnterWords);
    setLanguage(gameState.settings.language);
    // Reset initial mount flag when gameState changes (e.g., after rejoin)
    isInitialMount.current = true;
  }, [gameState.settings]);

  // Auto-update settings when any value changes
  useEffect(() => {
    // Skip the first render to avoid emitting on mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    console.log('[Settings] Auto-updating settings:', {
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
  }, [numImpostors, wordsPerPlayer, usersEnterWords, language, codeword, socket]);

  return (
    <div style={{ marginBottom: '32px', padding: '20px', background: '#f9f9f9', borderRadius: '8px' }}>
      <h2>{t('gameSettings')}</h2>
      <div className="form-group">
        <label htmlFor="numImpostors">{t('numberOfImpostors')}</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            type="button"
            onClick={() => {
              const newValue = Math.max(1, numImpostors - 1);
              setNumImpostors(newValue);
            }}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              border: '2px solid #ddd',
              background: '#fff',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: numImpostors <= 1 ? '#ccc' : '#333',
              transition: 'all 0.2s ease'
            }}
            disabled={numImpostors <= 1}
            onMouseEnter={(e) => {
              if (numImpostors > 1) {
                e.currentTarget.style.background = '#f0f0f0';
                e.currentTarget.style.borderColor = '#999';
              }
            }}
            onMouseLeave={(e) => {
              if (numImpostors > 1) {
                e.currentTarget.style.background = '#fff';
                e.currentTarget.style.borderColor = '#ddd';
              }
            }}
          >
            −
          </button>
          <div
            style={{
              minWidth: '60px',
              textAlign: 'center',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              padding: '8px 16px',
              background: '#f5f5f5',
              borderRadius: '8px',
              border: '2px solid #ddd'
            }}
          >
            {numImpostors}
          </div>
          <button
            type="button"
            onClick={() => {
              const maxImpostors = Math.max(1, gameState.players.size - 1);
              const newValue = Math.min(maxImpostors, numImpostors + 1);
              setNumImpostors(newValue);
            }}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              border: '2px solid #ddd',
              background: '#fff',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: numImpostors >= Math.max(1, gameState.players.size - 1) ? '#ccc' : '#333',
              transition: 'all 0.2s ease'
            }}
            disabled={numImpostors >= Math.max(1, gameState.players.size - 1)}
            onMouseEnter={(e) => {
              const maxImpostors = Math.max(1, gameState.players.size - 1);
              if (numImpostors < maxImpostors) {
                e.currentTarget.style.background = '#f0f0f0';
                e.currentTarget.style.borderColor = '#999';
              }
            }}
            onMouseLeave={(e) => {
              const maxImpostors = Math.max(1, gameState.players.size - 1);
              if (numImpostors < maxImpostors) {
                e.currentTarget.style.background = '#fff';
                e.currentTarget.style.borderColor = '#ddd';
              }
            }}
          >
            +
          </button>
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="wordsPerPlayer">{t('wordsPerPlayer')}</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            type="button"
            onClick={() => {
              const newValue = Math.max(1, wordsPerPlayer - 1);
              setWordsPerPlayer(newValue);
            }}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              border: '2px solid #ddd',
              background: '#fff',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: wordsPerPlayer <= 1 ? '#ccc' : '#333',
              transition: 'all 0.2s ease'
            }}
            disabled={wordsPerPlayer <= 1}
            onMouseEnter={(e) => {
              if (wordsPerPlayer > 1) {
                e.currentTarget.style.background = '#f0f0f0';
                e.currentTarget.style.borderColor = '#999';
              }
            }}
            onMouseLeave={(e) => {
              if (wordsPerPlayer > 1) {
                e.currentTarget.style.background = '#fff';
                e.currentTarget.style.borderColor = '#ddd';
              }
            }}
          >
            −
          </button>
          <div
            style={{
              minWidth: '60px',
              textAlign: 'center',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              padding: '8px 16px',
              background: '#f5f5f5',
              borderRadius: '8px',
              border: '2px solid #ddd'
            }}
          >
            {wordsPerPlayer}
          </div>
          <button
            type="button"
            onClick={() => {
              const newValue = Math.min(10, wordsPerPlayer + 1);
              setWordsPerPlayer(newValue);
            }}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              border: '2px solid #ddd',
              background: '#fff',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: wordsPerPlayer >= 10 ? '#ccc' : '#333',
              transition: 'all 0.2s ease'
            }}
            disabled={wordsPerPlayer >= 10}
            onMouseEnter={(e) => {
              if (wordsPerPlayer < 10) {
                e.currentTarget.style.background = '#f0f0f0';
                e.currentTarget.style.borderColor = '#999';
              }
            }}
            onMouseLeave={(e) => {
              if (wordsPerPlayer < 10) {
                e.currentTarget.style.background = '#fff';
                e.currentTarget.style.borderColor = '#ddd';
              }
            }}
          >
            +
          </button>
        </div>
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
    </div>
  );
};

export default Settings;

