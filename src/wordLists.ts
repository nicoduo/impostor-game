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
    'yacht', 'zebra', 'alpha', 'beta', 'gamma', 'delta', 'echo', 'foxtrot'
  ],
  Spanish: [
    'agua', 'bella', 'casa', 'dulce', 'estrella', 'flor', 'gato', 'huevo',
    'isla', 'juego', 'luna', 'mar', 'nube', 'oso', 'paz', 'queso',
    'rio', 'sol', 'tierra', 'uva', 'vida', 'zorro', 'amor', 'bravo',
    'cielo', 'danza', 'elefante', 'fuego', 'girasol', 'honor', 'idea',
    'joven', 'kilo', 'lago', 'miel', 'noche', 'oro', 'piedra', 'quince',
    'rosa', 'sueño', 'tigre', 'uva', 'viento', 'wifi', 'yoga', 'zapato',
    'abrazo', 'beso', 'canto', 'dulce', 'estrella', 'fiesta', 'gracia',
    'hora', 'isla', 'juego', 'karma', 'luz', 'mundo', 'naturaleza', 'onda',
    'paz', 'quinta', 'risa', 'sal', 'tren', 'universo', 'vida', 'wifi',
    'xilofon', 'yema', 'zona', 'alma', 'boca', 'cara', 'dedo', 'espejo'
  ],
  French: [
    'amour', 'belle', 'ciel', 'doux', 'etoile', 'fleur', 'gateau', 'heure',
    'ile', 'jardin', 'lune', 'mer', 'nuit', 'oiseau', 'paix', 'quatre',
    'rose', 'soleil', 'terre', 'unite', 'vie', 'zebre', 'ange', 'brave',
    'charme', 'dame', 'elegant', 'fete', 'grace', 'honneur', 'ideal',
    'joie', 'kilo', 'lumiere', 'magie', 'nature', 'ocean', 'prince', 'quete',
    'reine', 'sourire', 'tigre', 'unique', 'valeur', 'wifi', 'yoga', 'zone',
    'art', 'beau', 'coeur', 'dame', 'elite', 'fleur', 'gloire', 'hiver',
    'ile', 'joli', 'karma', 'lac', 'miel', 'neige', 'or', 'piano',
    'quatre', 'riviere', 'sable', 'tulip', 'univers', 'vent', 'wifi', 'xenon',
    'yacht', 'zeste', 'alpha', 'beta', 'gamma', 'delta', 'echo', 'foxtrot'
  ],
  German: [
    'apfel', 'biene', 'clown', 'danke', 'erde', 'feuer', 'garten', 'haus',
    'insel', 'junge', 'katz', 'licht', 'mond', 'nacht', 'ofen', 'quark',
    'rose', 'sonne', 'tier', 'uhr', 'vogel', 'wald', 'zebra', 'arm',
    'baum', 'dach', 'eule', 'fisch', 'geld', 'hand', 'idee', 'jagd',
    'kalt', 'luft', 'maus', 'nord', 'ofen', 'pferd', 'quark', 'rad',
    'see', 'tier', 'uhr', 'vogel', 'wind', 'wifi', 'yoga', 'zahl',
    'adler', 'brot', 'cafe', 'dach', 'ecke', 'faden', 'gast', 'herz',
    'insel', 'jagd', 'kalt', 'laut', 'maus', 'nord', 'ofen', 'pferd',
    'quark', 'rad', 'see', 'tier', 'uhr', 'vogel', 'wind', 'wifi',
    'yoga', 'zahl', 'alpha', 'beta', 'gamma', 'delta', 'echo', 'foxtrot'
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

