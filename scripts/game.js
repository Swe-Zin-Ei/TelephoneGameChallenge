// Game Configuration
const gameConfig = {
    categories: {
        easy: {
            name: "Easy",
            words: [
                "Sunshine", "Rainbow", "Butterfly", "Chocolate", "Pizza",
                "Ocean", "Mountain", "Starlight", "Cupcake", "Dragonfly"
            ]
        },
        medium: {
            name: "Medium",
            sentences: [
                "The quick brown fox jumps over the lazy dog",
                "She sells seashells by the seashore",
                "Peter Piper picked a peck of pickled peppers",
                "How much wood would a woodchuck chuck",
                "I love eating ice cream on hot summer days"
            ]
        },
        hard: {
            name: "Hard",
            sentences: [
                "The discovery of penicillin revolutionized modern medicine and saved millions of lives",
                "Artificial intelligence is transforming the way we live, work, and communicate with each other",
                "The Great Wall of China is one of the seven wonders of the world and spans thousands of miles"
            ]
        },
        funny: {
            name: "Funny",
            sentences: [
                "My cat tried to catch the laser pointer and ended up doing a backflip off the couch",
                "I accidentally put salt instead of sugar in my coffee and made the worst latte ever",
                "My dog thinks he's a lap dog even though he weighs 80 pounds"
            ]
        },
        movies: {
            name: "Movie Quotes",
            sentences: [
                "May the Force be with you",
                "Here's looking at you, kid",
                "I'm the king of the world!",
                "To infinity and beyond!",
                "You can't handle the truth!"
            ]
        }
    },
    
    voiceMapping: {
        male: ['Google UK English Male', 'Microsoft David', 'Google US English Male'],
        female: ['Google UK English Female', 'Microsoft Susan', 'Google US English Female'],
        girl: ['Google UK English Female', 'Microsoft Hazel'],
        oldWoman: ['Microsoft Susan', 'Google UK English Female'],
        oldMan: ['Microsoft David', 'Google UK English Male']
    },
    
    levelSettings: {
        B1: { rate: 0.8 },
        B2: { rate: 1.0 },
        C1: { rate: 1.2 },
        C2: { rate: 1.4 }
    },
    
    certificates: [
        { id: 'first_game', name: 'First Steps', icon: '🎮', description: 'Play your first game' },
        { id: 'accuracy_80', name: 'Sharp Memory', icon: '🎯', description: 'Achieve 80% accuracy' },
        { id: 'accuracy_90', name: 'Perfect Recall', icon: '🏆', description: 'Achieve 90% accuracy' },
        { id: 'accuracy_100', name: 'Photographic Memory', icon: '👑', description: 'Achieve 100% accuracy' },
        { id: 'games_5', name: 'Enthusiast', icon: '🌟', description: 'Play 5 games' },
        { id: 'games_10', name: 'Veteran', icon: '⚡', description: 'Play 10 games' },
        { id: 'games_25', name: 'Legend', icon: '🔥', description: 'Play 25 games' }
    ]
};

// Category preview data
const categoryExamples = {
    easy: "🌟 Sunshine, Rainbow, Butterfly, Chocolate",
    medium: "📝 The quick brown fox jumps over the lazy dog",
    hard: "🏆 The discovery of penicillin revolutionized modern medicine",
    funny: "😂 My cat tried to catch the laser pointer and did a backflip",
    movies: "🎬 May the Force be with you"
};

// Game State
let gameState = {
    user: {
        name: '',
        voice: 'male',
        level: 'B1',
        registered: false,
        memberSince: new Date().toISOString(),
        gamesPlayed: 0,
        bestScore: 0,
        totalScore: 0,
        totalRoundsPlayed: 0,
        certificates: [],
        gameHistory: []
    },
    
    currentCategory: 'medium',
    players: 5,
    totalRounds: 5,
    memoryTime: 10,
    currentRound: 1,
    currentPlayer: 1,
    score: 0,
    timeLeft: 10,
    timer: null,
    gameActive: false,
    roundComplete: false,
    waitingForPlayerInput: false,
    originalMessage: '',
    chainHistory: [],
    accuracyHistory: [],
    soundEnabled: true,
    autoReadEnabled: true,
    recognition: null,
    isListening: false,
    availableVoices: []
};

// DOM Elements
const elements = {};

// ========== SAFE ELEMENT GETTER ==========
function safeGetElement(id) {
    const el = document.getElementById(id);
    return el || null; // Return null if element doesn't exist
}

// ========== SAFE QUERY SELECTOR ==========
function safeQuerySelector(selector) {
    const el = document.querySelector(selector);
    return el || null;
}

function safeQuerySelectorAll(selector) {
    const els = document.querySelectorAll(selector);
    return els.length ? els : null;
}

