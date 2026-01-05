import { Language } from './types';

// Word database: 50 words per category per language
// Words are strongly associated with their category

type CategoryKey = 'Sport' | 'Food' | 'Shopping' | 'Nature' | 'Destination' | 'Technology' | 'Vehicles' | 'Celebrities';

interface WordDatabase {
  [language: string]: {
    [category: string]: string[];
  };
}

const wordDatabase: WordDatabase = {
  English: {
    Sport: [
      'football', 'basketball', 'tennis', 'soccer', 'baseball', 'volleyball', 'swimming', 'running',
      'cycling', 'golf', 'hockey', 'boxing', 'wrestling', 'surfing', 'skiing', 'skating',
      'cricket', 'rugby', 'badminton', 'pingpong', 'archery', 'fencing', 'gymnastics', 'diving',
      'rowing', 'sailing', 'climbing', 'jogging', 'marathon', 'triathlon', 'karate', 'judo',
      'taekwondo', 'yoga', 'pilates', 'crossfit', 'weightlifting', 'bodybuilding', 'dancing',
      'cheerleading', 'lacrosse', 'softball', 'handball', 'waterpolo', 'synchronized', 'polo',
      'equestrian', 'pentathlon', 'decathlon', 'biathlon'
    ],
    Food: [
      'pizza', 'burger', 'pasta', 'sushi', 'taco', 'burrito', 'sandwich', 'salad',
      'soup', 'steak', 'chicken', 'fish', 'rice', 'bread', 'cheese', 'butter',
      'apple', 'banana', 'orange', 'strawberry', 'grape', 'watermelon', 'pineapple', 'mango',
      'chocolate', 'icecream', 'cake', 'cookie', 'donut', 'muffin', 'pancake', 'waffle',
      'coffee', 'tea', 'juice', 'soda', 'water', 'milk', 'yogurt', 'cereal',
      'eggs', 'bacon', 'toast', 'bagel', 'croissant', 'noodles', 'ramen', 'curry',
      'lasagna', 'ravioli'
    ],
    Shopping: [
      'shirt', 'pants', 'dress', 'shoes', 'jacket', 'hat', 'bag', 'watch',
      'phone', 'laptop', 'tablet', 'camera', 'headphones', 'speaker', 'charger', 'cable',
      'perfume', 'makeup', 'shampoo', 'soap', 'towel', 'pillow', 'blanket', 'lamp',
      'vase', 'picture', 'frame', 'book', 'notebook', 'pen', 'pencil', 'eraser',
      'backpack', 'wallet', 'belt', 'sunglasses', 'jewelry', 'ring', 'necklace', 'bracelet',
      'furniture', 'chair', 'table', 'sofa', 'bed', 'mirror', 'clock', 'calendar',
      'gift', 'card'
    ],
    Nature: [
      'tree', 'flower', 'mountain', 'river', 'ocean', 'lake', 'forest', 'beach',
      'sun', 'moon', 'star', 'cloud', 'rain', 'snow', 'wind', 'storm',
      'bird', 'butterfly', 'bee', 'ant', 'spider', 'snake', 'tiger', 'lion',
      'elephant', 'bear', 'deer', 'rabbit', 'squirrel', 'fox', 'wolf', 'eagle',
      'dolphin', 'whale', 'shark', 'fish', 'coral', 'shell', 'rock', 'stone',
      'grass', 'leaf', 'branch', 'root', 'seed', 'fruit', 'berry', 'mushroom',
      'cactus', 'bamboo'
    ],
    Destination: [
      'paris', 'london', 'tokyo', 'newyork', 'dubai', 'rome', 'barcelona', 'amsterdam',
      'sydney', 'tokyo', 'singapore', 'hongkong', 'bangkok', 'bali', 'maldives', 'santorini',
      'venice', 'prague', 'vienna', 'berlin', 'madrid', 'lisbon', 'istanbul', 'cairo',
      'moscow', 'beijing', 'seoul', 'mumbai', 'dubai', 'doha', 'abudhabi', 'riyadh',
      'cancun', 'mexico', 'rio', 'buenosaires', 'lima', 'santiago', 'bogota', 'caracas',
      'cape', 'nairobi', 'casablanca', 'tunis', 'accra', 'lagos', 'cairo', 'johannesburg',
      'dublin', 'edinburgh'
    ],
    Technology: [
      'computer', 'laptop', 'phone', 'tablet', 'smartwatch', 'headphones', 'speaker', 'camera',
      'keyboard', 'mouse', 'monitor', 'printer', 'scanner', 'router', 'modem', 'server',
      'software', 'app', 'website', 'internet', 'wifi', 'bluetooth', 'usb', 'cable',
      'battery', 'charger', 'adapter', 'memory', 'storage', 'processor', 'graphics', 'screen',
      'touchscreen', 'display', 'resolution', 'pixel', 'megapixel', 'gigabyte', 'terabyte', 'cloud',
      'email', 'password', 'username', 'account', 'profile', 'settings', 'update', 'download',
      'upload', 'streaming'
    ],
    Vehicles: [
      'car', 'truck', 'bus', 'motorcycle', 'bicycle', 'scooter', 'skateboard', 'rollerblades',
      'train', 'subway', 'tram', 'trolley', 'taxi', 'uber', 'limousine', 'van',
      'suv', 'sedan', 'coupe', 'convertible', 'pickup', 'jeep', 'hummer', 'tesla',
      'airplane', 'helicopter', 'drone', 'balloon', 'airship', 'jet', 'rocket', 'spaceship',
      'boat', 'ship', 'yacht', 'cruise', 'ferry', 'submarine', 'sailboat', 'kayak',
      'canoe', 'raft', 'surfboard', 'jetski', 'snowmobile', 'atv', 'tractor', 'bulldozer',
      'excavator', 'crane'
    ],
    Celebrities: [
      'beyonce', 'taylor', 'adele', 'rihanna', 'justin', 'drake', 'ed', 'bruno',
      'ariana', 'billie', 'dua', 'selena', 'miley', 'katy', 'lady', 'madonna',
      'elvis', 'michael', 'prince', 'david', 'bowie', 'freddie', 'john', 'paul',
      'george', 'ringo', 'mick', 'keith', 'roger', 'pink', 'floyd', 'led',
      'zeppelin', 'acdc', 'metallica', 'nirvana', 'kurt', 'cobain', 'jimi', 'hendrix',
      'bob', 'dylan', 'bob', 'marley', 'stevie', 'wonder', 'ray', 'charles',
      'aretha', 'franklin', 'whitney', 'houston', 'mariah', 'carey', 'celine', 'dion'
    ]
  },
  Spanish: {
    Sport: [
      'futbol', 'baloncesto', 'tenis', 'voleibol', 'natacion', 'ciclismo', 'golf', 'hockey',
      'boxeo', 'lucha', 'surf', 'esqui', 'patinaje', 'cricket', 'rugby', 'badminton',
      'pingpong', 'tiro', 'esgrima', 'gimnasia', 'clavados', 'remo', 'vela', 'escalada',
      'jogging', 'maraton', 'triatlon', 'karate', 'judo', 'taekwondo', 'yoga', 'pilates',
      'crossfit', 'levantamiento', 'culturismo', 'danza', 'porristas', 'lacrosse', 'softbol',
      'balonmano', 'waterpolo', 'sincronizado', 'polo', 'ecuestre', 'pentatlon', 'decatlon',
      'biatlon', 'atletismo', 'carrera', 'salto', 'lanzamiento', 'disco', 'jabalina', 'martillo'
    ],
    Food: [
      'pizza', 'hamburguesa', 'pasta', 'sushi', 'taco', 'burrito', 'sandwich', 'ensalada',
      'sopa', 'bistec', 'pollo', 'pescado', 'arroz', 'pan', 'queso', 'mantequilla',
      'manzana', 'platano', 'naranja', 'fresa', 'uva', 'sandia', 'pina', 'mango',
      'chocolate', 'helado', 'pastel', 'galleta', 'donut', 'muffin', 'panqueque', 'waffle',
      'cafe', 'te', 'jugo', 'refresco', 'agua', 'leche', 'yogur', 'cereal',
      'huevos', 'tocino', 'tostada', 'bagel', 'croissant', 'fideos', 'ramen', 'curry',
      'lasana', 'ravioli'
    ],
    Shopping: [
      'camisa', 'pantalon', 'vestido', 'zapatos', 'chaqueta', 'sombrero', 'bolsa', 'reloj',
      'telefono', 'laptop', 'tableta', 'camara', 'audifonos', 'altavoz', 'cargador', 'cable',
      'perfume', 'maquillaje', 'champu', 'jabon', 'toalla', 'almohada', 'manta', 'lampara',
      'florero', 'cuadro', 'marco', 'libro', 'cuaderno', 'pluma', 'lapiz', 'borrador',
      'mochila', 'cartera', 'cinturon', 'gafas', 'joyeria', 'anillo', 'collar', 'pulsera',
      'mueble', 'silla', 'mesa', 'sofa', 'cama', 'espejo', 'reloj', 'calendario',
      'regalo', 'tarjeta'
    ],
    Nature: [
      'arbol', 'flor', 'montana', 'rio', 'oceano', 'lago', 'bosque', 'playa',
      'sol', 'luna', 'estrella', 'nube', 'lluvia', 'nieve', 'viento', 'tormenta',
      'pajaro', 'mariposa', 'abeja', 'hormiga', 'arana', 'serpiente', 'tigre', 'leon',
      'elefante', 'oso', 'ciervo', 'conejo', 'ardilla', 'zorro', 'lobo', 'aguila',
      'delfin', 'ballena', 'tiburon', 'pez', 'coral', 'concha', 'roca', 'piedra',
      'hierba', 'hoja', 'rama', 'raiz', 'semilla', 'fruta', 'baya', 'hongo',
      'cactus', 'bambu'
    ],
    Destination: [
      'paris', 'londres', 'tokio', 'nuevayork', 'dubai', 'roma', 'barcelona', 'amsterdam',
      'sydney', 'singapur', 'hongkong', 'bangkok', 'bali', 'maldivas', 'santorini', 'venecia',
      'praga', 'viena', 'berlin', 'madrid', 'lisboa', 'estambul', 'cairo', 'moscu',
      'pekin', 'seul', 'mumbai', 'doha', 'abudhabi', 'riyadh', 'cancun', 'mexico',
      'rio', 'buenosaires', 'lima', 'santiago', 'bogota', 'caracas', 'ciudad', 'cape',
      'nairobi', 'casablanca', 'tunez', 'accra', 'lagos', 'johannesburg', 'dublin', 'edimburgo',
      'atenas', 'estocolmo'
    ],
    Technology: [
      'computadora', 'laptop', 'telefono', 'tableta', 'reloj', 'audifonos', 'altavoz', 'camara',
      'teclado', 'raton', 'monitor', 'impresora', 'escaner', 'router', 'modem', 'servidor',
      'software', 'aplicacion', 'sitio', 'internet', 'wifi', 'bluetooth', 'usb', 'cable',
      'bateria', 'cargador', 'adaptador', 'memoria', 'almacenamiento', 'procesador', 'graficos', 'pantalla',
      'tactil', 'pantalla', 'resolucion', 'pixel', 'megapixel', 'gigabyte', 'terabyte', 'nube',
      'correo', 'contraseña', 'usuario', 'cuenta', 'perfil', 'configuracion', 'actualizacion', 'descarga',
      'subida', 'transmision'
    ],
    Vehicles: [
      'coche', 'camion', 'autobus', 'motocicleta', 'bicicleta', 'scooter', 'patineta', 'patines',
      'tren', 'metro', 'tranvia', 'trolebus', 'taxi', 'uber', 'limusina', 'furgoneta',
      'suv', 'sedan', 'coupe', 'convertible', 'pickup', 'jeep', 'hummer', 'tesla',
      'avion', 'helicoptero', 'dron', 'globo', 'dirigible', 'jet', 'cohete', 'nave',
      'barco', 'buque', 'yate', 'crucero', 'ferry', 'submarino', 'velero', 'kayak',
      'canoa', 'balsa', 'tabla', 'moto', 'motonieve', 'atv', 'tractor', 'bulldozer',
      'excavadora', 'grua'
    ],
    Celebrities: [
      'beyonce', 'taylor', 'adele', 'rihanna', 'justin', 'drake', 'ed', 'bruno',
      'ariana', 'billie', 'dua', 'selena', 'miley', 'katy', 'lady', 'madonna',
      'elvis', 'michael', 'prince', 'david', 'bowie', 'freddie', 'john', 'paul',
      'george', 'ringo', 'mick', 'keith', 'roger', 'pink', 'floyd', 'led',
      'zeppelin', 'acdc', 'metallica', 'nirvana', 'kurt', 'cobain', 'jimi', 'hendrix',
      'bob', 'dylan', 'bob', 'marley', 'stevie', 'wonder', 'ray', 'charles',
      'aretha', 'franklin', 'whitney', 'houston', 'mariah', 'carey', 'celine', 'dion'
    ]
  },
  French: {
    Sport: [
      'football', 'basketball', 'tennis', 'volley', 'natation', 'cyclisme', 'golf', 'hockey',
      'boxe', 'lutte', 'surf', 'ski', 'patinage', 'cricket', 'rugby', 'badminton',
      'pingpong', 'tir', 'escrime', 'gymnastique', 'plongeon', 'aviron', 'voile', 'escalade',
      'jogging', 'marathon', 'triathlon', 'karate', 'judo', 'taekwondo', 'yoga', 'pilates',
      'crossfit', 'haltérophilie', 'bodybuilding', 'danse', 'pom', 'lacrosse', 'softball',
      'handball', 'waterpolo', 'synchronise', 'polo', 'equestre', 'pentathlon', 'decathlon',
      'biathlon', 'athletisme', 'course', 'saut', 'lancer', 'disque', 'javelot', 'marteau'
    ],
    Food: [
      'pizza', 'burger', 'pates', 'sushi', 'taco', 'burrito', 'sandwich', 'salade',
      'soupe', 'steak', 'poulet', 'poisson', 'riz', 'pain', 'fromage', 'beurre',
      'pomme', 'banane', 'orange', 'fraise', 'raisin', 'pasteque', 'ananas', 'mangue',
      'chocolat', 'glace', 'gateau', 'biscuit', 'donut', 'muffin', 'crepe', 'gaufre',
      'cafe', 'the', 'jus', 'soda', 'eau', 'lait', 'yaourt', 'cereale',
      'oeufs', 'bacon', 'toast', 'bagel', 'croissant', 'nouilles', 'ramen', 'curry',
      'lasagne', 'ravioli'
    ],
    Shopping: [
      'chemise', 'pantalon', 'robe', 'chaussures', 'veste', 'chapeau', 'sac', 'montre',
      'telephone', 'ordinateur', 'tablette', 'appareil', 'ecouteurs', 'hautparleur', 'chargeur', 'cable',
      'parfum', 'maquillage', 'shampooing', 'savon', 'serviette', 'oreiller', 'couverture', 'lampe',
      'vase', 'tableau', 'cadre', 'livre', 'cahier', 'stylo', 'crayon', 'gomme',
      'sac', 'portefeuille', 'ceinture', 'lunettes', 'bijoux', 'bague', 'collier', 'bracelet',
      'meuble', 'chaise', 'table', 'canape', 'lit', 'miroir', 'horloge', 'calendrier',
      'cadeau', 'carte'
    ],
    Nature: [
      'arbre', 'fleur', 'montagne', 'riviere', 'ocean', 'lac', 'foret', 'plage',
      'soleil', 'lune', 'etoile', 'nuage', 'pluie', 'neige', 'vent', 'tempete',
      'oiseau', 'papillon', 'abeille', 'fourmi', 'araignee', 'serpent', 'tigre', 'lion',
      'elephant', 'ours', 'cerf', 'lapin', 'ecureuil', 'renard', 'loup', 'aigle',
      'dauphin', 'baleine', 'requin', 'poisson', 'corail', 'coquillage', 'roche', 'pierre',
      'herbe', 'feuille', 'branche', 'racine', 'graine', 'fruit', 'baie', 'champignon',
      'cactus', 'bambou'
    ],
    Destination: [
      'paris', 'londres', 'tokyo', 'newyork', 'dubai', 'rome', 'barcelone', 'amsterdam',
      'sydney', 'singapour', 'hongkong', 'bangkok', 'bali', 'maldives', 'santorini', 'venise',
      'prague', 'vienne', 'berlin', 'madrid', 'lisbonne', 'istanbul', 'lecaire', 'moscou',
      'pekin', 'seoul', 'mumbai', 'doha', 'abudhabi', 'riyad', 'cancun', 'mexique',
      'rio', 'buenosaires', 'lima', 'santiago', 'bogota', 'caracas', 'cap', 'nairobi',
      'casablanca', 'tunis', 'accra', 'lagos', 'johannesburg', 'dublin', 'edimbourg', 'athenes',
      'stockholm', 'oslo'
    ],
    Technology: [
      'ordinateur', 'laptop', 'telephone', 'tablette', 'montre', 'ecouteurs', 'hautparleur', 'appareil',
      'clavier', 'souris', 'moniteur', 'imprimante', 'scanner', 'routeur', 'modem', 'serveur',
      'logiciel', 'application', 'site', 'internet', 'wifi', 'bluetooth', 'usb', 'cable',
      'batterie', 'chargeur', 'adaptateur', 'memoire', 'stockage', 'processeur', 'graphiques', 'ecran',
      'tactile', 'affichage', 'resolution', 'pixel', 'megapixel', 'gigaoctet', 'teraoctet', 'nuage',
      'email', 'motdepasse', 'utilisateur', 'compte', 'profil', 'parametres', 'miseajour', 'telechargement',
      'televersement', 'diffusion'
    ],
    Vehicles: [
      'voiture', 'camion', 'bus', 'moto', 'velo', 'scooter', 'skateboard', 'rollers',
      'train', 'metro', 'tramway', 'trolley', 'taxi', 'uber', 'limousine', 'van',
      'suv', 'berline', 'coupe', 'cabriolet', 'pickup', 'jeep', 'hummer', 'tesla',
      'avion', 'helicoptere', 'drone', 'ballon', 'dirigeable', 'jet', 'fusee', 'vaisseau',
      'bateau', 'navire', 'yacht', 'croisiere', 'ferry', 'sousmarin', 'voilier', 'kayak',
      'canoe', 'radeau', 'planche', 'jet', 'moton', 'atv', 'tracteur', 'bulldozer',
      'pelleteuse', 'grue'
    ],
    Celebrities: [
      'beyonce', 'taylor', 'adele', 'rihanna', 'justin', 'drake', 'ed', 'bruno',
      'ariana', 'billie', 'dua', 'selena', 'miley', 'katy', 'lady', 'madonna',
      'elvis', 'michael', 'prince', 'david', 'bowie', 'freddie', 'john', 'paul',
      'george', 'ringo', 'mick', 'keith', 'roger', 'pink', 'floyd', 'led',
      'zeppelin', 'acdc', 'metallica', 'nirvana', 'kurt', 'cobain', 'jimi', 'hendrix',
      'bob', 'dylan', 'bob', 'marley', 'stevie', 'wonder', 'ray', 'charles',
      'aretha', 'franklin', 'whitney', 'houston', 'mariah', 'carey', 'celine', 'dion'
    ]
  },
  German: {
    Sport: [
      'fussball', 'basketball', 'tennis', 'volleyball', 'schwimmen', 'radfahren', 'golf', 'hockey',
      'boxen', 'ringen', 'surfen', 'ski', 'eislaufen', 'cricket', 'rugby', 'badminton',
      'tischtennis', 'schießen', 'fechten', 'turnen', 'tauchen', 'rudern', 'segeln', 'klettern',
      'joggen', 'marathon', 'triathlon', 'karate', 'judo', 'taekwondo', 'yoga', 'pilates',
      'crossfit', 'gewichtheben', 'bodybuilding', 'tanzen', 'cheerleading', 'lacrosse', 'softball',
      'handball', 'wasserball', 'synchron', 'polo', 'reiten', 'fünfkampf', 'zehnkampf',
      'biathlon', 'leichtathletik', 'laufen', 'springen', 'werfen', 'scheibe', 'speer', 'hammer'
    ],
    Food: [
      'pizza', 'burger', 'pasta', 'sushi', 'taco', 'burrito', 'sandwich', 'salat',
      'suppe', 'steak', 'huhn', 'fisch', 'reis', 'brot', 'kase', 'butter',
      'apfel', 'banane', 'orange', 'erdbeere', 'traube', 'wassermelone', 'ananas', 'mango',
      'schokolade', 'eis', 'kuchen', 'keks', 'donut', 'muffin', 'pfannkuchen', 'waffel',
      'kaffee', 'tee', 'saft', 'limonade', 'wasser', 'milch', 'joghurt', 'müsli',
      'eier', 'speck', 'toast', 'bagel', 'croissant', 'nudeln', 'ramen', 'curry',
      'lasagne', 'ravioli'
    ],
    Shopping: [
      'hemd', 'hose', 'kleid', 'schuhe', 'jacke', 'hut', 'tasche', 'uhr',
      'telefon', 'laptop', 'tablet', 'kamera', 'kopfhorer', 'lautsprecher', 'ladegerat', 'kabel',
      'parfum', 'makeup', 'shampoo', 'seife', 'handtuch', 'kissen', 'decke', 'lampe',
      'vase', 'bild', 'rahmen', 'buch', 'heft', 'stift', 'bleistift', 'radiergummi',
      'rucksack', 'brieftasche', 'gurtel', 'sonnenbrille', 'schmuck', 'ring', 'halskette', 'armband',
      'mobel', 'stuhl', 'tisch', 'sofa', 'bett', 'spiegel', 'uhr', 'kalender',
      'geschenk', 'karte'
    ],
    Nature: [
      'baum', 'blume', 'berg', 'fluss', 'ozean', 'see', 'wald', 'strand',
      'sonne', 'mond', 'stern', 'wolke', 'regen', 'schnee', 'wind', 'sturm',
      'vogel', 'schmetterling', 'biene', 'ameise', 'spinne', 'schlange', 'tiger', 'lowe',
      'elefant', 'bar', 'hirsch', 'hase', 'eichhornchen', 'fuchs', 'wolf', 'adler',
      'delfin', 'wal', 'hai', 'fisch', 'koralle', 'muschel', 'fels', 'stein',
      'gras', 'blatt', 'ast', 'wurzel', 'samen', 'frucht', 'beere', 'pilz',
      'kaktus', 'bambus'
    ],
    Destination: [
      'paris', 'london', 'tokio', 'newyork', 'dubai', 'rom', 'barcelona', 'amsterdam',
      'sydney', 'singapur', 'hongkong', 'bangkok', 'bali', 'malediven', 'santorini', 'venedig',
      'prag', 'wien', 'berlin', 'madrid', 'lissabon', 'istanbul', 'kairo', 'moskau',
      'peking', 'seoul', 'mumbai', 'doha', 'abudhabi', 'riyadh', 'cancun', 'mexiko',
      'rio', 'buenosaires', 'lima', 'santiago', 'bogota', 'caracas', 'kap', 'nairobi',
      'casablanca', 'tunis', 'accra', 'lagos', 'johannesburg', 'dublin', 'edinburgh', 'athen',
      'stockholm', 'oslo'
    ],
    Technology: [
      'computer', 'laptop', 'telefon', 'tablet', 'smartwatch', 'kopfhorer', 'lautsprecher', 'kamera',
      'tastatur', 'maus', 'monitor', 'drucker', 'scanner', 'router', 'modem', 'server',
      'software', 'app', 'website', 'internet', 'wifi', 'bluetooth', 'usb', 'kabel',
      'batterie', 'ladegerat', 'adapter', 'speicher', 'speicherplatz', 'prozessor', 'grafik', 'bildschirm',
      'touchscreen', 'anzeige', 'auflosung', 'pixel', 'megapixel', 'gigabyte', 'terabyte', 'wolke',
      'email', 'passwort', 'benutzername', 'konto', 'profil', 'einstellungen', 'update', 'download',
      'upload', 'streaming'
    ],
    Vehicles: [
      'auto', 'lkw', 'bus', 'motorrad', 'fahrrad', 'roller', 'skateboard', 'rollerskates',
      'zug', 'u', 'straßenbahn', 'trolley', 'taxi', 'uber', 'limousine', 'van',
      'suv', 'limousine', 'coupe', 'cabrio', 'pickup', 'jeep', 'hummer', 'tesla',
      'flugzeug', 'hubschrauber', 'drohne', 'ballon', 'luftschiff', 'jet', 'rakete', 'raumschiff',
      'boot', 'schiff', 'yacht', 'kreuzfahrt', 'fahre', 'u', 'segelschiff', 'kajak',
      'kanu', 'floß', 'surfbrett', 'jetski', 'schneemobil', 'atv', 'traktor', 'bulldozer',
      'bagger', 'kran'
    ],
    Celebrities: [
      'beyonce', 'taylor', 'adele', 'rihanna', 'justin', 'drake', 'ed', 'bruno',
      'ariana', 'billie', 'dua', 'selena', 'miley', 'katy', 'lady', 'madonna',
      'elvis', 'michael', 'prince', 'david', 'bowie', 'freddie', 'john', 'paul',
      'george', 'ringo', 'mick', 'keith', 'roger', 'pink', 'floyd', 'led',
      'zeppelin', 'acdc', 'metallica', 'nirvana', 'kurt', 'cobain', 'jimi', 'hendrix',
      'bob', 'dylan', 'bob', 'marley', 'stevie', 'wonder', 'ray', 'charles',
      'aretha', 'franklin', 'whitney', 'houston', 'mariah', 'carey', 'celine', 'dion'
    ]
  }
};

/**
 * Get a random word from a specific category in a specific language
 */
export function getRandomWordFromCategory(category: string, language: Language): string {
  const words = wordDatabase[language]?.[category];
  if (!words || words.length === 0) {
    console.warn(`No words found for category ${category} in language ${language}`);
    return '';
  }
  return words[Math.floor(Math.random() * words.length)];
}

/**
 * Generate word pool automatically when users don't enter words
 */
export function generateWordPool(
  numPlayers: number,
  wordsPerPlayer: number,
  language: Language,
  categories: string[]
): Array<{ word: string; category: string }> {
  const wordPool: Array<{ word: string; category: string }> = [];
  const totalWords = numPlayers * wordsPerPlayer;

  for (let i = 0; i < totalWords; i++) {
    // Randomly select a category
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    // Get a random word from that category
    const word = getRandomWordFromCategory(randomCategory, language);
    if (word) {
      wordPool.push({ word, category: randomCategory });
    }
  }

  return wordPool;
}

export { wordDatabase };

