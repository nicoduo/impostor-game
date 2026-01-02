# Impostor Game

A multiplayer web-based game where players try to identify impostors in each round.

## Features

- Multiplayer sessions with codeword-based joining
- Admin controls for game setup
- Multiple game stages: Lobby → Word Entry → Waiting Room → Game Rounds
- Random impostor assignment per round
- Category-based word entry (Sport, Food, Shopping, Nature, Destination, Technology, Vehicles)
- Real-time synchronization using WebSockets

## Setup

1. Install dependencies:
```bash
npm install
```

2. Build the project:
```bash
npm run build
```

3. Start the server (in one terminal):
```bash
npm start
# or for development with auto-reload:
npm run dev
```

4. Start the client (in another terminal):
```bash
npm run dev:client
```

The server runs on `http://localhost:3001` and the client on `http://localhost:3000`.

## How to Play

1. **Create/Join Session**: 
   - Admin: Enter your name and click "Create New Game"
   - Players: Enter your name and the codeword provided by the admin, then click "Join Game"

2. **Lobby Stage**:
   - See all connected players
   - Admin can configure game settings and start the game

3. **Word Entry Stage**:
   - Admin configures: number of impostors, words per player, whether users enter words, and language
   - All players enter the required number of words
   - Each word is randomly assigned a category

4. **Waiting Room**:
   - All players wait after submitting words
   - Admin can start the game when ready

5. **Game Rounds**:
   - Each round uses one word from the word pool
   - Impostors see "IMPOSTOR" + category
   - Regular players see the actual word + category
   - Admin controls progression to next round
   - Game continues until all words are used

6. **Restart**:
   - Admin can restart the game at any time, sending all players back to word entry

## Technology Stack

- **Backend**: Node.js, Express, Socket.io
- **Frontend**: React, TypeScript, Vite
- **Real-time Communication**: WebSockets (Socket.io)

