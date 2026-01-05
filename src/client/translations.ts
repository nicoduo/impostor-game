export type Language = 'English' | 'Spanish' | 'French' | 'German';

export interface Translations {
  gameTitle: string;
  yourName: string;
  enterYourName: string;
  codeword: string;
  enterCodeword: string;
  leaveEmptyToCreate: string;
  createNewGame: string;
  joinGame: string;
  lobby: string;
  playersInSession: string;
  admin: string;
  startGame: string;
  gameSettings: string;
  numberOfImpostors: string;
  wordsPerPlayer: string;
  usersEnterWords: string;
  yes: string;
  no: string;
  noRandom: string;
  language: string;
  updateSettings: string;
  enterYourWords: string;
  enterWordsDescription: string;
  word: string;
  category: string;
  submitWords: string;
  wordsSubmitted: string;
  waitingForPlayers: string;
  waitingRoom: string;
  allPlayersReady: string;
  totalWordsInPool: string;
  round: string;
  of: string;
  nextRound: string;
  gameFinished: string;
  restartGame: string;
  startNewGame: string;
  connecting: string;
  invalidCodeword: string;
  gameInProgress: string;
  joinMidGameMessage: string;
  sessionEnded: string;
  sessionCode: string;
  exitGame: string;
  categorySport: string;
  categoryFood: string;
  categoryShopping: string;
  categoryNature: string;
  categoryDestination: string;
  categoryTechnology: string;
  categoryVehicles: string;
  categoryCelebrities: string;
}

