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

  socket.on('rejoin-session', (data: { codeword: string; playerName: string }) => {
    console.log(`Rejoin attempt: codeword=${data.codeword}, playerName=${data.playerName}, socketId=${socket.id}`);
    const session = sessions.get(data.codeword);
    
    if (!session) {
      console.log(`Session not found for codeword: ${data.codeword}`);
      socket.emit('rejoin-error', { message: 'Session not found' });
      return;
    }

    console.log(`Session found. Stage: ${session.stage}, Players: ${Array.from(session.players.values()).map(p => `${p.name}(${p.id})`).join(', ')}`);

    // Try to find existing player by name (case-insensitive, trimmed)
    let existingPlayer: Player | undefined;
    let oldPlayerId: string | undefined;
    const normalizedName = data.playerName.trim();
    
    for (const [playerId, player] of session.players.entries()) {
      if (player.name.trim().toLowerCase() === normalizedName.toLowerCase()) {
        existingPlayer = player;
        oldPlayerId = playerId;
        break;
      }
    }

    if (existingPlayer && oldPlayerId) {
      console.log(`Found existing player: ${existingPlayer.name}, oldId=${oldPlayerId}, newId=${socket.id}`);
      // Update player's socket ID to the new connection
      // Only delete if it's a different socket ID
      if (oldPlayerId !== socket.id) {
        session.players.delete(oldPlayerId);
        existingPlayer.id = socket.id;
        session.players.set(socket.id, existingPlayer);
        console.log(`Updated player socket ID from ${oldPlayerId} to ${socket.id}`);
      }
      
      socket.join(data.codeword);
      
      // Send rejoin-success first
      socket.emit('rejoin-success', { 
        isAdmin: existingPlayer.isAdmin, 
        playerId: socket.id 
      });
      
      // Then send game state - this is critical for the client to know the current state
      socket.emit('game-state', serializeGameState(session));
      
      // Notify other players
      io.to(data.codeword).emit('game-state', serializeGameState(session));
      console.log(`${data.playerName} successfully rejoined session ${data.codeword} (stage: ${session.stage})`);
    } else {
      console.log(`Player ${data.playerName} not found in session. Stage: ${session.stage}`);
      // Player not found, check if we can add them
      if (session.stage === GameStage.LOBBY) {
        // Allow joining as new player if in lobby
        const player: Player = {
          id: socket.id,
          name: data.playerName,
          isAdmin: false,
          words: [],
          isReady: false
        };
        session.players.set(socket.id, player);
        socket.join(data.codeword);
        socket.emit('rejoin-success', { isAdmin: false, playerId: socket.id });
        socket.emit('game-state', serializeGameState(session));
        io.to(data.codeword).emit('game-state', serializeGameState(session));
        console.log(`${data.playerName} joined session ${data.codeword} (new player in lobby)`);
      } else {
        // Game in progress and player not found
        console.log(`Cannot rejoin: Game in progress (${session.stage}) and player not found`);
        socket.emit('rejoin-error', { message: `Player "${data.playerName}" not found in session. Game is in progress.` });
      }
    }
  });

  socket.on('update-settings', (data: {
    codeword: string;
    numImpostors: number;
    wordsPerPlayer: number;
    usersEnterWords: boolean;
    language: string;
  }) => {
    console.log(`[update-settings] Received from socket ${socket.id}:`, data);
    
    // Try to find session by codeword
    let session = sessions.get(data.codeword);
    
    // If not found, try to find by checking all sessions for this socket's player
    if (!session) {
      console.log(`[update-settings] Session not found for codeword: ${data.codeword}, searching by socket...`);
      for (const [codeword, sess] of sessions.entries()) {
        if (sess.players.has(socket.id)) {
          session = sess;
          console.log(`[update-settings] Found session by socket: ${codeword}`);
          break;
        }
      }
    }
    
    if (!session) {
      console.error(`[update-settings] Session not found for codeword: ${data.codeword}, socket: ${socket.id}`);
      return;
    }
    
    const player = session.players.get(socket.id);
    if (!player) {
      console.error(`[update-settings] Player not found in session for socket: ${socket.id}`);
      return;
    }
    
    if (!player.isAdmin) {
      console.warn(`[update-settings] Non-admin player ${player.name} (${socket.id}) attempted to update settings`);
      return;
    }
    
    console.log(`[update-settings] Admin ${player.name} updating settings. Current settings:`, {
      numImpostors: session.settings.numImpostors,
      wordsPerPlayer: session.settings.wordsPerPlayer,
      usersEnterWords: session.settings.usersEnterWords,
      language: session.settings.language
    });

    const oldLanguage = session.settings.language;
    const newLanguage = data.language as Language;

    // Update settings
    session.settings.numImpostors = data.numImpostors;
    session.settings.wordsPerPlayer = data.wordsPerPlayer;
    session.settings.usersEnterWords = data.usersEnterWords;
    session.settings.language = newLanguage;
    
    console.log(`[update-settings] Settings updated to:`, {
      numImpostors: session.settings.numImpostors,
      wordsPerPlayer: session.settings.wordsPerPlayer,
      usersEnterWords: session.settings.usersEnterWords,
      language: session.settings.language
    });

    // If language changed, generate new codeword in the new language
    if (oldLanguage !== newLanguage && session.stage === GameStage.LOBBY) {
      const oldCodeword = session.codeword;
      const newCodeword = generateCodeword(newLanguage).toLowerCase();
      
      console.log(`[update-settings] Language changed from ${oldLanguage} to ${newLanguage}, updating codeword from ${oldCodeword} to ${newCodeword}`);
      
      // Update session codeword
      session.codeword = newCodeword;
      
      // Update sessions map - remove old, add new
      sessions.delete(oldCodeword);
      sessions.set(newCodeword, session);
      
      // Move all sockets to the new room
      const room = io.sockets.adapter.rooms.get(oldCodeword);
      if (room) {
        console.log(`[update-settings] Moving ${room.size} sockets from room ${oldCodeword} to ${newCodeword}`);
        for (const socketId of room) {
          const s = io.sockets.sockets.get(socketId);
          if (s) {
            s.leave(oldCodeword);
            s.join(newCodeword);
          }
        }
      }
      
      // Notify all players about the new codeword
      io.to(newCodeword).emit('codeword-updated', { newCodeword });
      io.to(newCodeword).emit('game-state', serializeGameState(session));
      
      console.log(`[update-settings] Codeword updated and game-state broadcasted to all players`);
    } else {
      // Just update settings without changing codeword
      const targetCodeword = session.codeword; // Use current session codeword (might have changed)
      console.log(`[update-settings] Broadcasting game-state to room: ${targetCodeword}`);
      io.to(targetCodeword).emit('game-state', serializeGameState(session));
      console.log(`[update-settings] Game-state broadcasted successfully`);
    }
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
    console.log(`[submit-words] Received from socket ${socket.id}, codeword: ${data.codeword}`);
    const session = sessions.get(data.codeword);
    if (!session) {
      console.error(`[submit-words] Session not found for codeword: ${data.codeword}`);
      return;
    }

    const player = session.players.get(socket.id);
    if (!player) {
      console.error(`[submit-words] Player not found in session for socket: ${socket.id}`);
      return;
    }

    console.log(`[submit-words] Player ${player.name} submitting ${data.words.length} words`);
    player.words = data.words;
    player.isReady = true;

    // Rebuild word pool from all players' words
    session.wordPool = [];
    session.players.forEach((p) => {
      session.wordPool.push(...p.words);
    });

    console.log(`[submit-words] Word pool now has ${session.wordPool.length} words`);

    // Check if all players are ready
    const allReady = Array.from(session.players.values()).every((p) => p.isReady);
    const readyCount = Array.from(session.players.values()).filter((p) => p.isReady).length;
    const totalCount = session.players.size;
    
    console.log(`[submit-words] Ready status: ${readyCount}/${totalCount} players ready, allReady: ${allReady}`);
    
    if (allReady) {
      session.stage = GameStage.WAITING_WORDS;
      console.log(`[submit-words] All players ready, moving to WAITING_WORDS stage`);
    }

    // Always broadcast game-state to all players so waiting room updates in real-time
    console.log(`[submit-words] Broadcasting game-state to room: ${data.codeword}`);
    io.to(data.codeword).emit('game-state', serializeGameState(session));
    console.log(`[submit-words] Game-state broadcasted successfully`);
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

  socket.on('leave-session', (data: { codeword: string }) => {
    console.log(`[leave-session] Player ${socket.id} leaving session ${data.codeword}`);
    const session = sessions.get(data.codeword);
    if (session && session.players.has(socket.id)) {
      const player = session.players.get(socket.id);
      if (player?.isAdmin) {
        // Admin leaving - end session for everyone
        sessions.delete(data.codeword);
        io.to(data.codeword).emit('session-ended');
        console.log(`[leave-session] Admin left, session ended`);
      } else {
        // Regular player leaving - remove them
        session.players.delete(socket.id);
        socket.leave(data.codeword);
        io.to(data.codeword).emit('game-state', serializeGameState(session));
        console.log(`[leave-session] Player ${player?.name} left session`);
      }
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    
    // Find player in sessions
    // During gameplay, keep players in session so they can rejoin
    for (const [codeword, session] of sessions.entries()) {
      if (session.players.has(socket.id)) {
        const player = session.players.get(socket.id);
        if (player?.isAdmin) {
          // If admin disconnects, give them time to reconnect before ending session
          setTimeout(() => {
            const currentSession = sessions.get(codeword);
            if (currentSession) {
              // Check if admin has reconnected with a different socket ID
              const adminStillConnected = Array.from(currentSession.players.values())
                .some(p => p.isAdmin && p.name === player.name && p.id !== socket.id);
              if (!adminStillConnected) {
                // Admin didn't reconnect, end session
                sessions.delete(codeword);
                io.to(codeword).emit('session-ended');
              }
            }
          }, 60000); // 60 second grace period for admin
        } else if (player) {
          // For regular players during gameplay, keep them in the session
          // They can rejoin by name. Only remove if game is in lobby or finished.
          if (session.stage === GameStage.LOBBY || session.stage === GameStage.FINISHED) {
            // Remove from lobby/finished stages
            session.players.delete(socket.id);
            io.to(codeword).emit('game-state', serializeGameState(session));
          } else {
            // During active gameplay (WORD_ENTRY, WAITING_WORDS, PLAYING), 
            // keep player in session - they can rejoin with same name
            // The socket ID will be updated when they rejoin
            console.log(`Player ${player.name} disconnected during gameplay, keeping in session for rejoin`);
          }
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

