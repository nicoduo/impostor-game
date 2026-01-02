import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import path from 'path';
import { GameSession, GameStage, Player, WordEntry, Language } from './types';
import { createGameSession } from './gameManager';
import { generateCodeword } from './wordLists';

const app = express();
const httpServer = createServer(app);

const PORT = process.env.PORT || 3001;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

const io = new Server(httpServer, {
  cors: {
    origin: CLIENT_URL,
    methods: ['GET', 'POST']
  }
});

app.use(cors({
  origin: CLIENT_URL
}));
app.use(express.json());

// Serve static files from client build in production
if (process.env.NODE_ENV === 'production') {
  const clientPath = path.join(__dirname, 'client');
  console.log('Serving static files from:', clientPath);
  app.use(express.static(clientPath));
  
  // Serve index.html for all non-API routes (SPA routing)
  // This must be after all other routes
  app.get('*', (req, res, next) => {
    // Skip API routes and socket.io
    if (req.path.startsWith('/socket.io')) {
      return next();
    }
    // Skip static assets (images, etc.)
    if (req.path.match(/\.(png|jpg|jpeg|gif|svg|ico|css|js|woff|woff2|ttf|eot)$/)) {
      return next();
    }
    res.sendFile(path.join(clientPath, 'index.html'));
  });
}

// Store active sessions
const sessions = new Map<string, GameSession>();

// Helper function to serialize game state for Socket.io (convert Map to object)
function serializeGameState(session: GameSession): any {
  const playersObj: { [key: string]: Player } = {};
  session.players.forEach((player, id) => {
    playersObj[id] = player;
  });

  return {
    ...session,
    players: playersObj
  };
}

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('create-session', (data: { playerName: string; language?: Language }) => {
    const language = (data.language || 'English') as Language;
    const codeword = generateCodeword(language).toLowerCase();
    const session = createGameSession(codeword, socket.id, data.playerName);
    // Set the language in session settings
    session.settings.language = language;
    sessions.set(codeword, session);
    
    socket.join(codeword);
    socket.emit('session-created', { codeword, isAdmin: true, playerId: socket.id });
    socket.emit('game-state', serializeGameState(session));
    console.log(`Session created: ${codeword} by ${data.playerName}`);
  });

  socket.on('join-session', (data: { codeword: string; playerName: string }) => {
    const session = sessions.get(data.codeword);
    
    if (!session) {
      socket.emit('join-error', { message: 'Invalid codeword' });
      return;
    }

    if (session.stage !== GameStage.LOBBY) {
      socket.emit('join-error', { message: 'Game already in progress' });
      return;
    }

    const player: Player = {
      id: socket.id,
      name: data.playerName,
      isAdmin: false,
      words: [],
      isReady: false
    };

    session.players.set(socket.id, player);
    socket.join(data.codeword);
    socket.emit('join-success', { isAdmin: false, playerId: socket.id });
    
    io.to(data.codeword).emit('game-state', serializeGameState(session));
    console.log(`${data.playerName} joined session ${data.codeword}`);
  });

  socket.on('update-settings', (data: {
    codeword: string;
    numImpostors: number;
    wordsPerPlayer: number;
    usersEnterWords: boolean;
    language: string;
  }) => {
    const session = sessions.get(data.codeword);
    if (!session || !session.players.get(socket.id)?.isAdmin) {
      return;
    }

    session.settings.numImpostors = data.numImpostors;
    session.settings.wordsPerPlayer = data.wordsPerPlayer;
    session.settings.usersEnterWords = data.usersEnterWords;
    session.settings.language = data.language;

    io.to(data.codeword).emit('game-state', serializeGameState(session));
  });

  socket.on('start-game', (data: { codeword: string }) => {
    const session = sessions.get(data.codeword);
    if (!session || !session.players.get(socket.id)?.isAdmin) {
      return;
    }

    if (session.stage === GameStage.LOBBY) {
      session.stage = GameStage.WORD_ENTRY;
      io.to(data.codeword).emit('game-state', serializeGameState(session));
    } else if (session.stage === GameStage.WAITING_WORDS) {
      if (session.wordPool.length === 0) {
        return;
      }
      session.stage = GameStage.PLAYING;
      session.currentRound = 0;
      session.totalRounds = session.wordPool.length;
      startRound(session, data.codeword);
    }
  });

  socket.on('submit-words', (data: { codeword: string; words: WordEntry[] }) => {
    const session = sessions.get(data.codeword);
    if (!session) return;

    const player = session.players.get(socket.id);
    if (!player) return;

    player.words = data.words;
    player.isReady = true;

    // Rebuild word pool from all players' words
    session.wordPool = [];
    session.players.forEach((p) => {
      session.wordPool.push(...p.words);
    });

    // Check if all players are ready
    const allReady = Array.from(session.players.values()).every((p) => p.isReady);
    if (allReady) {
      session.stage = GameStage.WAITING_WORDS;
    }

    io.to(data.codeword).emit('game-state', serializeGameState(session));
  });

  socket.on('next-round', (data: { codeword: string }) => {
    const session = sessions.get(data.codeword);
    if (!session || !session.players.get(socket.id)?.isAdmin) {
      return;
    }

    if (session.stage === GameStage.PLAYING) {
      session.currentRound++;
      if (session.currentRound >= session.totalRounds) {
        session.stage = GameStage.FINISHED;
        io.to(data.codeword).emit('game-state', serializeGameState(session));
      } else {
        startRound(session, data.codeword);
      }
    }
  });

  socket.on('restart-game', (data: { codeword: string }) => {
    const session = sessions.get(data.codeword);
    if (!session || !session.players.get(socket.id)?.isAdmin) {
      return;
    }

    // Reset all players
    session.players.forEach((player) => {
      player.words = [];
      player.isReady = false;
    });

    session.wordPool = [];
    session.totalRounds = 0;
    session.currentRound = 0;
    session.currentWord = null;
    session.currentCategory = null;
    session.stage = GameStage.WORD_ENTRY;

    io.to(data.codeword).emit('game-state', serializeGameState(session));
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    
    // Find and remove player from sessions
    for (const [codeword, session] of sessions.entries()) {
      if (session.players.has(socket.id)) {
        const player = session.players.get(socket.id);
        if (player?.isAdmin) {
          // If admin disconnects, end session
          sessions.delete(codeword);
          io.to(codeword).emit('session-ended');
        } else {
          session.players.delete(socket.id);
          io.to(codeword).emit('game-state', serializeGameState(session));
        }
        break;
      }
    }
  });
});

function startRound(session: GameSession, codeword: string) {
  if (session.wordPool.length === 0) {
    session.stage = GameStage.FINISHED;
    io.to(codeword).emit('game-state', serializeGameState(session));
    return;
  }

  // Get random word from pool
  const randomIndex = Math.floor(Math.random() * session.wordPool.length);
  const wordEntry = session.wordPool[randomIndex];
  session.currentWord = wordEntry.word;
  session.currentCategory = wordEntry.category;
  
  // Remove word from pool
  session.wordPool.splice(randomIndex, 1);

  // Assign impostors randomly
  const playerIds = Array.from(session.players.keys());
  const impostorIds = new Set<string>();
  const numImpostors = Math.min(
    session.settings.numImpostors,
    playerIds.length
  );

  while (impostorIds.size < numImpostors) {
    const randomPlayerId = playerIds[Math.floor(Math.random() * playerIds.length)];
    impostorIds.add(randomPlayerId);
  }

  session.currentImpostors = Array.from(impostorIds);

  io.to(codeword).emit('game-state', serializeGameState(session));
}

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