// Initialize DOM elements with safety checks
function initElements() {
    // Game elements
    elements.playerCount = safeGetElement('playerCount');
    elements.currentRound = safeGetElement('currentRound');
    elements.score = safeGetElement('score');
    elements.timer = safeGetElement('timer');
    elements.currentPlayer = safeGetElement('currentPlayer');
    elements.instruction = safeGetElement('instruction');
    elements.displayText = safeGetElement('displayText');
    elements.messageTimer = safeGetElement('messageTimer');
    elements.messageTimeLeft = safeGetElement('messageTimeLeft');
    elements.playerInput = safeGetElement('playerInput');
    elements.submitBtn = safeGetElement('submitBtn');
    elements.startBtn = safeGetElement('startBtn');
    elements.nextBtn = safeGetElement('nextBtn');
    elements.resetBtn = safeGetElement('resetBtn');
    elements.settingsBtn = safeGetElement('settingsBtn');
    elements.playerChain = safeGetElement('playerChain');
    elements.currentTurn = safeGetElement('currentTurn');
    elements.resultsBox = safeGetElement('resultsBox');
    elements.finalOriginal = safeGetElement('finalOriginal');
    elements.finalResult = safeGetElement('finalResult');
    elements.matchPercentage = safeGetElement('matchPercentage');
    elements.resultMessage = safeGetElement('resultMessage');
    elements.historyList = safeGetElement('historyList');
    
    // Voice & Level controls
    elements.mainVoiceSelect = safeGetElement('mainVoiceSelect');
    elements.mainLevelSelect = safeGetElement('mainLevelSelect');
    elements.voiceLevelStatus = safeGetElement('voiceLevelStatus');
    
    // User elements
    elements.userModal = safeGetElement('userModal');
    elements.userName = safeGetElement('userName');
    elements.userVoice = safeGetElement('userVoice');
    elements.userLevel = safeGetElement('userLevel');
    elements.saveUser = safeGetElement('saveUser');
    
    // Account elements
    elements.accountModal = safeGetElement('accountModal');
    elements.accountName = safeGetElement('accountName');
    elements.memberSince = safeGetElement('memberSince');
    elements.gamesPlayed = safeGetElement('gamesPlayed');
    elements.bestScore = safeGetElement('bestScore');
    elements.avgAccuracy = safeGetElement('avgAccuracy');
    elements.certificatesGrid = safeGetElement('certificatesGrid');
    elements.editNameBtn = safeGetElement('editNameBtn');
    elements.closeAccountBtn = safeGetElement('closeAccountBtn');
    
    // Edit name modal
    elements.editNameModal = safeGetElement('editNameModal');
    elements.newUserName = safeGetElement('newUserName');
    elements.saveNewName = safeGetElement('saveNewName');
    elements.cancelEditName = safeGetElement('cancelEditName');
    
    // Settings modal
    elements.settingsModal = safeGetElement('settingsModal');
    elements.gameOverModal = safeGetElement('gameOverModal');
    elements.playerCountSelect = safeGetElement('playerCountSelect');
    elements.timeLimitSelect = safeGetElement('timeLimitSelect');
    elements.roundCountSelect = safeGetElement('roundCountSelect');
    elements.soundToggle = safeGetElement('soundToggle');
    elements.autoReadToggle = safeGetElement('autoReadToggle');
    elements.saveSettings = safeGetElement('saveSettings');
    elements.closeSettings = safeGetElement('closeSettings');
    
    // TTS and Voice elements
    elements.speakMessageBtn = safeGetElement('speakMessageBtn');
    elements.ttsStatus = safeGetElement('ttsStatus');
    elements.typeTab = safeGetElement('typeTab');
    elements.voiceTab = safeGetElement('voiceTab');
    elements.typeInput = safeGetElement('typeInput');
    elements.voiceInput = safeGetElement('voiceInput');
    elements.startListeningBtn = safeGetElement('startListeningBtn');
    elements.stopListeningBtn = safeGetElement('stopListeningBtn');
    elements.voiceStatus = safeGetElement('voiceStatus');
    elements.voiceResult = safeGetElement('voiceResult');
    elements.voiceMatch = safeGetElement('voiceMatch');
    elements.matchResult = safeGetElement('matchResult');
    elements.useVoiceBtn = safeGetElement('useVoiceText');
    elements.tryAgainBtn = safeGetElement('tryAgainVoice');
    
    // Game over
    elements.finalRound = safeGetElement('finalRound');
    elements.finalScore = safeGetElement('finalScore');
    elements.finalAccuracy = safeGetElement('finalAccuracy');
    elements.gameOverTitle = safeGetElement('gameOverTitle');
    elements.gameOverMessage = safeGetElement('gameOverMessage');
    elements.bestPhrase = safeGetElement('bestPhrase');
    elements.playAgainBtn = safeGetElement('playAgainBtn');
    elements.mainMenuBtn = safeGetElement('mainMenuBtn');
    
    // Navigation links
    elements.accountNavLink = safeGetElement('accountNavLink');
    elements.footerAccountLink = safeGetElement('footerAccountLink');
    
    // Category modal elements
    elements.categoriesToggleBtn = safeGetElement('categoriesToggleBtn');
    elements.categoriesModal = safeGetElement('categoriesModal');
    elements.closeCategoriesModal = safeGetElement('closeCategoriesModal');
    elements.categoryCards = safeQuerySelectorAll('.category-card');
    elements.previewMessage = safeGetElement('previewMessage');
    elements.currentCategoryDisplay = safeGetElement('currentCategoryDisplay');
    elements.applyCategoryBtn = safeGetElement('applyCategoryBtn');
    elements.cancelCategoryBtn = safeGetElement('cancelCategoryBtn');
    
    // Clock elements
    elements.navTime = safeGetElement('navTime');
    elements.navDate = safeGetElement('navDate');
}

// ========== LOCAL STORAGE FUNCTIONS ==========

function saveUserToStorage() {
    const userData = {
        name: gameState.user.name,
        voice: gameState.user.voice,
        level: gameState.user.level,
        registered: true,
        memberSince: gameState.user.memberSince,
        gamesPlayed: gameState.user.gamesPlayed,
        bestScore: gameState.user.bestScore,
        totalScore: gameState.user.totalScore,
        totalRoundsPlayed: gameState.user.totalRoundsPlayed,
        certificates: gameState.user.certificates,
        gameHistory: gameState.user.gameHistory || [],
        lastPlayed: new Date().toISOString()
    };
    localStorage.setItem('telephoneGameUser', JSON.stringify(userData));
}

function loadUserFromStorage() {
    const saved = localStorage.getItem('telephoneGameUser');
    if (saved) {
        try {
            const userData = JSON.parse(saved);
            gameState.user = { ...gameState.user, ...userData };
            return true;
        } catch (e) {
            return false;
        }
    }
    return false;
}

function updateAccountUI() {
    if (!gameState.user.registered || !gameState.user.name) return;
    
    if (elements.accountName) elements.accountName.textContent = gameState.user.name;
    
    if (elements.memberSince) {
        const date = new Date(gameState.user.memberSince);
        elements.memberSince.textContent = date.toLocaleDateString('en-US', { 
            year: 'numeric', month: 'long', day: 'numeric' 
        });
    }
    
    if (elements.gamesPlayed) elements.gamesPlayed.textContent = gameState.user.gamesPlayed;
    if (elements.bestScore) elements.bestScore.textContent = gameState.user.bestScore;
    
    if (elements.avgAccuracy) {
        const avgAccuracy = gameState.user.gamesPlayed > 0 && gameState.user.totalRoundsPlayed > 0
            ? Math.round((gameState.user.totalScore / gameState.user.totalRoundsPlayed) * 100) / 100
            : 0;
        elements.avgAccuracy.textContent = `${avgAccuracy}%`;
    }
    
    updateCertificates();
    
    if (elements.mainVoiceSelect) elements.mainVoiceSelect.value = gameState.user.voice;
    if (elements.mainLevelSelect) elements.mainLevelSelect.value = gameState.user.level;
}

function updateCertificates() {
    if (!elements.certificatesGrid) return;
    
    const certificates = gameConfig.certificates;
    const earned = new Set(gameState.user.certificates || []);
    
    let html = '';
    certificates.forEach(cert => {
        const isEarned = earned.has(cert.id);
        html += `
            <div class="certificate-card ${isEarned ? '' : 'locked'}">
                <div class="certificate-icon">${cert.icon}</div>
                <h4>${cert.name}</h4>
                <p>${cert.description}</p>
                <div class="certificate-badge">${isEarned ? '✓' : '🔒'}</div>
            </div>
        `;
    });
    
    elements.certificatesGrid.innerHTML = html;
}

