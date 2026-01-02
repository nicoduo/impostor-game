import { useMemo } from 'react';
import { Language, Translations, getTranslation } from '../translations';
import { GameSession } from '../../types';

export function useTranslation(gameState: GameSession | null): {
  t: (key: keyof Translations, params?: Record<string, string | number>) => string;
  language: Language;
} {
  const language = useMemo(() => {
    if (!gameState) {
      // Try to detect browser language
      const browserLang = navigator.language.split('-')[0];
      const langMap: Record<string, Language> = {
        'es': 'Spanish',
        'fr': 'French',
        'de': 'German',
        'en': 'English'
      };
      return langMap[browserLang] || 'English';
    }
    
    // Use game settings language
    const gameLang = gameState.settings.language as Language;
    return translations[gameLang] ? gameLang : 'English';
  }, [gameState]);

  const t = (key: keyof Translations, params?: Record<string, string | number>) => {
    return getTranslation(language, key, params);
  };

  return { t, language };
}

