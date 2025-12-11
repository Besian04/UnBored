// assets/data.js
// Fixe Kategorien + Seed-Aktivitäten (Deutsch/Englisch)

export const FIXED_CATEGORIES = ['movies', 'games', 'outdoor'];

export const seedActivities = [
    // 🎬 Filme / Serien
    {
        id: 'm1',
        title: { de: 'Star Wars Marathon', en: 'Star Wars Marathon' },
        description: { de: 'Die komplette Saga in einem epischen Marathon', en: 'The complete saga in an epic marathon' },
        category: 'movies',
        durationMin: 180,
        rating: 4,
        players: { min: 1, max: 4 },
        tags: ['sci-fi', 'klassiker', 'marathon']
    },
    {
        id: 'm2',
        title: { de: 'Indie-Film entdecken', en: 'Discover an indie film' },
        description: { de: 'Tauch ein in die Welt des Independent-Kinos', en: 'Dive into the world of independent cinema' },
        category: 'movies',
        durationMin: 120,
        rating: 3,
        players: { min: 1, max: 2 },
        tags: ['indie', 'kunst', 'entdecken']
    },
    {
        id: 'm3',
        title: { de: 'Dokumentation schauen', en: 'Watch a documentary' },
        description: { de: 'Lerne faszinierende Fakten über unsere Welt', en: 'Learn fascinating facts about our world' },
        category: 'movies',
        durationMin: 90,
        rating: 3,
        players: { min: 1, max: 6 },
        tags: ['dokumentation', 'bildung', 'wissen']
    },
    {
        id: 'm4',
        title: { de: 'Neue Serie antesten', en: 'Try a new series' },
        description: { de: 'Starte mit den ersten Folgen einer unbekannten Serie', en: 'Start with the first episodes of an unknown series' },
        category: 'movies',
        durationMin: 60,
        rating: 4,
        players: { min: 1, max: 3 },
        tags: ['serie', 'neu', 'pilot']
    },
    {
        id: 'm5',
        title: { de: 'Komödie Klassiker', en: 'Comedy classic' },
        description: { de: 'Lache mit zeitlosen Komödien-Klassikern', en: 'Laugh with timeless comedy classics' },
        category: 'movies',
        durationMin: 100,
        rating: 5,
        players: { min: 1, max: 5 },
        tags: ['komödie', 'klassiker', 'lachen']
    },
    {
        id: 'm6',
        title: { de: 'Thriller Abend', en: 'Thriller night' },
        description: { de: 'Spannende Filme für Nervenkitzel-Fans', en: 'Exciting movies for thrill-seekers' },
        category: 'movies',
        durationMin: 110,
        rating: 4,
        players: { min: 1, max: 4 },
        tags: ['thriller', 'spannung', 'action']
    },
    {
        id: 'm7',
        title: { de: 'Anime Pilot', en: 'Anime pilot' },
        description: { de: 'Entdecke die erste Folge eines neuen Anime', en: 'Discover the first episode of a new anime' },
        category: 'movies',
        durationMin: 30,
        rating: 3,
        players: { min: 1, max: 2 },
        tags: ['anime', 'japanisch', 'animation']
    },

    // 🎮 Spiele
    {
        id: 'g1',
        title: { de: 'Indie-Plattformer', en: 'Indie platformer' },
        description: { de: 'Springe durch kreative Level voller Überraschungen', en: 'Jump through creative levels full of surprises' },
        category: 'games',
        durationMin: 45,
        rating: 4,
        players: { min: 1, max: 1 },
        tags: ['platformer', 'indie', 'springen']
    },
    {
        id: 'g2',
        title: { de: 'Rogue-Lite Run', en: 'Rogue-lite run' },
        description: { de: 'Jeder Durchgang ist einzigartig und herausfordernd', en: 'Every run is unique and challenging' },
        category: 'games',
        durationMin: 30,
        rating: 5,
        players: { min: 1, max: 1 },
        tags: ['rogue', 'prozedural', 'herausfordernd']
    },
    {
        id: 'g3',
        title: { de: 'Co-op Couch', en: 'Co-op couch' },
        description: { de: 'Gemeinsames Spielen vor dem Fernseher', en: 'Play together in front of the TV' },
        category: 'games',
        durationMin: 60,
        rating: 4,
        players: { min: 2, max: 4 },
        tags: ['coop', 'couch', 'multiplayer']
    },
    {
        id: 'g4',
        title: { de: 'Puzzle Challenge', en: 'Puzzle challenge' },
        description: { de: 'Trainiere dein Gehirn mit kniffligen Rätseln', en: 'Train your brain with tricky puzzles' },
        category: 'games',
        durationMin: 25,
        rating: 3,
        players: { min: 1, max: 2 },
        tags: ['puzzle', 'rätsel', 'denksport']
    },
    {
        id: 'g5',
        title: { de: 'Brettspiel Abend', en: 'Board game night' },
        description: { de: 'Klassische Spieleabend mit Freunden', en: 'Classic game night with friends' },
        category: 'games',
        durationMin: 90,
        rating: 4,
        players: { min: 2, max: 6 },
        tags: ['brettspiel', 'gesellschaft', 'freunde']
    },
    {
        id: 'g6',
        title: { de: 'MOBA Match', en: 'MOBA match' },
        description: { de: 'Strategisches Teamplay im Online-Battle', en: 'Strategic teamplay in online battles' },
        category: 'games',
        durationMin: 35,
        rating: 2,
        players: { min: 1, max: 1 },
        tags: ['moba', 'online', 'strategie']
    },

    // 🌳 Outdoor
    {
        id: 'o1',
        title: { de: 'Spaziergang im Park', en: 'Walk in the park' },
        description: { de: 'Entspannter Spaziergang durch die Natur', en: 'Relaxing walk through nature' },
        category: 'outdoor',
        durationMin: 30,
        rating: 4,
        players: { min: 1, max: 6 },
        tags: ['spazieren', 'entspannung', 'natur']
    },
    {
        id: 'o2',
        title: { de: 'Jogging 5 km', en: 'Jog 5 km' },
        description: { de: 'Aktive Laufrunde für Fitness und Gesundheit', en: 'Active running route for fitness and health' },
        category: 'outdoor',
        durationMin: 35,
        rating: 3,
        players: { min: 1, max: 3 },
        tags: ['laufen', 'sport', 'fitness']
    },
    {
        id: 'o3',
        title: { de: 'Fahrradrunde', en: 'Bike loop' },
        description: { de: 'Entdecke deine Umgebung auf zwei Rädern', en: 'Discover your surroundings on two wheels' },
        category: 'outdoor',
        durationMin: 60,
        rating: 5,
        players: { min: 1, max: 8 },
        tags: ['radfahren', 'ausflug', 'abenteuer']
    },
    {
        id: 'o4',
        title: { de: 'Street Photography', en: 'Street photography' },
        description: { de: 'Fange den Moment mit deiner Kamera ein', en: 'Capture the moment with your camera' },
        category: 'outdoor',
        durationMin: 50,
        rating: 3,
        players: { min: 1, max: 2 },
        tags: ['fotografie', 'kreativ', 'kunst']
    },
    {
        id: 'o5',
        title: { de: 'Picknick im Park', en: 'Picnic in the park' },
        description: { de: 'Gemütliches Essen und Gesellschaft im Freien', en: 'Cozy outdoor dining and socializing' },
        category: 'outdoor',
        durationMin: 90,
        rating: 2,
        players: { min: 2, max: 10 },
        tags: ['essen', 'gesellig', 'draußen']
    },
    {
        id: 'o6',
        title: { de: 'Botanischer Garten', en: 'Botanical garden' },
        description: { de: 'Bewundere exotische Pflanzen und Blumen', en: 'Admire exotic plants and flowers' },
        category: 'outdoor',
        durationMin: 70,
        rating: 4,
        players: { min: 1, max: 4 },
        tags: ['garten', 'natur', 'pflanzen']
    }
];