function checkCertificates() {
    const user = gameState.user;
    const earned = new Set(user.certificates || []);
    
    if (user.gamesPlayed >= 1 && !earned.has('first_game')) {
        earned.add('first_game');
        showNotification('🎉 Certificate Earned: First Steps!', 'success');
    }
    
    if (user.gamesPlayed >= 5 && !earned.has('games_5')) {
        earned.add('games_5');
        showNotification('🌟 Certificate Earned: Enthusiast!', 'success');
    }
    
    if (user.gamesPlayed >= 10 && !earned.has('games_10')) {
        earned.add('games_10');
        showNotification('⚡ Certificate Earned: Veteran!', 'success');
    }
    
    if (user.gamesPlayed >= 25 && !earned.has('games_25')) {
        earned.add('games_25');
        showNotification('🔥 Certificate Earned: Legend!', 'success');
    }
    
    const history = user.gameHistory || [];
    if (history.length > 0) {
        const maxAccuracy = Math.max(...history.map(g => g.accuracy));
        
        if (maxAccuracy >= 80 && !earned.has('accuracy_80')) {
            earned.add('accuracy_80');
            showNotification('🎯 Certificate Earned: Sharp Memory!', 'success');
        }
        if (maxAccuracy >= 90 && !earned.has('accuracy_90')) {
            earned.add('accuracy_90');
            showNotification('🏆 Certificate Earned: Perfect Recall!', 'success');
        }
        if (maxAccuracy >= 100 && !earned.has('accuracy_100')) {
            earned.add('accuracy_100');
            showNotification('👑 Certificate Earned: Photographic Memory!', 'success');
        }
    }
    
    user.certificates = Array.from(earned);
    saveUserToStorage();
    updateCertificates();
}

// ========== VOICE FUNCTIONS ==========

function loadVoices() {
    return new Promise((resolve) => {
        let voices = window.speechSynthesis.getVoices();
        if (voices.length) {
            gameState.availableVoices = voices;
            resolve(voices);
        } else {
            window.speechSynthesis.onvoiceschanged = () => {
                voices = window.speechSynthesis.getVoices();
                gameState.availableVoices = voices;
                resolve(voices);
            };
        }
    });
}

function findBestVoice() {
    if (gameState.availableVoices.length === 0) return null;
    
    const preferredVoice = gameState.user.voice;
    const possibleNames = gameConfig.voiceMapping[preferredVoice] || gameConfig.voiceMapping.male;
    
    for (const name of possibleNames) {
        const voice = gameState.availableVoices.find(v => 
            v.name.includes(name) && v.lang.startsWith('en')
        );
        if (voice) return voice;
    }
    
    return gameState.availableVoices.find(v => v.lang.startsWith('en'));
}

function speakText(text) {
    if (!('speechSynthesis' in window)) {
        if (elements.ttsStatus) elements.ttsStatus.textContent = 'Not supported';
        return;
    }
    
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = findBestVoice();
    if (voice) utterance.voice = voice;
    
    utterance.lang = 'en-US';
    
    const levelSettings = gameConfig.levelSettings[gameState.user.level] || gameConfig.levelSettings.B1;
    utterance.rate = levelSettings.rate;
    
    if (gameState.user.voice === 'girl') utterance.pitch = 1.5;
    else if (gameState.user.voice === 'oldWoman' || gameState.user.voice === 'oldMan') {
        utterance.pitch = 0.8;
        utterance.rate = utterance.rate * 0.9;
    }
    
    utterance.onstart = () => {
        if (elements.speakMessageBtn) elements.speakMessageBtn.classList.add('speaking');
        if (elements.ttsStatus) elements.ttsStatus.textContent = '🔊 Speaking...';
    };
    
    utterance.onend = () => {
        if (elements.speakMessageBtn) elements.speakMessageBtn.classList.remove('speaking');
        if (elements.ttsStatus) elements.ttsStatus.textContent = '';
    };
    
    window.speechSynthesis.speak(utterance);
}

function initSpeechRecognition() {
    if (!elements.startListeningBtn) return; // Only init if on game page
    
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        if (elements.voiceStatus) elements.voiceStatus.textContent = 'Voice recognition not supported';
        if (elements.startListeningBtn) elements.startListeningBtn.disabled = true;
        return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    gameState.recognition = new SpeechRecognition();
    gameState.recognition.continuous = false;
    gameState.recognition.interimResults = true;
    gameState.recognition.lang = 'en-US';
    
    gameState.recognition.onstart = () => {
        gameState.isListening = true;
        if (elements.startListeningBtn) {
            elements.startListeningBtn.disabled = true;
            elements.startListeningBtn.classList.add('listening');
        }
        if (elements.stopListeningBtn) elements.stopListeningBtn.disabled = false;
        if (elements.voiceStatus) {
            elements.voiceStatus.textContent = 'Listening... Speak clearly';
            elements.voiceStatus.style.color = '#f72585';
        }
    };
    
    gameState.recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
            .map(result => result[0].transcript)
            .join('');
        
        if (elements.voiceResult) elements.voiceResult.textContent = transcript;
    };
    
    gameState.recognition.onend = () => {
        gameState.isListening = false;
        if (elements.startListeningBtn) {
            elements.startListeningBtn.disabled = false;
            elements.startListeningBtn.classList.remove('listening');
        }
        if (elements.stopListeningBtn) elements.stopListeningBtn.disabled = true;
        if (elements.voiceStatus) {
            elements.voiceStatus.textContent = 'Click to speak again';
            elements.voiceStatus.style.color = '#666';
        }
        
        // Show match check if we have a result
        if (elements.voiceResult && elements.voiceResult.textContent.trim()) {
            checkVoiceMatch();
        }
    };
}

function checkVoiceMatch() {
    if (!elements.voiceResult || !elements.displayText) return;
    
    const spoken = elements.voiceResult.textContent.trim().toLowerCase();
    const target = elements.displayText.textContent.toLowerCase();
    
    if (spoken && target && target !== 'the message will appear here' && target !== '🔊 listen carefully...') {
        const similarity = calculateSimilarity(spoken, target) * 100;
        
        let matchClass = '';
        let matchMessage = '';
        
        if (similarity >= 80) {
            matchClass = 'perfect';
            matchMessage = `🎉 Perfect match! (${similarity.toFixed(0)}% similar)`;
        } else if (similarity >= 50) {
            matchClass = 'good';
            matchMessage = `👍 Good match! (${similarity.toFixed(0)}% similar)`;
        } else {
            matchClass = 'poor';
            matchMessage = `😅 Needs improvement (${similarity.toFixed(0)}% similar)`;
        }
        
        if (elements.matchResult) {
            elements.matchResult.textContent = matchMessage;
            elements.matchResult.className = `match-result ${matchClass}`;
        }
        if (elements.voiceMatch) elements.voiceMatch.style.display = 'block';
    }
}

// ========== GAME FUNCTIONS ==========

