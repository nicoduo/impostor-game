export enum GameStage {
  LOBBY = 'lobby',
  WORD_ENTRY = 'word_entry',
  WAITING_WORDS = 'waiting_words',
  PLAYING = 'playing',
  FINISHED = 'finished'
}

export interface WordEntry {
  word: string;
  category: string;
}

export interface Player {
  id: string;
  name: string;
  isAdmin: boolean;
  words: WordEntry[];
  isReady: boolean;
}

export interface GameSettings {
  numImpostors: number;
  wordsPerPlayer: number;
  usersEnterWords: boolean;
  language: string;
}

export interface GameSession {
  codeword: string;
  stage: GameStage;
  players: Map<string, Player>;
  settings: GameSettings;
  wordPool: WordEntry[];
  totalRounds: number;
  currentRound: number;
  currentWord: string | null;
  currentCategory: string | null;
  currentImpostors: string[];
}

