import { GameSession, GameStage, GameSettings, Language } from './types';

// Category keys (used internally, will be translated on client)
const CATEGORY_KEYS = [
  'categorySport',
  'categoryFood',
  'categoryShopping',
  'categoryNature',
  'categoryDestination',
  'categoryTechnology',
  'categoryVehicles',
  'categoryCelebrities'
];

// Default English categories (for server-side use)
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

// This function is now in wordLists.ts, keeping for backwards compatibility
export function generateCodeword(): string {
  // This should not be used anymore, but keeping for compatibility
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let codeword = '';
  for (let i = 0; i < 6; i++) {
    codeword += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return codeword;
}

export function getRandomCategory(language: Language = 'English'): string {
  // For server-side, we use English categories
  // The client will translate them based on the game language
  return CATEGORIES_EN[Math.floor(Math.random() * CATEGORIES_EN.length)];
}

export function getCategoryKey(category: string): string {
  const index = CATEGORIES_EN.indexOf(category);
  return index >= 0 ? CATEGORY_KEYS[index] : 'categorySport';
}

export function createGameSession(
  codeword: string,
  adminId: string,
  adminName: string
): GameSession {
  const settings: GameSettings = {
    numImpostors: 1,
    wordsPerPlayer: 3,
    usersEnterWords: true,
    language: 'Spanish'
  };

  const session: GameSession = {
    codeword,
    stage: GameStage.LOBBY,
    players: new Map(),
    settings,
    wordPool: [],
    totalRounds: 0,
    currentRound: 0,
    currentWord: null,
    currentCategory: null,
    currentImpostors: []
  };

  session.players.set(adminId, {
    id: adminId,
    name: adminName,
    isAdmin: true,
    words: [],
    isReady: false
  });

  return session;
}

export function getGameSession(codeword: string): GameSession | undefined {
  // This will be used by the server to get sessions
  return undefined; // Implemented in server.ts
}

export { CATEGORIES_EN as CATEGORIES };

