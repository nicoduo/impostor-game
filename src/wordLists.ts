import { Language } from './types';

// Re-export for convenience
export type { Language };

// Word lists - 5 letters or shorter, easy to pronounce and share
const WORD_LISTS: Record<Language, string[]> = {
  English: [
    'apple', 'beach', 'cloud', 'dance', 'earth', 'flame', 'grace', 'happy',
    'jazz', 'light', 'magic', 'night', 'ocean', 'peace', 'queen', 'river',
    'smile', 'tiger', 'unity', 'vital', 'water', 'zebra', 'angel', 'brave',
    'crown', 'dream', 'eagle', 'faith', 'giant', 'heart', 'island', 'jolly',
    'karma', 'lucky', 'music', 'noble', 'olive', 'pride', 'quick', 'royal',
    'sweet', 'trust', 'ultra', 'vivid', 'witty', 'xenon', 'young', 'zesty',
    'amber', 'bliss', 'charm', 'daisy', 'elite', 'fancy', 'glory', 'honor',
    'ivory', 'jewel', 'kayak', 'lemon', 'mango', 'nifty', 'oasis', 'piano',
    'quill', 'radar', 'solar', 'tulip', 'urban', 'vapor', 'wheat', 'xerox',
    'yacht', 'alpha', 'beta', 'gamma', 'delta', 'echo'
  ],
  Spanish: [
    'agua', 'bella', 'casa', 'dulce', 'flor', 'gato', 'huevo',
    'isla', 'juego', 'luna', 'mar', 'nube', 'oso', 'paz', 'queso',
    'rio', 'sol', 'tierra', 'uva', 'vida', 'zorro', 'amor', 'bravo',
    'cielo', 'danza', 'fuego', 'honor', 'idea',
    'joven', 'kilo', 'lago', 'miel', 'noche', 'oro',
    'rosa', 'sueño', 'tigre', 'wifi', 'yoga',
    'beso', 'canto', 'gracia',
    'hora', 'karma', 'luz', 'mundo', 'onda',
    'quinta', 'risa', 'sal', 'tren',
    'yema', 'zona', 'alma', 'boca', 'cara', 'dedo'
  ],
  French: [
    'amour', 'belle', 'ciel', 'doux', 'fleur', 'heure',
    'ile', 'lune', 'mer', 'nuit', 'paix',
    'rose', 'terre', 'unite', 'vie', 'zebre', 'ange', 'brave',
    'dame', 'fete', 'grace', 'ideal',
    'joie', 'kilo', 'magie', 'nature', 'ocean', 'prince', 'quete',
    'reine', 'tigre', 'wifi', 'yoga', 'zone',
    'art', 'beau', 'coeur', 'hiver',
    'joli', 'karma', 'lac', 'miel', 'neige', 'or', 'piano',
    'sable', 'tulip', 'vent', 'xenon',
    'yacht', 'zeste', 'alpha', 'beta', 'gamma', 'delta', 'echo'
  ],
  German: [
    'apfel', 'biene', 'clown', 'danke', 'erde', 'feuer', 'haus',
    'insel', 'junge', 'katz', 'licht', 'mond', 'nacht', 'ofen', 'quark',
    'rose', 'sonne', 'tier', 'uhr', 'vogel', 'wald', 'zebra', 'arm',
    'baum', 'dach', 'eule', 'fisch', 'geld', 'hand', 'idee', 'jagd',
    'kalt', 'luft', 'maus', 'nord', 'pferd', 'rad',
    'see', 'wind', 'wifi', 'yoga', 'zahl',
    'adler', 'brot', 'cafe', 'ecke', 'faden', 'gast', 'herz',
    'laut', 'alpha', 'beta', 'gamma', 'delta', 'echo'
  ]
};

export function getRandomWord(language: Language): string {
  const words = WORD_LISTS[language] || WORD_LISTS.English;
  return words[Math.floor(Math.random() * words.length)];
}

export function generateCodeword(language: Language = 'English'): string {
  return getRandomWord(language);
}

export { WORD_LISTS };