function calculateSimilarity(str1, str2) {
    str1 = str1.toLowerCase().trim();
    str2 = str2.toLowerCase().trim();
    
    if (str1 === str2) return 1;
    
    const words1 = str1.split(/\s+/);
    const words2 = str2.split(/\s+/);
    
    let matches = 0;
    const used = new Array(words2.length).fill(false);
    
    words1.forEach(word1 => {
        for (let i = 0; i < words2.length; i++) {
            if (!used[i] && (words2[i].includes(word1) || word1.includes(words2[i]))) {
                matches++;
                used[i] = true;
                break;
            }
        }
    });
    
    const totalWords = Math.max(words1.length, words2.length);
    return totalWords > 0 ? matches / totalWords : 0;
}

function generatePlayerChain() {
    if (!elements.playerChain) return;
    
    elements.playerChain.innerHTML = '';
    for (let i = 1; i <= gameState.players; i++) {
        const avatars = ['🦊', '🐼', '🐨', '🦁', '🐧', '🐸', '🦉'];
        const avatar = avatars[(i - 1) % avatars.length];
        
        const playerDiv = document.createElement('div');
        playerDiv.className = `player ${i === 1 ? 'active' : ''}`;
        playerDiv.innerHTML = `
            <div class="player-avatar">${avatar}</div>
            <div class="player-name">Player ${i}</div>
            <div class="player-status">${i === 1 ? 'Current' : i === gameState.players ? 'Last' : 'Waiting'}</div>
        `;
        elements.playerChain.appendChild(playerDiv);
        
        if (i < gameState.players) {
            const lineDiv = document.createElement('div');
            lineDiv.className = 'phone-line';
            elements.playerChain.appendChild(lineDiv);
        }
    }
}

function updatePlayerChain() {
    const players = document.querySelectorAll('.player');
    if (!players.length) return;
    
    players.forEach((player, index) => {
        const playerNum = index + 1;
        player.classList.remove('active', 'completed');
        
        if (playerNum < gameState.currentPlayer) {
            player.classList.add('completed');
            const statusEl = player.querySelector('.player-status');
            if (statusEl) statusEl.textContent = 'Done';
        } else if (playerNum === gameState.currentPlayer) {
            player.classList.add('active');
            const statusEl = player.querySelector('.player-status');
            if (statusEl) statusEl.textContent = 'Speaking';
        } else {
            player.classList.remove('active', 'completed');
            const statusEl = player.querySelector('.player-status');
            if (statusEl) {
                statusEl.textContent = playerNum === gameState.players ? 'Last' : 'Waiting';
            }
        }
    });
}

function generateMessage() {
    const category = gameConfig.categories[gameState.currentCategory];
    
    if (gameState.currentCategory === 'easy') {
        gameState.originalMessage = category.words[Math.floor(Math.random() * category.words.length)];
    } else {
        const sentences = category.sentences || category.words;
        gameState.originalMessage = sentences[Math.floor(Math.random() * sentences.length)];
    }
    
    gameState.chainHistory = [{ player: 0, message: gameState.originalMessage }];
    gameState.accuracyHistory = [];
    gameState.roundComplete = false;
}

function updateButtonStates() {
    if (!elements.startBtn || !elements.nextBtn) return;
    
    if (gameState.gameActive && !gameState.roundComplete) {
        elements.startBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
        elements.nextBtn.disabled = true;
    } else if (!gameState.gameActive && gameState.roundComplete) {
        elements.startBtn.innerHTML = '<i class="fas fa-play"></i> Resume';
        if (gameState.currentRound < gameState.totalRounds) {
            elements.nextBtn.disabled = false;
            elements.nextBtn.textContent = 'Next Round';
        } else if (gameState.currentRound === gameState.totalRounds) {
            elements.nextBtn.disabled = false;
            elements.nextBtn.textContent = 'See Results';
        }
    } else {
        elements.startBtn.innerHTML = '<i class="fas fa-play"></i> Start Game';
        elements.nextBtn.disabled = true;
        elements.nextBtn.textContent = 'Next Round';
    }
}

function startGame() {
    if (!elements.userModal || !elements.startBtn || !elements.nextBtn) return;
    
    if (!gameState.user.registered) {
        elements.userModal.style.display = 'flex';
        return;
    }
    
    if (gameState.gameActive) {
        // Pause game
        clearInterval(gameState.timer);
        gameState.gameActive = false;
        gameState.waitingForPlayerInput = false;
        updateButtonStates();
        return;
    }
    
    // Start or resume game
    if (gameState.currentRound === 1 && !gameState.gameActive && !gameState.roundComplete) {
        gameState.score = 0;
        gameState.currentPlayer = 1;
        if (elements.score) elements.score.textContent = '0';
        generateMessage();
        if (elements.resultsBox) elements.resultsBox.style.display = 'none';
        if (elements.currentTurn) elements.currentTurn.style.display = 'block';
        gameState.roundComplete = false;
    }
    
    gameState.gameActive = true;
    gameState.waitingForPlayerInput = true;
    elements.nextBtn.disabled = true;
    updateButtonStates();
    startPlayerTurn();
}

function startPlayerTurn() {
    if (!gameState.gameActive || !gameState.waitingForPlayerInput) return;
    if (!elements.currentPlayer || !elements.instruction || !elements.displayText) return;
    
    gameState.timeLeft = gameState.memoryTime;
    elements.currentPlayer.textContent = `Player ${gameState.currentPlayer}`;
    updatePlayerChain();
    
    let messageToShow;
    if (gameState.currentPlayer === 1) {
        messageToShow = gameState.originalMessage;
        elements.instruction.textContent = `${gameState.user.name}, remember this carefully!`;
    } else {
        const prevMessage = gameState.chainHistory[gameState.currentPlayer - 1]?.message || gameState.originalMessage;
        messageToShow = prevMessage;
        elements.instruction.textContent = `Player ${gameState.currentPlayer - 1} said:`;
    }
    
    // Show/hide text based on round and player
    if (gameState.currentRound === 1 && gameState.currentPlayer === 1) {
        // First round, first player - show message
        elements.displayText.textContent = messageToShow;
        elements.displayText.style.opacity = '1';
        elements.displayText.style.display = 'flex';
        
        // Auto-read for first player
        if (gameState.autoReadEnabled) {
            setTimeout(() => speakText(messageToShow), 500);
        }
    } else {
        // All other rounds/players - NO TEXT AT ALL
        elements.displayText.textContent = '🔊 Listen carefully...';
        elements.displayText.style.opacity = '0.3';
        
        // Auto-read the message for all players
        if (gameState.autoReadEnabled) {
            setTimeout(() => speakText(messageToShow), 500);
        }
    }
    
    // Clear any existing timer
    if (gameState.timer) clearInterval(gameState.timer);
    
    startTimer();
}

