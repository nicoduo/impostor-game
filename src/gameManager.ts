import { GameSession, GameStage, GameSettings } from './types';

const CATEGORIES = [
  'Sport',
  'Food',
  'Shopping',
  'Nature',
  'Destination',
  'Technology',
  'Vehicles'
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

export function getRandomCategory(): string {
  return CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
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

export { CATEGORIES };