export const translations: Record<Language, Translations> = {
  English: {
    gameTitle: '🎭 Impostor Game',
    yourName: 'Your Name',
    enterYourName: 'Enter your name',
    codeword: 'Codeword',
    enterCodeword: 'Enter codeword to join',
    leaveEmptyToCreate: 'leave empty to create new game',
    createNewGame: 'Create New Game',
    joinGame: 'Join Game',
    lobby: 'Lobby',
    playersInSession: 'Players in session',
    admin: 'Admin',
    startGame: 'Start Game',
    gameSettings: 'Game Settings (Admin)',
    numberOfImpostors: 'Number of Impostors',
    wordsPerPlayer: 'Number of Words per Player',
    usersEnterWords: 'Users Enter Words',
    yes: 'Yes',
    no: 'No',
    noRandom: 'No (Random)',
    language: 'Language',
    updateSettings: 'Update Settings',
    enterYourWords: 'Enter Your Words',
    enterWordsDescription: 'Enter {count} words. Each word will be assigned a random category.',
    word: 'Word',
    category: 'Category',
    submitWords: 'Submit Words',
    wordsSubmitted: 'Words Submitted!',
    waitingForPlayers: 'Waiting for other players to submit their words...',
    waitingRoom: 'Waiting Room',
    allPlayersReady: 'All players have submitted their words!',
    totalWordsInPool: 'Total words in pool',
    round: 'Round',
    of: 'of',
    nextRound: 'Next Round',
    gameFinished: 'Game Finished!',
    restartGame: 'Restart Game',
    startNewGame: 'Start a New Game from Scratch',
    connecting: 'Connecting to server...',
    invalidCodeword: 'Invalid codeword',
    gameInProgress: 'Game already in progress',
    joinMidGameMessage: 'You joined mid-game! Submit your words to participate in future rounds.',
    sessionEnded: 'Session ended by admin',
    sessionCode: 'Session Code',
    exitGame: 'Exit Game',
    categorySport: 'Sport',
    categoryFood: 'Food',
    categoryShopping: 'Shopping',
    categoryNature: 'Nature',
    categoryDestination: 'Destination',
    categoryTechnology: 'Technology',
    categoryVehicles: 'Vehicles',
    categoryCelebrities: 'Celebrities'
  },
  Spanish: {
    gameTitle: '🎭 Juego del Impostor',
    yourName: 'Tu Nombre',
    enterYourName: 'Ingresa tu nombre',
    codeword: 'Código',
    enterCodeword: 'Ingresa el código para unirte',
    leaveEmptyToCreate: 'deja vacío para crear nuevo juego',
    createNewGame: 'Crear Nuevo Juego',
    joinGame: 'Unirse al Juego',
    lobby: 'Sala de Espera',
    playersInSession: 'Jugadores en la sesión',
    admin: 'Administrador',
    startGame: 'Iniciar Juego',
    gameSettings: 'Configuración del Juego (Administrador)',
    numberOfImpostors: 'Número de Impostores',
    wordsPerPlayer: 'Número de Palabras por Jugador',
    usersEnterWords: 'Los Usuarios Ingresan Palabras',
    yes: 'Sí',
    no: 'No',
    noRandom: 'No (Aleatorio)',
    language: 'Idioma',
    updateSettings: 'Actualizar Configuración',
    enterYourWords: 'Ingresa Tus Palabras',
    enterWordsDescription: 'Ingresa {count} palabras. Cada palabra será asignada a una categoría aleatoria.',
    word: 'Palabra',
    category: 'Categoría',
    submitWords: 'Enviar Palabras',
    wordsSubmitted: '¡Palabras Enviadas!',
    waitingForPlayers: 'Esperando a que otros jugadores envíen sus palabras...',
    waitingRoom: 'Sala de Espera',
    allPlayersReady: '¡Todos los jugadores han enviado sus palabras!',
    totalWordsInPool: 'Total de palabras en el grupo',
    round: 'Ronda',
    of: 'de',
    nextRound: 'Siguiente Ronda',
    gameFinished: '¡Juego Terminado!',
    restartGame: 'Reiniciar Juego',
    startNewGame: 'Comenzar un Nuevo Juego desde Cero',
    connecting: 'Conectando al servidor...',
    invalidCodeword: 'Código inválido',
    gameInProgress: 'El juego ya está en progreso',
    joinMidGameMessage: '¡Te uniste a mitad del juego! Envía tus palabras para participar en las siguientes rondas.',
    sessionEnded: 'Sesión terminada por el administrador',
    sessionCode: 'Código de Sesión',
    exitGame: 'Salir del Juego',
    categorySport: 'Deporte',
    categoryFood: 'Comida',
    categoryShopping: 'Compras',
    categoryNature: 'Naturaleza',
    categoryDestination: 'Destino',
    categoryTechnology: 'Tecnología',
    categoryVehicles: 'Vehículos',
    categoryCelebrities: 'Celebridades'
  },
  French: {
    gameTitle: '🎭 Jeu de l\'Imposteur',
    yourName: 'Votre Nom',
    enterYourName: 'Entrez votre nom',
    codeword: 'Code',
    enterCodeword: 'Entrez le code pour rejoindre',
    leaveEmptyToCreate: 'laissez vide pour créer un nouveau jeu',
    createNewGame: 'Créer un Nouveau Jeu',
    joinGame: 'Rejoindre le Jeu',
    lobby: 'Hall d\'Attente',
    playersInSession: 'Joueurs dans la session',
    admin: 'Administrateur',
    startGame: 'Démarrer le Jeu',
    gameSettings: 'Paramètres du Jeu (Administrateur)',
    numberOfImpostors: 'Nombre d\'Imposteurs',
    wordsPerPlayer: 'Nombre de Mots par Joueur',
    usersEnterWords: 'Les Utilisateurs Entrent des Mots',
    yes: 'Oui',
    no: 'Non',
    noRandom: 'Non (Aléatoire)',
    language: 'Langue',
    updateSettings: 'Mettre à Jour les Paramètres',
    enterYourWords: 'Entrez Vos Mots',
    enterWordsDescription: 'Entrez {count} mots. Chaque mot sera assigné à une catégorie aléatoire.',
    word: 'Mot',
    category: 'Catégorie',
    submitWords: 'Soumettre les Mots',
    wordsSubmitted: 'Mots Soumis!',
    waitingForPlayers: 'En attente que les autres joueurs soumettent leurs mots...',
    waitingRoom: 'Salle d\'Attente',
    allPlayersReady: 'Tous les joueurs ont soumis leurs mots!',
    totalWordsInPool: 'Total de mots dans le groupe',
    round: 'Round',
    of: 'de',
    nextRound: 'Round Suivant',
    gameFinished: 'Jeu Terminé!',
    restartGame: 'Redémarrer le Jeu',
    startNewGame: 'Commencer un Nouveau Jeu depuis le Début',
    connecting: 'Connexion au serveur...',
    invalidCodeword: 'Code invalide',
    gameInProgress: 'Le jeu est déjà en cours',
    joinMidGameMessage: 'Vous avez rejoint en cours de partie ! Soumettez vos mots pour participer aux prochains tours.',
    sessionEnded: 'Session terminée par l\'administrateur',
    sessionCode: 'Code de Session',
    exitGame: 'Quitter le Jeu',
    categorySport: 'Sport',
    categoryFood: 'Nourriture',
    categoryShopping: 'Shopping',
    categoryNature: 'Nature',
    categoryDestination: 'Destination',
    categoryTechnology: 'Technologie',
    categoryVehicles: 'Véhicules',
    categoryCelebrities: 'Célébrités'
  },
  German: {
    gameTitle: '🎭 Impostor-Spiel',
    yourName: 'Ihr Name',
    enterYourName: 'Geben Sie Ihren Namen ein',
    codeword: 'Code',
    enterCodeword: 'Geben Sie den Code ein, um beizutreten',
    leaveEmptyToCreate: 'leer lassen, um neues Spiel zu erstellen',
    createNewGame: 'Neues Spiel Erstellen',
    joinGame: 'Spiel Beitreten',
    lobby: 'Lobby',
    playersInSession: 'Spieler in der Sitzung',
    admin: 'Administrator',
    startGame: 'Spiel Starten',
    gameSettings: 'Spieleinstellungen (Administrator)',
    numberOfImpostors: 'Anzahl der Impostoren',
    wordsPerPlayer: 'Anzahl der Wörter pro Spieler',
    usersEnterWords: 'Benutzer Geben Wörter Ein',
    yes: 'Ja',
    no: 'Nein',
    noRandom: 'Nein (Zufällig)',
    language: 'Sprache',
    updateSettings: 'Einstellungen Aktualisieren',
    enterYourWords: 'Geben Sie Ihre Wörter Ein',
    enterWordsDescription: 'Geben Sie {count} Wörter ein. Jedem Wort wird eine zufällige Kategorie zugewiesen.',
    word: 'Wort',
    category: 'Kategorie',
    submitWords: 'Wörter Einreichen',
    wordsSubmitted: 'Wörter Eingereicht!',
    waitingForPlayers: 'Warten auf andere Spieler, die ihre Wörter einreichen...',
    waitingRoom: 'Wartezimmer',
    allPlayersReady: 'Alle Spieler haben ihre Wörter eingereicht!',
    totalWordsInPool: 'Gesamtzahl der Wörter im Pool',
    round: 'Runde',
    of: 'von',
    nextRound: 'Nächste Runde',
    gameFinished: 'Spiel Beendet!',
    restartGame: 'Spiel Neustarten',
    startNewGame: 'Ein Neues Spiel von Grund auf Starten',
    connecting: 'Verbindung zum Server...',
    invalidCodeword: 'Ungültiger Code',
    gameInProgress: 'Spiel läuft bereits',
    joinMidGameMessage: 'Sie sind mitten im Spiel beigetreten! Reichen Sie Ihre Wörter ein, um an zukünftigen Runden teilzunehmen.',
    sessionEnded: 'Sitzung vom Administrator beendet',
    sessionCode: 'Sitzungscode',
    exitGame: 'Spiel Verlassen',
    categorySport: 'Sport',
    categoryFood: 'Essen',
    categoryShopping: 'Einkaufen',
    categoryNature: 'Natur',
    categoryDestination: 'Reiseziel',
    categoryTechnology: 'Technologie',
    categoryVehicles: 'Fahrzeuge',
    categoryCelebrities: 'Prominente'
  }
};

export function getTranslation(language: Language, key: keyof Translations, params?: Record<string, string | number>): string {
  const translation = translations[language]?.[key] || translations.English[key];
  
  if (params) {
    return translation.replace(/\{(\w+)\}/g, (match, paramKey) => {
      return params[paramKey]?.toString() || match;
    });
  }
  
  return translation;
}

// Map English category names to translation keys
const CATEGORY_MAP: Record<string, keyof Translations> = {
  'Sport': 'categorySport',
  'Food': 'categoryFood',
  'Shopping': 'categoryShopping',
  'Nature': 'categoryNature',
  'Destination': 'categoryDestination',
  'Technology': 'categoryTechnology',
  'Vehicles': 'categoryVehicles',
  'Celebrities': 'categoryCelebrities'
};

export function translateCategory(category: string, language: Language): string {
  const key = CATEGORY_MAP[category];
  if (key) {
    return getTranslation(language, key);
  }
  return category; // Fallback to original if not found
}