function startTimer() {
    if (!elements.timer || !elements.messageTimeLeft || !elements.messageTimer) return;
    
    const startTime = Date.now();
    const totalTime = gameState.memoryTime * 1000;
    
    gameState.timer = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, totalTime - elapsed);
        
        gameState.timeLeft = Math.ceil(remaining / 1000);
        elements.timer.textContent = `${gameState.timeLeft}s`;
        elements.messageTimeLeft.textContent = `${gameState.timeLeft}s`;
        
        const percentage = (remaining / totalTime) * 100;
        elements.messageTimer.style.width = `${percentage}%`;
        
        if (gameState.timeLeft <= 3) {
            elements.messageTimer.style.background = 'linear-gradient(to right, #ef476f, #f72585)';
        } else if (gameState.timeLeft <= 7) {
            elements.messageTimer.style.background = 'linear-gradient(to right, #f8961e, #f9c74f)';
        } else {
            elements.messageTimer.style.background = 'linear-gradient(to right, #4cc9f0, #2ec4b6)';
        }
        
        // For first round only, fade the text
        if (gameState.currentRound === 1 && gameState.currentPlayer === 1 && elements.displayText) {
            if (remaining <= 2000) {
                elements.displayText.style.opacity = '0.3';
            }
        }
        
        // When timer reaches zero
        if (remaining <= 0) {
            clearInterval(gameState.timer);
            if (elements.instruction) {
                elements.instruction.textContent = 'Time is up! Please type or speak what you remember...';
            }
            // DON'T auto-submit - wait for user input
        }
    }, 100);
}

function processPlayerInput(input) {
    if (!gameState.gameActive || !gameState.waitingForPlayerInput) return;
    
    const trimmedInput = input.trim();
    if (!trimmedInput) return;
    
    // Stop the timer
    clearInterval(gameState.timer);
    
    gameState.chainHistory.push({
        player: gameState.currentPlayer,
        message: trimmedInput
    });
    
    if (gameState.currentPlayer > 1) {
        const prevMessage = gameState.chainHistory[gameState.currentPlayer - 1].message;
        const accuracy = calculateSimilarity(prevMessage, trimmedInput);
        gameState.accuracyHistory.push({
            round: gameState.currentRound,
            player: gameState.currentPlayer,
            accuracy: accuracy
        });
        
        gameState.score += Math.floor(accuracy * 100);
        if (elements.score) elements.score.textContent = gameState.score;
    }
    
    if (gameState.currentPlayer < gameState.players) {
        gameState.currentPlayer++;
        startPlayerTurn();
    } else {
        // All players have had their turn
        gameState.waitingForPlayerInput = false;
        endRound();
    }
    
    if (elements.playerInput) elements.playerInput.value = '';
    if (elements.voiceResult) elements.voiceResult.textContent = '';
    if (elements.voiceMatch) elements.voiceMatch.style.display = 'none';
}

function endRound() {
    clearInterval(gameState.timer);
    gameState.gameActive = false;
    gameState.roundComplete = true;
    gameState.waitingForPlayerInput = false;
    
    showResults();
    addToHistory();
    
    if (gameState.currentRound >= gameState.totalRounds) {
        if (elements.startBtn) elements.startBtn.style.display = 'none';
        if (elements.nextBtn) {
            elements.nextBtn.disabled = false;
            elements.nextBtn.textContent = 'See Final Results';
        }
    } else {
        if (elements.startBtn) elements.startBtn.disabled = false;
        updateButtonStates();
    }
}

function showResults() {
    if (!elements.finalOriginal || !elements.finalResult || !elements.matchPercentage || 
        !elements.resultMessage || !elements.resultsBox || !elements.currentTurn) return;
    
    const original = gameState.originalMessage;
    const final = gameState.chainHistory[gameState.chainHistory.length - 1].message;
    const accuracy = calculateSimilarity(original, final) * 100;
    
    elements.finalOriginal.textContent = original;
    elements.finalResult.textContent = final;
    elements.matchPercentage.textContent = `${accuracy.toFixed(1)}%`;
    
    let message = '', messageClass = '';
    if (accuracy >= 80) {
        message = '🎉 Excellent! The message survived!';
        messageClass = 'success';
    } else if (accuracy >= 50) {
        message = '👍 Good job! Some words survived!';
        messageClass = 'good';
    } else {
        message = '😂 Completely transformed!';
        messageClass = 'poor';
    }
    
    elements.resultMessage.textContent = message;
    elements.resultMessage.className = `result-message ${messageClass}`;
    
    elements.resultsBox.style.display = 'block';
    elements.currentTurn.style.display = 'none';
}

function addToHistory() {
    if (!elements.historyList) return;
    
    const original = gameState.originalMessage;
    const final = gameState.chainHistory[gameState.chainHistory.length - 1].message;
    const accuracy = calculateSimilarity(original, final) * 100;
    
    const historyItem = document.createElement('div');
    historyItem.className = 'history-item';
    historyItem.innerHTML = `
        <div class="history-round">Round ${gameState.currentRound}</div>
        <div class="history-message">
            <span class="history-original" title="${original}">${original.substring(0, 25)}...</span>
            <i class="fas fa-arrow-right"></i>
            <span class="history-final" title="${final}">${final.substring(0, 25)}...</span>
        </div>
        <div class="history-accuracy">${accuracy.toFixed(0)}%</div>
    `;
    
    const emptyHistory = elements.historyList.querySelector('.empty-history');
    if (emptyHistory) emptyHistory.remove();
    elements.historyList.prepend(historyItem);
}

function nextRound() {
    if (!elements.startBtn || !elements.nextBtn || !elements.currentRound) return;
    
    if (gameState.currentRound >= gameState.totalRounds) {
        endGame();
        return;
    }
    
    gameState.currentRound++;
    gameState.currentPlayer = 1;
    gameState.gameActive = true;
    gameState.roundComplete = false;
    gameState.waitingForPlayerInput = true;
    
    elements.currentRound.textContent = `${gameState.currentRound}/${gameState.totalRounds}`;
    if (elements.resultsBox) elements.resultsBox.style.display = 'none';
    if (elements.currentTurn) elements.currentTurn.style.display = 'block';
    
    elements.startBtn.style.display = 'inline-flex';
    elements.startBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
    elements.nextBtn.disabled = true;
    
    generateMessage();
    startPlayerTurn();
}

function endGame() {
    if (!elements.finalRound || !elements.finalScore || !elements.finalAccuracy || 
        !elements.gameOverTitle || !elements.gameOverMessage || !elements.bestPhrase || 
        !elements.gameOverModal) return;
    
    const totalAccuracy = gameState.accuracyHistory.reduce((sum, item) => sum + item.accuracy, 0);
    const avgAccuracy = gameState.accuracyHistory.length > 0 
        ? (totalAccuracy / gameState.accuracyHistory.length) * 100 
        : 0;
    
    elements.finalRound.textContent = gameState.currentRound;
    elements.finalScore.textContent = gameState.score;
    elements.finalAccuracy.textContent = `${avgAccuracy.toFixed(1)}%`;
    
    elements.gameOverTitle.textContent = gameState.score > 500 ? '🎉 Amazing!' : '😊 Good Game!';
    elements.gameOverMessage.textContent = `${gameState.user.name}, you scored ${gameState.score} points!`;
    elements.bestPhrase.textContent = gameState.originalMessage;
    
    // Save game to history
    const gameRecord = {
        date: new Date().toISOString(),
        rounds: gameState.currentRound,
        score: gameState.score,
        accuracy: avgAccuracy,
        category: gameState.currentCategory
    };
    
    if (!gameState.user.gameHistory) gameState.user.gameHistory = [];
    gameState.user.gameHistory.push(gameRecord);
    
    // Update user stats
    gameState.user.gamesPlayed++;
    gameState.user.totalScore += gameState.score;
    gameState.user.totalRoundsPlayed += gameState.currentRound;
    
    if (gameState.score > gameState.user.bestScore) {
        gameState.user.bestScore = gameState.score;
    }
    
    checkCertificates();
    saveUserToStorage();
    updateAccountUI();
    
    elements.gameOverModal.style.display = 'flex';
    
    // Reset for next game
    if (elements.startBtn) {
        elements.startBtn.style.display = 'inline-flex';
        elements.startBtn.innerHTML = '<i class="fas fa-play"></i> Start Game';
    }
    if (elements.nextBtn) elements.nextBtn.disabled = true;
}

function resetGame() {
    clearInterval(gameState.timer);
    
    gameState.currentRound = 1;
    gameState.currentPlayer = 1;
    gameState.score = 0;
    gameState.gameActive = false;
    gameState.roundComplete = false;
    gameState.waitingForPlayerInput = false;
    gameState.chainHistory = [];
    gameState.accuracyHistory = [];
    
    if (elements.currentRound) {
        elements.currentRound.textContent = `${gameState.currentRound}/${gameState.totalRounds}`;
    }
    if (elements.score) elements.score.textContent = '0';
    
    generatePlayerChain();
    
    if (elements.currentTurn) elements.currentTurn.style.display = 'block';
    if (elements.resultsBox) elements.resultsBox.style.display = 'none';
    if (elements.startBtn) {
        elements.startBtn.innerHTML = '<i class="fas fa-play"></i> Start Game';
        elements.startBtn.disabled = false;
        elements.startBtn.style.display = 'inline-flex';
    }
    if (elements.nextBtn) {
        elements.nextBtn.disabled = true;
        elements.nextBtn.textContent = 'Next Round';
    }
    if (elements.displayText) {
        elements.displayText.textContent = 'The message will appear here';
        elements.displayText.style.opacity = '1';
    }
    if (elements.playerInput) elements.playerInput.value = '';
    if (elements.voiceResult) elements.voiceResult.textContent = '';
    if (elements.voiceMatch) elements.voiceMatch.style.display = 'none';
    
    if (elements.historyList) {
        elements.historyList.innerHTML = '<div class="empty-history">No games played yet. Start playing!</div>';
    }
}

function loadSettings() {
    const saved = localStorage.getItem('telephoneGameSettings');
    if (saved) {
        const settings = JSON.parse(saved);
        gameState.players = settings.players || 5;
        gameState.totalRounds = settings.rounds || 5;
        gameState.memoryTime = settings.timeLimit || 10;
        gameState.soundEnabled = settings.soundEnabled !== false;
        gameState.autoReadEnabled = settings.autoReadEnabled !== false;
        
        if (elements.playerCountSelect) elements.playerCountSelect.value = gameState.players;
        if (elements.roundCountSelect) elements.roundCountSelect.value = gameState.totalRounds;
        if (elements.timeLimitSelect) elements.timeLimitSelect.value = gameState.memoryTime;
        if (elements.soundToggle) elements.soundToggle.checked = gameState.soundEnabled;
        if (elements.autoReadToggle) elements.autoReadToggle.checked = gameState.autoReadEnabled;
        if (elements.playerCount) elements.playerCount.textContent = gameState.players;
        if (elements.currentRound) elements.currentRound.textContent = `${gameState.currentRound}/${gameState.totalRounds}`;
    }
}

function saveSettings() {
    const settings = {
        players: parseInt(elements.playerCountSelect?.value || 5),
        rounds: parseInt(elements.roundCountSelect?.value || 5),
        timeLimit: parseInt(elements.timeLimitSelect?.value || 10),
        soundEnabled: elements.soundToggle?.checked || true,
        autoReadEnabled: elements.autoReadToggle?.checked || true
    };
    
    localStorage.setItem('telephoneGameSettings', JSON.stringify(settings));
    
    gameState.players = settings.players;
    gameState.totalRounds = settings.rounds;
    gameState.memoryTime = settings.timeLimit;
    gameState.soundEnabled = settings.soundEnabled;
    gameState.autoReadEnabled = settings.autoReadEnabled;
    
    if (elements.timer) elements.timer.textContent = `${gameState.memoryTime}s`;
    
    generatePlayerChain();
    if (elements.playerCount) elements.playerCount.textContent = gameState.players;
    if (elements.currentRound) elements.currentRound.textContent = `${gameState.currentRound}/${gameState.totalRounds}`;
    
    if (elements.settingsModal) elements.settingsModal.style.display = 'none';
    showNotification('Settings saved!', 'success');
}

// ========== CATEGORY MODAL FUNCTIONS ==========

function initCategoryModal() {
    // Open modal
    if (elements.categoriesToggleBtn && elements.categoriesModal) {
        elements.categoriesToggleBtn.addEventListener('click', () => {
            openCategoryModal();
        });
    }
    
    // Close modal with X button
    if (elements.closeCategoriesModal && elements.categoriesModal) {
        elements.closeCategoriesModal.addEventListener('click', () => {
            closeCategoryModal();
        });
    }
    
    // Close modal with Cancel button
    if (elements.cancelCategoryBtn && elements.categoriesModal) {
        elements.cancelCategoryBtn.addEventListener('click', () => {
            closeCategoryModal();
        });
    }
    
    // Category card click
    if (elements.categoryCards) {
        elements.categoryCards.forEach(card => {
            card.addEventListener('click', () => {
                // Remove active class from all cards
                elements.categoryCards.forEach(c => c.classList.remove('active'));
                // Add active class to clicked card
                card.classList.add('active');
                // Update preview
                const category = card.dataset.category;
                updateCategoryPreview(category);
            });
        });
    }
    
    // Apply category button
    if (elements.applyCategoryBtn && elements.categoriesModal) {
        elements.applyCategoryBtn.addEventListener('click', () => {
            const activeCard = document.querySelector('.category-card.active');
            if (activeCard) {
                const category = activeCard.dataset.category;
                applyCategory(category);
            }
            closeCategoryModal();
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (elements.categoriesModal && e.target === elements.categoriesModal) {
            closeCategoryModal();
        }
    });
}

// Open category modal
function openCategoryModal() {
    if (!elements.categoriesModal || !elements.categoryCards) return;
    
    // Set current category as active
    elements.categoryCards.forEach(card => {
        if (card.dataset.category === gameState.currentCategory) {
            card.classList.add('active');
        } else {
            card.classList.remove('active');
        }
    });
    
    // Update preview
    updateCategoryPreview(gameState.currentCategory);
    
    // Show modal
    elements.categoriesModal.style.display = 'flex';
}

// Close category modal
function closeCategoryModal() {
    if (elements.categoriesModal) {
        elements.categoriesModal.style.display = 'none';
    }
}

// Update category preview
function updateCategoryPreview(category) {
    if (elements.previewMessage) {
        elements.previewMessage.textContent = categoryExamples[category] || 'Select a category to see example';
    }
}

// Apply selected category
function applyCategory(category) {
    if (category && gameState.currentCategory !== category) {
        gameState.currentCategory = category;
        
        // Update display
        if (elements.currentCategoryDisplay) {
            const categoryNames = {
                easy: 'Easy',
                medium: 'Medium',
                hard: 'Hard',
                funny: 'Funny',
                movies: 'Movies'
            };
            elements.currentCategoryDisplay.textContent = categoryNames[category] || category;
        }
        
        // Show notification
        showNotification(`Category changed to ${categoryNames[category]}`, 'success');
        
        // If game is not active, generate a preview message
        if (!gameState.gameActive && elements.displayText) {
            const categoryData = gameConfig.categories[category];
            let previewMsg;
            if (category === 'easy') {
                previewMsg = categoryData.words[0];
            } else {
                previewMsg = categoryData.sentences[0];
            }
            elements.displayText.textContent = previewMsg;
        }
    }
}

// ========== VOICE/LEVEL UPDATE ==========

function updateVoiceAndLevel() {
    // Update from main selects
    if (elements.mainVoiceSelect) {
        gameState.user.voice = elements.mainVoiceSelect.value;
    }
    if (elements.mainLevelSelect) {
        gameState.user.level = elements.mainLevelSelect.value;
    }
    
    // Save to storage
    saveUserToStorage();
    
    // Show status message with animation
    if (elements.voiceLevelStatus) {
        // Clear any existing timeout
        if (window.statusTimeout) {
            clearTimeout(window.statusTimeout);
        }
        
        // Set the message
        elements.voiceLevelStatus.textContent = '✓ Settings saved';
        
        // Hide after 2 seconds
        window.statusTimeout = setTimeout(() => {
            if (elements.voiceLevelStatus) {
                elements.voiceLevelStatus.textContent = '';
            }
        }, 2000);
    }
}

// ========== NAVIGATION FUNCTIONS ==========

function setupMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            menuToggle.querySelector('i').className = 
                navMenu.classList.contains('active') ? 'fas fa-times' : 'fas fa-bars';
        });
    }
}

function setupThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    let isDarkMode = localStorage.getItem('darkMode') === 'true';
    
    if (themeToggle) {
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
        
        themeToggle.addEventListener('click', () => {
            isDarkMode = !isDarkMode;
            document.body.classList.toggle('dark-mode');
            themeToggle.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
            localStorage.setItem('darkMode', isDarkMode);
        });
    }
}

function showNotification(message, type = 'info') {
    // Only show on pages that can display notifications properly
    if (!document.querySelector('.game-area')) return; // Only on game pages
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i> ${message}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function showWelcomeBack() {
    // Only show on pages that can display notifications properly
    if (!document.querySelector('.game-area')) return; // Only on game pages
    
    const toast = document.createElement('div');
    toast.className = 'welcome-toast';
    toast.innerHTML = `👋 Welcome back, ${gameState.user.name}!`;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ========== EVENT LISTENERS ==========

function setupEventListeners() {
    // User registration
    if (elements.saveUser && elements.userModal) {
        elements.saveUser.addEventListener('click', () => {
            const name = elements.userName?.value.trim();
            if (!name) {
                alert('Please enter your name');
                return;
            }
            
            gameState.user = {
                name: name,
                voice: elements.userVoice?.value || 'male',
                level: elements.userLevel?.value || 'B1',
                registered: true,
                memberSince: new Date().toISOString(),
                gamesPlayed: 0,
                bestScore: 0,
                totalScore: 0,
                totalRoundsPlayed: 0,
                certificates: [],
                gameHistory: []
            };
            
            saveUserToStorage();
            elements.userModal.style.display = 'none';
            updateAccountUI();
            showWelcomeBack();
        });
    }
    
    // Account navigation
    const accountLinks = [
        elements.accountNavLink,
        elements.footerAccountLink
    ];
    
    accountLinks.forEach(link => {
        if (link) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                if (gameState.user.registered) {
                    updateAccountUI();
                    if (elements.accountModal) elements.accountModal.style.display = 'flex';
                } else {
                    if (elements.userModal) elements.userModal.style.display = 'flex';
                }
            });
        }
    });
    
    // Edit name
    if (elements.editNameBtn && elements.accountModal && elements.editNameModal) {
        elements.editNameBtn.addEventListener('click', () => {
            if (elements.newUserName) elements.newUserName.value = gameState.user.name;
            elements.accountModal.style.display = 'none';
            elements.editNameModal.style.display = 'flex';
        });
    }
    
    if (elements.saveNewName && elements.editNameModal) {
        elements.saveNewName.addEventListener('click', () => {
            const newName = elements.newUserName?.value.trim();
            if (newName) {
                gameState.user.name = newName;
                saveUserToStorage();
                updateAccountUI();
                elements.editNameModal.style.display = 'none';
                showNotification('Name updated!', 'success');
            }
        });
    }
    
    if (elements.cancelEditName && elements.editNameModal) {
        elements.cancelEditName.addEventListener('click', () => {
            elements.editNameModal.style.display = 'none';
        });
    }
    
    if (elements.closeAccountBtn && elements.accountModal) {
        elements.closeAccountBtn.addEventListener('click', () => {
            elements.accountModal.style.display = 'none';
        });
    }
    
    // Voice/Level updates
    if (elements.mainVoiceSelect) elements.mainVoiceSelect.addEventListener('change', updateVoiceAndLevel);
    if (elements.mainLevelSelect) elements.mainLevelSelect.addEventListener('change', updateVoiceAndLevel);
    
    // Game controls - only if they exist
    if (elements.startBtn) elements.startBtn.addEventListener('click', startGame);
    if (elements.nextBtn) elements.nextBtn.addEventListener('click', nextRound);
    if (elements.resetBtn) elements.resetBtn.addEventListener('click', resetGame);
    
    // Submit
    if (elements.submitBtn) {
        elements.submitBtn.addEventListener('click', () => {
            const input = elements.playerInput?.value.trim();
            if (input) processPlayerInput(input);
        });
    }
    
    if (elements.playerInput) {
        elements.playerInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && gameState.gameActive && gameState.waitingForPlayerInput) {
                const input = elements.playerInput.value.trim();
                if (input) processPlayerInput(input);
            }
        });
    }
    
    // TTS
    if (elements.speakMessageBtn) {
        elements.speakMessageBtn.addEventListener('click', () => {
            const text = elements.displayText?.textContent;
            if (text && text !== 'The message will appear here' && text !== '🔊 Listen carefully...') {
                speakText(text);
            }
        });
    }
    
    // Tabs
    if (elements.typeTab && elements.voiceTab && elements.typeInput && elements.voiceInput) {
        elements.typeTab.addEventListener('click', () => {
            elements.typeTab.classList.add('active');
            elements.voiceTab.classList.remove('active');
            elements.typeInput.style.display = 'block';
            elements.voiceInput.style.display = 'none';
        });
        
        elements.voiceTab.addEventListener('click', () => {
            elements.voiceTab.classList.add('active');
            elements.typeTab.classList.remove('active');
            elements.typeInput.style.display = 'none';
            elements.voiceInput.style.display = 'block';
        });
    }
    
    // Voice recognition
    if (elements.startListeningBtn && elements.stopListeningBtn) {
        elements.startListeningBtn.addEventListener('click', () => {
            if (gameState.recognition && gameState.gameActive && gameState.waitingForPlayerInput) {
                try { 
                    gameState.recognition.start(); 
                } catch (e) {}
            }
        });
        
        elements.stopListeningBtn.addEventListener('click', () => {
            if (gameState.recognition && gameState.isListening) gameState.recognition.stop();
        });
    }
    
    if (elements.useVoiceBtn) {
        elements.useVoiceBtn.addEventListener('click', () => {
            const spoken = elements.voiceResult?.textContent;
            if (spoken) {
                processPlayerInput(spoken);
                if (elements.voiceMatch) elements.voiceMatch.style.display = 'none';
            }
        });
    }
    
    if (elements.tryAgainBtn) {
        elements.tryAgainBtn.addEventListener('click', () => {
            if (elements.voiceResult) elements.voiceResult.textContent = '';
            if (elements.voiceMatch) elements.voiceMatch.style.display = 'none';
            if (gameState.recognition && gameState.gameActive && gameState.waitingForPlayerInput) {
                try { 
                    gameState.recognition.start(); 
                } catch (e) {}
            }
        });
    }
    
    // Settings
    if (elements.settingsBtn && elements.settingsModal) {
        elements.settingsBtn.addEventListener('click', () => {
            if (elements.playerCountSelect) elements.playerCountSelect.value = gameState.players;
            if (elements.roundCountSelect) elements.roundCountSelect.value = gameState.totalRounds;
            if (elements.timeLimitSelect) elements.timeLimitSelect.value = gameState.memoryTime;
            if (elements.soundToggle) elements.soundToggle.checked = gameState.soundEnabled;
            if (elements.autoReadToggle) elements.autoReadToggle.checked = gameState.autoReadEnabled;
            
            elements.settingsModal.style.display = 'flex';
        });
    }
    
    if (elements.saveSettings && elements.settingsModal) {
        elements.saveSettings.addEventListener('click', saveSettings);
    }
    
    if (elements.closeSettings && elements.settingsModal) {
        elements.closeSettings.addEventListener('click', () => {
            elements.settingsModal.style.display = 'none';
        });
    }
    
    // Game over modal
    if (elements.playAgainBtn && elements.gameOverModal) {
        elements.playAgainBtn.addEventListener('click', () => {
            elements.gameOverModal.style.display = 'none';
            resetGame();
        });
    }
    
    if (elements.mainMenuBtn && elements.gameOverModal) {
        elements.mainMenuBtn.addEventListener('click', () => {
            elements.gameOverModal.style.display = 'none';
        });
    }
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (elements.userModal && e.target === elements.userModal) return;
        if (elements.settingsModal && e.target === elements.settingsModal) {
            elements.settingsModal.style.display = 'none';
        }
        if (elements.gameOverModal && e.target === elements.gameOverModal) {
            elements.gameOverModal.style.display = 'none';
        }
        if (elements.accountModal && e.target === elements.accountModal) {
            elements.accountModal.style.display = 'none';
        }
        if (elements.editNameModal && e.target === elements.editNameModal) {
            elements.editNameModal.style.display = 'none';
        }
        if (elements.categoriesModal && e.target === elements.categoriesModal) {
            elements.categoriesModal.style.display = 'none';
        }
    });
}

// ========== CLOCK FUNCTION - FIXED FOR ALL PAGES ==========
function updateClock() {
    // Only update if clock elements exist on the current page
    if (!elements.navTime && !elements.navDate) return;
    
    const now = new Date();
    
    if (elements.navTime) {
        let h = now.getHours(), m = now.getMinutes(), s = now.getSeconds();
        const ampm = h >= 12 ? 'PM' : 'AM';
        h = h % 12 || 12;
        elements.navTime.textContent = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')} ${ampm}`;
    }
    
    if (elements.navDate) {
        const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
        const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        elements.navDate.textContent = `${days[now.getDay()]} ${months[now.getMonth()]}/${String(now.getDate()).padStart(2,'0')}/${now.getFullYear()}`;
    }
}

// ========== INITIALIZATION ==========

async function initGame() {
    initElements();
    await loadVoices();
    
    setupMobileMenu();
    setupThemeToggle();
    
    const hasUser = loadUserFromStorage();
    
    if (hasUser && gameState.user.registered) {
        if (elements.userModal) elements.userModal.style.display = 'none';
        updateAccountUI();
        checkCertificates();
        
        // Only show welcome back on game pages
        if (document.querySelector('.game-area')) {
            showWelcomeBack();
        }
    } else {
        // Only show user modal on non-about pages and if it's the home page
        if (elements.userModal && !window.location.pathname.includes('about') && 
            !window.location.pathname.includes('gameinfo')) {
            elements.userModal.style.display = 'flex';
        }
    }
    
    loadSettings();
    setupEventListeners();
    
    // Only initialize game-specific UI if elements exist
    if (elements.playerChain) {
        generatePlayerChain();
    }
    
    if (elements.startListeningBtn) {
        initSpeechRecognition();
    }
    
    // Initialize category modal if it exists
    if (elements.categoriesToggleBtn || elements.categoriesModal) {
        initCategoryModal();
    }
    
    // Set initial category display if it exists
    if (elements.currentCategoryDisplay) {
        const categoryNames = {
            easy: 'Easy',
            medium: 'Medium',
            hard: 'Hard',
            funny: 'Funny',
            movies: 'Movies'
        };
        elements.currentCategoryDisplay.textContent = categoryNames[gameState.currentCategory] || 'Easy';
    }
    
    updateButtonStates();
    
    // Start clock (works on all pages now)
    setInterval(updateClock, 1000);
    updateClock();
}

// Start the game when DOM is loaded
document.addEventListener('DOMContentLoaded', initGame);