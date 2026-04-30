/**
 * Telephone Game Challenge - Main Game Logic
 * Version: 2.1 (Fixed Auto-Save & Sound Toggle)
 * Author: Swe Zin Ei Ei
 * Description: A browser-based telephone game with voice recognition, text-to-speech,
 *              persistent storage, achievements, and real-time similarity scoring.
 */

// ================================================================
// SECTION 1: GAME CONFIGURATION
// ================================================================

const gameConfig = {
    categories: {
        easy: {
            name: "Easy",
            words: [
                "Sunshine", "Rainbow", "Butterfly", "Chocolate", "Pizza",
                "Ocean", "Mountain", "Starlight", "Cupcake", "Dragonfly",
                "Moonlight", "Strawberry", "Elephant", "Giraffe", "Dolphin",
                "Castle", "Pirate", "Unicorn", "Fairy", "Robot",
                "Firefly", "Raindrop", "Snowflake", "Butterfly", "Ladybug"
            ]
        },
        medium: {
            name: "Medium",
            sentences: [
                "The quick brown fox jumps over the lazy dog",
                "She sells seashells by the seashore",
                "Peter Piper picked a peck of pickled peppers",
                "How much wood would a woodchuck chuck",
                "I love eating ice cream on hot summer days",
                "The sun sets beautifully behind the mountains every evening",
                "My grandmother makes the best chocolate chip cookies in the world",
                "The cat chased the mouse all around the old wooden house",
                "Learning a new language opens doors to different cultures",
                "The concert was amazing and the crowd cheered loudly",
                "A journey of a thousand miles begins with a single step",
                "The early bird catches the worm before sunrise",
                "Actions speak louder than words in every situation",
                "The stars twinkled brightly in the dark night sky",
                "Coffee is the best way to start a busy morning"
            ]
        },
        hard: {
            name: "Hard",
            sentences: [
                "The discovery of penicillin revolutionized modern medicine and saved millions of lives",
                "Artificial intelligence is transforming the way we live, work, and communicate with each other",
                "The Great Wall of China is one of the seven wonders of the world and spans thousands of miles",
                "Climate change poses an existential threat to our planet and future generations",
                "The human brain contains approximately eighty six billion neurons connected by synapses",
                "Shakespeare's writings have influenced English literature for over four centuries",
                "The Industrial Revolution marked a major turning point in human history and society",
                "Photosynthesis is the process by which plants convert sunlight into chemical energy",
                "The Roman Empire fell due to a combination of economic, military, and political factors",
                "Democracy originated in ancient Greece and has evolved significantly over time",
                "The internet has fundamentally changed how we access and share information globally",
                "Albert Einstein's theory of relativity revolutionized our understanding of physics",
                "The Amazon rainforest produces twenty percent of the world's oxygen supply",
                "Beethoven continued to compose masterpieces even after losing his hearing",
                "The French Revolution inspired many other movements for equality and freedom"
            ]
        },
        funny: {
            name: "Funny",
            sentences: [
                "My cat tried to catch the laser pointer and ended up doing a backflip off the couch",
                "I accidentally put salt instead of sugar in my coffee and made the worst latte ever",
                "My dog thinks he's a lap dog even though he weighs 80 pounds",
                "I told my computer I needed a break and now it won't stop sending me vacation ads",
                "The penguin walked into the library and asked for a book about fish",
                "My alarm clock is my least favorite invention of all time",
                "I finally got my act together but nobody wants to watch it",
                "The best way to procrastinate is to plan how to stop procrastinating",
                "I'm not lazy, I'm just on energy saving mode",
                "My brain has two modes: asleep and panicking",
                "I tried to be normal once, worst two minutes of my life",
                "Does running late count as exercise? Asking for a friend",
                "I'm not arguing, I'm just explaining why I'm right",
                "The floor is lava and my shoes are not invited",
                "I put my phone in airplane mode but it didn't grow wings"
            ]
        },
        movies: {
            name: "Movie Quotes",
            sentences: [
                "May the Force be with you",
                "Here's looking at you, kid",
                "I'm the king of the world!",
                "To infinity and beyond!",
                "You can't handle the truth!",
                "I'll be back",
                "Life is like a box of chocolates",
                "You talking to me?",
                "There's no place like home",
                "I see dead people",
                "Houston, we have a problem",
                "My precious",
                "Why so serious?",
                "I'm gonna make him an offer he can't refuse",
                "You had me at hello"
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
        { id: 'first_game', name: 'First Steps', icon: '🎮', description: 'Play your first game', color: '#4cc9f0' },
        { id: 'accuracy_80', name: 'Sharp Memory', icon: '🎯', description: 'Achieve 80% accuracy', color: '#90be6d' },
        { id: 'accuracy_90', name: 'Perfect Recall', icon: '🏆', description: 'Achieve 90% accuracy', color: '#f9c74f' },
        { id: 'accuracy_100', name: 'Photographic Memory', icon: '👑', description: 'Achieve 100% accuracy', color: '#f9844a' },
        { id: 'games_5', name: 'Enthusiast', icon: '🌟', description: 'Play 5 games', color: '#4cc9f0' },
        { id: 'games_10', name: 'Veteran', icon: '⚡', description: 'Play 10 games', color: '#7209b7' },
        { id: 'games_25', name: 'Legend', icon: '🔥', description: 'Play 25 games', color: '#f72585' }
    ]
};

const categoryExamples = {
    easy: "🌟 Sunshine, Rainbow, Butterfly, Chocolate, Pizza, Ocean...",
    medium: "📝 The quick brown fox jumps over the lazy dog",
    hard: "🏆 The discovery of penicillin revolutionized modern medicine",
    funny: "😂 My cat tried to catch the laser pointer and did a backflip",
    movies: "🎬 May the Force be with you"
};

// ================================================================
// SECTION 2: GAME STATE
// ================================================================

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
    currentTargetMessage: '',
    chainHistory: [],
    accuracyHistory: [],
    soundEnabled: true,
    autoReadEnabled: true,
    recognition: null,
    isListening: false,
    availableVoices: []
};

const elements = {};

// ================================================================
// SECTION 3: SOUND EFFECTS (WITH ERROR HANDLING)
// ================================================================

/**
 * Plays sound effects using Web Audio API
 * @param {string} type - Type of sound ('correct', 'wrong', 'click', 'success', 'gameOver')
 */
function playSound(type) {
    // Check if sound is enabled - if not, exit immediately
    if (!gameState.soundEnabled) {
        return;
    }
    
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        let frequency = 440;
        let duration = 0.2;
        
        switch(type) {
            case 'correct':
                frequency = 523.25;
                duration = 0.15;
                break;
            case 'wrong':
                frequency = 349.23;
                duration = 0.3;
                break;
            case 'click':
                frequency = 659.25;
                duration = 0.08;
                break;
            case 'success':
                frequency = 659.25;
                duration = 0.1;
                setTimeout(() => {
                    try {
                        const osc2 = audioContext.createOscillator();
                        const gain2 = audioContext.createGain();
                        osc2.connect(gain2);
                        gain2.connect(audioContext.destination);
                        osc2.frequency.value = 783.99;
                        gain2.gain.value = 0.3;
                        osc2.start();
                        osc2.stop(audioContext.currentTime + 0.15);
                    } catch(e) {
                        // Silent fail
                    }
                }, 100);
                break;
            case 'gameOver':
                frequency = 261.63;
                duration = 0.5;
                break;
            default:
                frequency = 440;
        }
        
        oscillator.frequency.value = frequency;
        gainNode.gain.value = 0.2;
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + duration);
        
        setTimeout(() => {
            try {
                audioContext.close();
            } catch(e) {
                // Silent fail
            }
        }, duration * 1000 + 100);
    } catch(e) {
        // Silent fail - sound effects are optional
        console.log('Sound not played:', e);
    }
}

// ================================================================
// SECTION 4: AUTO-SAVE FUNCTIONALITY (FIXED)
// ================================================================

/**
 * Saves current game state to localStorage for recovery
 * Called after each player's turn
 */
function autoSaveGameState() {
    try {
        // Only save if game is active and we have progress
        if (gameState.gameActive && gameState.chainHistory.length > 0) {
            const saveData = {
                timestamp: new Date().toISOString(),
                gameState: {
                    currentRound: gameState.currentRound,
                    currentPlayer: gameState.currentPlayer,
                    score: gameState.score,
                    gameActive: true,
                    roundComplete: gameState.roundComplete,
                    waitingForPlayerInput: gameState.waitingForPlayerInput,
                    originalMessage: gameState.originalMessage,
                    currentTargetMessage: gameState.currentTargetMessage,
                    chainHistory: gameState.chainHistory,
                    accuracyHistory: gameState.accuracyHistory,
                    currentCategory: gameState.currentCategory
                }
            };
            localStorage.setItem('telephoneGameAutoSave', JSON.stringify(saveData));
            console.log("Auto-save completed for round", gameState.currentRound, "player", gameState.currentPlayer);
        }
    } catch(e) {
        console.error('Auto-save failed:', e);
    }
}

/**
 * Loads auto-saved game state if available
 * @returns {boolean} True if save was loaded, false otherwise
 */
function loadAutoSave() {
    try {
        const saved = localStorage.getItem('telephoneGameAutoSave');
        if (saved) {
            const saveData = JSON.parse(saved);
            const saveDate = new Date(saveData.timestamp);
            const today = new Date();
            const isToday = saveDate.toDateString() === today.toDateString();
            
            if (isToday && saveData.gameState.chainHistory.length > 0) {
                if (confirm('You have an unfinished game from earlier. Do you want to continue where you left off?')) {
                    // Restore game state
                    gameState.currentRound = saveData.gameState.currentRound;
                    gameState.currentPlayer = saveData.gameState.currentPlayer;
                    gameState.score = saveData.gameState.score;
                    gameState.gameActive = true;
                    gameState.roundComplete = saveData.gameState.roundComplete;
                    gameState.waitingForPlayerInput = saveData.gameState.waitingForPlayerInput;
                    gameState.originalMessage = saveData.gameState.originalMessage;
                    gameState.currentTargetMessage = saveData.gameState.currentTargetMessage;
                    gameState.chainHistory = saveData.gameState.chainHistory;
                    gameState.accuracyHistory = saveData.gameState.accuracyHistory;
                    gameState.currentCategory = saveData.gameState.currentCategory;
                    
                    // Update UI
                    if (elements.currentRound) elements.currentRound.textContent = `${gameState.currentRound}/${gameState.totalRounds}`;
                    if (elements.score) elements.score.textContent = gameState.score;
                    if (elements.currentTurn) elements.currentTurn.style.display = 'block';
                    if (elements.resultsBox) elements.resultsBox.style.display = 'none';
                    
                    showNotification('🔄 Game restored! Continue playing.', 'success');
                    return true;
                }
            }
        }
    } catch(e) {
        console.error('Failed to load auto-save:', e);
    }
    return false;
}

/**
 * Clears the auto-saved game state
 */
function clearAutoSave() {
    try {
        localStorage.removeItem('telephoneGameAutoSave');
        console.log("Auto-save cleared");
    } catch(e) {
        console.error('Failed to clear auto-save:', e);
    }
}

// ================================================================
// SECTION 5: KEYBOARD SHORTCUTS
// ================================================================

function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            if (gameState.gameActive && gameState.waitingForPlayerInput) {
                const input = elements.playerInput?.value.trim();
                if (input) {
                    processPlayerInput(input);
                    playSound('click');
                } else if (elements.voiceResult?.textContent.trim()) {
                    processPlayerInput(elements.voiceResult.textContent.trim());
                    playSound('click');
                }
            }
        }
        
        if (e.key === ' ' || e.key === 'Space') {
            if (elements.voiceInput && elements.voiceInput.style.display === 'block' && !e.target.matches('input, textarea')) {
                e.preventDefault();
                if (gameState.gameActive && gameState.waitingForPlayerInput && elements.startListeningBtn && !elements.startListeningBtn.disabled) {
                    elements.startListeningBtn.click();
                    playSound('click');
                }
            }
        }
        
        if (e.key === 'n' || e.key === 'N') {
            if (!e.target.matches('input, textarea')) {
                e.preventDefault();
                if (elements.nextBtn && !elements.nextBtn.disabled) {
                    elements.nextBtn.click();
                    playSound('click');
                }
            }
        }
        
        if (e.key === 'r' || e.key === 'R') {
            if (!e.target.matches('input, textarea')) {
                e.preventDefault();
                if (confirm('Restart game?')) {
                    resetGame();
                    playSound('click');
                }
            }
        }
        
        if (e.key === 's' || e.key === 'S') {
            if (!e.target.matches('input, textarea')) {
                e.preventDefault();
                if (elements.startBtn && !elements.startBtn.disabled) {
                    elements.startBtn.click();
                    playSound('click');
                }
            }
        }
        
        if (e.key === 'Escape') {
            const modals = ['userModal', 'settingsModal', 'accountModal', 'gameOverModal', 'editNameModal', 'categoriesModal'];
            modals.forEach(modalId => {
                const modal = document.getElementById(modalId);
                if (modal && modal.style.display === 'flex') {
                    modal.style.display = 'none';
                }
            });
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === '?' && !e.target.matches('input, textarea')) {
            e.preventDefault();
            showShortcutHelp();
        }
    });
}

function showShortcutHelp() {
    const existingHelp = document.querySelector('.shortcut-help-modal');
    if (existingHelp) existingHelp.remove();
    
    const helpDiv = document.createElement('div');
    helpDiv.className = 'shortcut-help-modal';
    helpDiv.innerHTML = `
        <div class="shortcut-help-content">
            <h3><i class="fas fa-keyboard"></i> Keyboard Shortcuts</h3>
            <ul>
                <li><kbd>Ctrl</kbd> + <kbd>Enter</kbd> - Submit answer</li>
                <li><kbd>Space</kbd> - Start speaking (voice tab)</li>
                <li><kbd>N</kbd> - Next Round</li>
                <li><kbd>R</kbd> - Restart game</li>
                <li><kbd>S</kbd> - Start/Pause game</li>
                <li><kbd>Esc</kbd> - Close modals</li>
                <li><kbd>?</kbd> - Show this help</li>
            </ul>
            <button class="close-help-btn">Close</button>
        </div>
    `;
    document.body.appendChild(helpDiv);
    
    helpDiv.querySelector('.close-help-btn').addEventListener('click', () => {
        helpDiv.remove();
    });
    
    helpDiv.addEventListener('click', (e) => {
        if (e.target === helpDiv) helpDiv.remove();
    });
}

// ================================================================
// SECTION 6: DOM ELEMENT INITIALIZATION
// ================================================================

function safeGetElement(id) {
    return document.getElementById(id);
}

function safeQuerySelector(selector) {
    return document.querySelector(selector);
}

function safeQuerySelectorAll(selector) {
    const els = document.querySelectorAll(selector);
    return els.length ? els : null;
}

function initElements() {
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
    elements.mainVoiceSelect = safeGetElement('mainVoiceSelect');
    elements.mainLevelSelect = safeGetElement('mainLevelSelect');
    elements.voiceLevelStatus = safeGetElement('voiceLevelStatus');
    elements.userModal = safeGetElement('userModal');
    elements.userName = safeGetElement('userName');
    elements.userVoice = safeGetElement('userVoice');
    elements.userLevel = safeGetElement('userLevel');
    elements.saveUser = safeGetElement('saveUser');
    elements.accountModal = safeGetElement('accountModal');
    elements.accountName = safeGetElement('accountName');
    elements.memberSince = safeGetElement('memberSince');
    elements.gamesPlayed = safeGetElement('gamesPlayed');
    elements.bestScore = safeGetElement('bestScore');
    elements.avgAccuracy = safeGetElement('avgAccuracy');
    elements.certificatesGrid = safeGetElement('certificatesGrid');
    elements.editNameBtn = safeGetElement('editNameBtn');
    elements.closeAccountBtn = safeGetElement('closeAccountBtn');
    elements.editNameModal = safeGetElement('editNameModal');
    elements.newUserName = safeGetElement('newUserName');
    elements.saveNewName = safeGetElement('saveNewName');
    elements.cancelEditName = safeGetElement('cancelEditName');
    elements.settingsModal = safeGetElement('settingsModal');
    elements.gameOverModal = safeGetElement('gameOverModal');
    elements.playerCountSelect = safeGetElement('playerCountSelect');
    elements.timeLimitSelect = safeGetElement('timeLimitSelect');
    elements.roundCountSelect = safeGetElement('roundCountSelect');
    elements.soundToggle = safeGetElement('soundToggle');
    elements.autoReadToggle = safeGetElement('autoReadToggle');
    elements.saveSettings = safeGetElement('saveSettings');
    elements.closeSettings = safeGetElement('closeSettings');
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
    elements.typeMatchFeedback = safeGetElement('typeMatchFeedback');
    elements.typeMatchResult = safeGetElement('typeMatchResult');
    elements.finalRound = safeGetElement('finalRound');
    elements.finalScore = safeGetElement('finalScore');
    elements.finalAccuracy = safeGetElement('finalAccuracy');
    elements.gameOverTitle = safeGetElement('gameOverTitle');
    elements.gameOverMessage = safeGetElement('gameOverMessage');
    elements.bestPhrase = safeGetElement('bestPhrase');
    elements.playAgainBtn = safeGetElement('playAgainBtn');
    elements.mainMenuBtn = safeGetElement('mainMenuBtn');
    elements.accountNavLink = safeGetElement('accountNavLink');
    elements.footerAccountLink = safeGetElement('footerAccountLink');
    elements.categoriesToggleBtn = safeGetElement('categoriesToggleBtn');
    elements.categoriesModal = safeGetElement('categoriesModal');
    elements.closeCategoriesModal = safeGetElement('closeCategoriesModal');
    elements.categoryCards = safeQuerySelectorAll('.category-card');
    elements.previewMessage = safeGetElement('previewMessage');
    elements.currentCategoryDisplay = safeGetElement('currentCategoryDisplay');
    elements.applyCategoryBtn = safeGetElement('applyCategoryBtn');
    elements.cancelCategoryBtn = safeGetElement('cancelCategoryBtn');
    elements.navTime = safeGetElement('navTime');
    elements.navDate = safeGetElement('navDate');
}

// ================================================================
// SECTION 7: UI RESET FUNCTIONS
// ================================================================

function resetVoiceUI() {
    if (elements.voiceResult) elements.voiceResult.textContent = '';
    if (elements.voiceMatch) elements.voiceMatch.style.display = 'none';
    if (elements.matchResult) {
        elements.matchResult.textContent = '';
        elements.matchResult.className = 'match-result';
    }
    if (elements.voiceStatus) {
        elements.voiceStatus.textContent = 'Click "Start Speaking" and say the message';
        elements.voiceStatus.style.color = '#666';
    }
    if (elements.startListeningBtn) {
        elements.startListeningBtn.disabled = false;
        elements.startListeningBtn.classList.remove('listening');
    }
    if (elements.stopListeningBtn) elements.stopListeningBtn.disabled = true;
}

function resetTypeUI() {
    if (elements.playerInput) {
        elements.playerInput.value = '';
        elements.playerInput.classList.remove('correct-input', 'good-input', 'wrong-input');
    }
    if (elements.typeMatchFeedback) {
        elements.typeMatchFeedback.style.display = 'none';
    }
    if (elements.typeMatchResult) {
        elements.typeMatchResult.textContent = '';
        elements.typeMatchResult.className = '';
    }
}

// ================================================================
// SECTION 8: SIMILARITY CALCULATION (WORD MATCHING ALGORITHM)
// ================================================================

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

function showTypeMatchFeedback(inputText, targetText) {
    if (!elements.typeMatchFeedback || !elements.typeMatchResult) return;
    
    const similarity = calculateSimilarity(inputText, targetText) * 100;
    
    let matchClass = '';
    let matchMessage = '';
    
    if (similarity >= 80) {
        matchClass = 'perfect';
        matchMessage = `🎉 Perfect match! (${similarity.toFixed(0)}% similar)`;
        if (elements.playerInput) elements.playerInput.classList.add('correct-input');
        if (gameState.soundEnabled) playSound('correct');
    } else if (similarity >= 50) {
        matchClass = 'good';
        matchMessage = `👍 Good match! (${similarity.toFixed(0)}% similar)`;
        if (elements.playerInput) elements.playerInput.classList.add('good-input');
    } else {
        matchClass = 'poor';
        matchMessage = `😅 Needs improvement (${similarity.toFixed(0)}% similar)`;
        if (elements.playerInput) elements.playerInput.classList.add('wrong-input');
        if (gameState.soundEnabled) playSound('wrong');
    }
    
    elements.typeMatchResult.textContent = matchMessage;
    elements.typeMatchResult.className = `match-result ${matchClass}`;
    elements.typeMatchFeedback.style.display = 'block';
}

// ================================================================
// SECTION 9: LOCALSTORAGE USER MANAGEMENT
// ================================================================

function saveUserToStorage() {
    try {
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
    } catch(e) {
        console.error('Failed to save user data:', e);
    }
}

function loadUserFromStorage() {
    try {
        const saved = localStorage.getItem('telephoneGameUser');
        if (saved) {
            const userData = JSON.parse(saved);
            gameState.user = { ...gameState.user, ...userData };
            return true;
        }
    } catch(e) {
        console.error('Failed to load user data:', e);
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

// ================================================================
// SECTION 10: CERTIFICATE SYSTEM
// ================================================================

function updateCertificates() {
    if (!elements.certificatesGrid) return;
    
    const certificates = gameConfig.certificates;
    const earned = new Set(gameState.user.certificates || []);
    
    const certColors = {
        'first_game': { main: '#4cc9f0', light: '#72d4f5', dark: '#2a9dcc' },
        'accuracy_80': { main: '#90be6d', light: '#a8d08a', dark: '#6c9e4a' },
        'accuracy_90': { main: '#f9c74f', light: '#fbd672', dark: '#e0a800' },
        'accuracy_100': { main: '#f9844a', light: '#fba36e', dark: '#e05a1a' },
        'games_5': { main: '#4cc9f0', light: '#72d4f5', dark: '#2a9dcc' },
        'games_10': { main: '#7209b7', light: '#9b3dd4', dark: '#570793' },
        'games_25': { main: '#f72585', light: '#f9579d', dark: '#d40d6e' }
    };
    
    let html = '';
    certificates.forEach(cert => {
        const isEarned = earned.has(cert.id);
        const colors = certColors[cert.id] || { main: '#4cc9f0', light: '#72d4f5', dark: '#2a9dcc' };
        
        html += `
            <div class="certificate-card ${isEarned ? 'earned' : 'locked'}" style="--cert-color: ${colors.main}; --cert-color-light: ${colors.light}; --cert-color-dark: ${colors.dark};">
                <div class="certificate-top-bar" style="background: linear-gradient(90deg, ${colors.main}, ${colors.light});"></div>
                <div class="certificate-inner">
                    <div class="certificate-icon-box" style="background: linear-gradient(135deg, ${colors.main}, ${colors.dark});">
                        <span class="certificate-icon-emoji">${cert.icon}</span>
                    </div>
                    <div class="certificate-info-box">
                        <h4>${cert.name}</h4>
                        <p>${cert.description}</p>
                    </div>
                    <div class="certificate-badge-box">
                        ${isEarned ? 
                            '<span class="earned-badge-modern"><i class="fas fa-check-circle"></i> EARNED</span>' : 
                            '<span class="locked-badge-modern"><i class="fas fa-lock"></i> LOCKED</span>'}
                    </div>
                </div>
                <div class="certificate-footer">
                    <div class="certificate-date">
                        <i class="fas ${isEarned ? 'fa-trophy' : 'fa-hourglass-half'}"></i>
                        <span>${isEarned ? 'Achievement Unlocked' : 'Not yet earned'}</span>
                    </div>
                    ${isEarned ? '<i class="fas fa-star" style="color: #f9c74f; font-size: 0.8rem;"></i>' : ''}
                </div>
                <div class="certificate-shine"></div>
            </div>
        `;
    });
    
    elements.certificatesGrid.innerHTML = html;
}

function checkCertificates() {
    const user = gameState.user;
    const earned = new Set(user.certificates || []);
    let newCertEarned = false;
    
    if (user.gamesPlayed >= 1 && !earned.has('first_game')) {
        earned.add('first_game');
        showNotification('🎉 Certificate Earned: First Steps!', 'success');
        playSound('success');
        newCertEarned = true;
    }
    
    if (user.gamesPlayed >= 5 && !earned.has('games_5')) {
        earned.add('games_5');
        showNotification('🌟 Certificate Earned: Enthusiast!', 'success');
        playSound('success');
        newCertEarned = true;
    }
    
    if (user.gamesPlayed >= 10 && !earned.has('games_10')) {
        earned.add('games_10');
        showNotification('⚡ Certificate Earned: Veteran!', 'success');
        playSound('success');
        newCertEarned = true;
    }
    
    if (user.gamesPlayed >= 25 && !earned.has('games_25')) {
        earned.add('games_25');
        showNotification('🔥 Certificate Earned: Legend!', 'success');
        playSound('success');
        newCertEarned = true;
    }
    
    const history = user.gameHistory || [];
    if (history.length > 0) {
        const maxAccuracy = Math.max(...history.map(g => g.accuracy));
        
        if (maxAccuracy >= 80 && !earned.has('accuracy_80')) {
            earned.add('accuracy_80');
            showNotification('🎯 Certificate Earned: Sharp Memory!', 'success');
            playSound('success');
            newCertEarned = true;
        }
        if (maxAccuracy >= 90 && !earned.has('accuracy_90')) {
            earned.add('accuracy_90');
            showNotification('🏆 Certificate Earned: Perfect Recall!', 'success');
            playSound('success');
            newCertEarned = true;
        }
        if (maxAccuracy >= 100 && !earned.has('accuracy_100')) {
            earned.add('accuracy_100');
            showNotification('👑 Certificate Earned: Photographic Memory!', 'success');
            playSound('success');
            newCertEarned = true;
        }
    }
    
    user.certificates = Array.from(earned);
    saveUserToStorage();
    
    if (newCertEarned) {
        updateCertificates();
    }
}

// ================================================================
// SECTION 11: VOICE SYNTHESIS (TTS)
// ================================================================

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
        if (elements.ttsStatus) elements.ttsStatus.textContent = '🔊 Speaking...';
    };
    
    utterance.onend = () => {
        if (elements.ttsStatus) elements.ttsStatus.textContent = '';
    };
    
    window.speechSynthesis.speak(utterance);
}

function speakTextWithCallback(text, callback) {
    if (!('speechSynthesis' in window)) {
        if (callback) callback();
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
        if (elements.ttsStatus) elements.ttsStatus.textContent = '🔊 Speaking...';
    };
    
    utterance.onend = () => {
        if (elements.ttsStatus) elements.ttsStatus.textContent = '';
        if (callback) callback();
    };
    
    utterance.onerror = () => {
        if (callback) callback();
    };
    
    window.speechSynthesis.speak(utterance);
}

// ================================================================
// SECTION 12: SPEECH RECOGNITION (VOICE INPUT)
// ================================================================

function initSpeechRecognition() {
    if (!elements.startListeningBtn) return;
    
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
        
        if (elements.voiceResult && elements.voiceResult.textContent.trim()) {
            checkVoiceMatch();
        }
    };
}

function checkVoiceMatch() {
    if (!elements.voiceResult || !gameState.currentTargetMessage) return;
    
    const spoken = elements.voiceResult.textContent.trim().toLowerCase();
    const target = gameState.currentTargetMessage.toLowerCase();
    
    if (spoken && target) {
        const similarity = calculateSimilarity(spoken, target) * 100;
        
        let matchClass = '';
        let matchMessage = '';
        
        if (similarity >= 80) {
            matchClass = 'perfect';
            matchMessage = `🎉 Perfect match! (${similarity.toFixed(0)}% similar)`;
            if (gameState.soundEnabled) playSound('correct');
        } else if (similarity >= 50) {
            matchClass = 'good';
            matchMessage = `👍 Good match! (${similarity.toFixed(0)}% similar)`;
        } else {
            matchClass = 'poor';
            matchMessage = `😅 Needs improvement (${similarity.toFixed(0)}% similar)`;
            if (gameState.soundEnabled) playSound('wrong');
        }
        
        if (elements.matchResult) {
            elements.matchResult.textContent = matchMessage;
            elements.matchResult.className = `match-result ${matchClass}`;
        }
        if (elements.voiceMatch) elements.voiceMatch.style.display = 'block';
    }
}

// ================================================================
// SECTION 13: GAME VISUALIZATION
// ================================================================

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

// ================================================================
// SECTION 14: GAME CORE LOGIC
// ================================================================

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
        if (elements.userModal) elements.userModal.style.display = 'flex';
        return;
    }
    
    if (gameState.gameActive) {
        clearInterval(gameState.timer);
        gameState.gameActive = false;
        gameState.waitingForPlayerInput = false;
        updateButtonStates();
        playSound('click');
        return;
    }
    
    if (gameState.currentRound === 1 && !gameState.gameActive && !gameState.roundComplete) {
        gameState.score = 0;
        gameState.currentPlayer = 1;
        if (elements.score) elements.score.textContent = '0';
        generateMessage();
        if (elements.resultsBox) elements.resultsBox.style.display = 'none';
        if (elements.currentTurn) elements.currentTurn.style.display = 'block';
        gameState.roundComplete = false;
        clearAutoSave();
    }
    
    gameState.gameActive = true;
    gameState.waitingForPlayerInput = true;
    elements.nextBtn.disabled = true;
    updateButtonStates();
    
    resetVoiceUI();
    resetTypeUI();
    playSound('click');
    
    startPlayerTurn();
}

function startPlayerTurn() {
    if (!gameState.gameActive || !gameState.waitingForPlayerInput) return;
    if (!elements.currentPlayer || !elements.instruction || !elements.displayText) return;
    
    gameState.timeLeft = gameState.memoryTime;
    elements.currentPlayer.textContent = `Player ${gameState.currentPlayer}`;
    updatePlayerChain();
    
    resetVoiceUI();
    resetTypeUI();
    
    if (elements.playerInput) elements.playerInput.value = '';
    
    let messageToShow = '';
    if (gameState.currentPlayer === 1) {
        messageToShow = gameState.originalMessage;
        elements.instruction.textContent = `${gameState.user.name}, remember this carefully!`;
    } else {
        const prevMessage = gameState.chainHistory[gameState.currentPlayer - 1]?.message || gameState.originalMessage;
        messageToShow = prevMessage;
        elements.instruction.textContent = `Player ${gameState.currentPlayer - 1} said:`;
    }
    
    gameState.currentTargetMessage = messageToShow;
    
    if (gameState.currentPlayer === 1) {
        if (elements.displayText) {
            elements.displayText.textContent = messageToShow;
            elements.displayText.style.opacity = '1';
            elements.displayText.style.display = 'flex';
        }
        
        setTimeout(() => {
            if (elements.displayText && gameState.currentPlayer === 1) {
                elements.displayText.textContent = '🔊 Message hidden... Listen carefully!';
                elements.displayText.style.opacity = '0.3';
            }
        }, gameState.memoryTime * 1000);
        
        if (gameState.autoReadEnabled) {
            gameState.waitingForPlayerInput = false;
            if (elements.startListeningBtn) elements.startListeningBtn.disabled = true;
            if (elements.submitBtn) elements.submitBtn.disabled = true;
            if (elements.playerInput) elements.playerInput.disabled = true;
            
            if (elements.voiceStatus) {
                elements.voiceStatus.textContent = '🔊 Message playing... Wait before speaking';
                elements.voiceStatus.style.color = '#f8961e';
            }
            
            speakTextWithCallback(messageToShow, () => {
                gameState.waitingForPlayerInput = true;
                if (elements.startListeningBtn) elements.startListeningBtn.disabled = false;
                if (elements.submitBtn) elements.submitBtn.disabled = false;
                if (elements.playerInput) elements.playerInput.disabled = false;
                
                if (elements.voiceStatus) {
                    elements.voiceStatus.textContent = 'Click "Start Speaking" and say the message';
                    elements.voiceStatus.style.color = '#666';
                }
                
                if (gameState.timer) clearInterval(gameState.timer);
                startTimer();
                
                // Auto-save after turn starts
                autoSaveGameState();
            });
        } else {
            gameState.waitingForPlayerInput = true;
            if (elements.startListeningBtn) elements.startListeningBtn.disabled = false;
            if (elements.submitBtn) elements.submitBtn.disabled = false;
            if (elements.playerInput) elements.playerInput.disabled = false;
            
            if (gameState.timer) clearInterval(gameState.timer);
            startTimer();
            autoSaveGameState();
        }
    } else {
        if (elements.displayText) {
            elements.displayText.textContent = '🔊 Listen carefully to the voice...';
            elements.displayText.style.opacity = '0.3';
            elements.displayText.style.display = 'flex';
        }
        
        gameState.waitingForPlayerInput = false;
        if (elements.startListeningBtn) elements.startListeningBtn.disabled = true;
        if (elements.submitBtn) elements.submitBtn.disabled = true;
        if (elements.playerInput) elements.playerInput.disabled = true;
        
        if (elements.voiceStatus) {
            elements.voiceStatus.textContent = '🔊 Message playing... Wait before speaking';
            elements.voiceStatus.style.color = '#f8961e';
        }
        
        speakTextWithCallback(messageToShow, () => {
            gameState.waitingForPlayerInput = true;
            if (elements.startListeningBtn) elements.startListeningBtn.disabled = false;
            if (elements.submitBtn) elements.submitBtn.disabled = false;
            if (elements.playerInput) elements.playerInput.disabled = false;
            
            if (elements.voiceStatus) {
                elements.voiceStatus.textContent = 'Click "Start Speaking" and say the message';
                elements.voiceStatus.style.color = '#666';
            }
            
            if (gameState.timer) clearInterval(gameState.timer);
            startTimer();
            autoSaveGameState();
        });
    }
}

function startTimer() {
    if (!elements.timer || !elements.messageTimeLeft || !elements.messageTimer) return;
    
    const startTime = Date.now();
    const totalTime = gameState.memoryTime * 1000;
    
    if (gameState.timer) clearInterval(gameState.timer);
    
    gameState.timer = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, totalTime - elapsed);
        
        gameState.timeLeft = Math.ceil(remaining / 1000);
        if (elements.timer) elements.timer.textContent = `${gameState.timeLeft}s`;
        if (elements.messageTimeLeft) elements.messageTimeLeft.textContent = `${gameState.timeLeft}s`;
        
        const percentage = (remaining / totalTime) * 100;
        if (elements.messageTimer) elements.messageTimer.style.width = `${percentage}%`;
        
        if (elements.messageTimer) {
            if (gameState.timeLeft <= 3) {
                elements.messageTimer.style.background = 'linear-gradient(to right, #ef476f, #f72585)';
            } else if (gameState.timeLeft <= 7) {
                elements.messageTimer.style.background = 'linear-gradient(to right, #f8961e, #f9c74f)';
            } else {
                elements.messageTimer.style.background = 'linear-gradient(to right, #4cc9f0, #2ec4b6)';
            }
        }
        
        if (remaining <= 0) {
            clearInterval(gameState.timer);
            if (elements.instruction) {
                elements.instruction.textContent = 'Time is up! Please type or speak what you remember...';
            }
            if (gameState.soundEnabled) playSound('wrong');
        }
    }, 100);
}

function processPlayerInput(input) {
    if (!gameState.gameActive || !gameState.waitingForPlayerInput) return;
    
    const trimmedInput = input.trim();
    if (!trimmedInput) return;
    
    if (elements.typeMatchFeedback && gameState.currentTargetMessage) {
        showTypeMatchFeedback(trimmedInput, gameState.currentTargetMessage);
    }
    
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
        
        if (gameState.soundEnabled) {
            if (accuracy >= 0.8) playSound('correct');
            else if (accuracy < 0.5) playSound('wrong');
        }
    }
    
    // Save progress after each player's turn
    autoSaveGameState();
    
    if (gameState.currentPlayer < gameState.players) {
        gameState.currentPlayer++;
        startPlayerTurn();
    } else {
        gameState.waitingForPlayerInput = false;
        endRound();
    }
    
    if (elements.playerInput) elements.playerInput.value = '';
    resetVoiceUI();
}

// ================================================================
// SECTION 15: ROUND AND GAME MANAGEMENT
// ================================================================

function endRound() {
    clearInterval(gameState.timer);
    gameState.gameActive = false;
    gameState.roundComplete = true;
    gameState.waitingForPlayerInput = false;
    
    showResults();
    addToHistory();
    
    resetVoiceUI();
    resetTypeUI();
    
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
    
    // Clear auto-save only when round completes (not final game)
    // Auto-save will be cleared completely when game ends
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
        if (gameState.soundEnabled) playSound('success');
    } else if (accuracy >= 50) {
        message = '👍 Good job! Some words survived!';
        messageClass = 'good';
    } else {
        message = '😂 Completely transformed!';
        messageClass = 'poor';
        if (gameState.soundEnabled) playSound('gameOver');
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
    
    if (elements.currentRound) elements.currentRound.textContent = `${gameState.currentRound}/${gameState.totalRounds}`;
    if (elements.resultsBox) elements.resultsBox.style.display = 'none';
    if (elements.currentTurn) elements.currentTurn.style.display = 'block';
    
    if (elements.startBtn) {
        elements.startBtn.style.display = 'inline-flex';
        elements.startBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
    }
    if (elements.nextBtn) elements.nextBtn.disabled = true;
    
    resetVoiceUI();
    resetTypeUI();
    playSound('click');
    
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
    
    const gameRecord = {
        date: new Date().toISOString(),
        rounds: gameState.currentRound,
        score: gameState.score,
        accuracy: avgAccuracy,
        category: gameState.currentCategory
    };
    
    if (!gameState.user.gameHistory) gameState.user.gameHistory = [];
    gameState.user.gameHistory.push(gameRecord);
    
    gameState.user.gamesPlayed++;
    gameState.user.totalScore += gameState.score;
    gameState.user.totalRoundsPlayed += gameState.currentRound;
    
    if (gameState.score > gameState.user.bestScore) {
        gameState.user.bestScore = gameState.score;
    }
    
    checkCertificates();
    saveUserToStorage();
    updateAccountUI();
    
    // Clear auto-save when game ends
    clearAutoSave();
    
    elements.gameOverModal.style.display = 'flex';
    
    if (elements.startBtn) {
        elements.startBtn.style.display = 'inline-flex';
        elements.startBtn.innerHTML = '<i class="fas fa-play"></i> Start Game';
    }
    if (elements.nextBtn) elements.nextBtn.disabled = true;
    
    resetVoiceUI();
    resetTypeUI();
    
    if (gameState.soundEnabled) playSound('gameOver');
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
    gameState.currentTargetMessage = '';
    
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
    
    resetVoiceUI();
    resetTypeUI();
    clearAutoSave();
    playSound('click');
    
    if (elements.historyList) {
        elements.historyList.innerHTML = '<div class="empty-history">No games played yet. Start playing!</div>';
    }
}

// ================================================================
// SECTION 16: SETTINGS MANAGEMENT (FIXED SOUND TOGGLE)
// ================================================================

function loadSettings() {
    try {
        const saved = localStorage.getItem('telephoneGameSettings');
        if (saved) {
            const settings = JSON.parse(saved);
            gameState.players = settings.players || 5;
            gameState.totalRounds = settings.rounds || 5;
            gameState.memoryTime = settings.timeLimit || 10;
            gameState.soundEnabled = settings.soundEnabled === true || settings.soundEnabled !== false;
            gameState.autoReadEnabled = settings.autoReadEnabled === true || settings.autoReadEnabled !== false;
            
            if (elements.playerCountSelect) elements.playerCountSelect.value = gameState.players;
            if (elements.roundCountSelect) elements.roundCountSelect.value = gameState.totalRounds;
            if (elements.timeLimitSelect) elements.timeLimitSelect.value = gameState.memoryTime;
            if (elements.soundToggle) elements.soundToggle.checked = gameState.soundEnabled;
            if (elements.autoReadToggle) elements.autoReadToggle.checked = gameState.autoReadEnabled;
            if (elements.playerCount) elements.playerCount.textContent = gameState.players;
            if (elements.currentRound) elements.currentRound.textContent = `${gameState.currentRound}/${gameState.totalRounds}`;
        }
    } catch(e) {
        console.error('Failed to load settings:', e);
    }
}

function saveSettings() {
    try {
        const settings = {
            players: parseInt(elements.playerCountSelect?.value || 5),
            rounds: parseInt(elements.roundCountSelect?.value || 5),
            timeLimit: parseInt(elements.timeLimitSelect?.value || 10),
            soundEnabled: elements.soundToggle?.checked === true,
            autoReadEnabled: elements.autoReadToggle?.checked === true
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
        playSound('click');
    } catch(e) {
        console.error('Failed to save settings:', e);
        showNotification('Failed to save settings', 'error');
    }
}

// ================================================================
// SECTION 17: CATEGORY MANAGEMENT
// ================================================================

function initCategoryModal() {
    if (elements.categoriesToggleBtn && elements.categoriesModal) {
        elements.categoriesToggleBtn.addEventListener('click', () => {
            openCategoryModal();
            playSound('click');
        });
    }
    
    if (elements.closeCategoriesModal && elements.categoriesModal) {
        elements.closeCategoriesModal.addEventListener('click', () => {
            closeCategoryModal();
        });
    }
    
    if (elements.cancelCategoryBtn && elements.categoriesModal) {
        elements.cancelCategoryBtn.addEventListener('click', () => {
            closeCategoryModal();
        });
    }
    
    if (elements.categoryCards) {
        elements.categoryCards.forEach(card => {
            card.addEventListener('click', () => {
                elements.categoryCards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                const category = card.dataset.category;
                updateCategoryPreview(category);
                playSound('click');
            });
        });
    }
    
    if (elements.applyCategoryBtn && elements.categoriesModal) {
        elements.applyCategoryBtn.addEventListener('click', () => {
            const activeCard = document.querySelector('.category-card.active');
            if (activeCard) {
                const category = activeCard.dataset.category;
                applyCategory(category);
            }
            closeCategoryModal();
            playSound('success');
        });
    }
    
    window.addEventListener('click', (e) => {
        if (elements.categoriesModal && e.target === elements.categoriesModal) {
            closeCategoryModal();
        }
    });
}

function openCategoryModal() {
    if (!elements.categoriesModal || !elements.categoryCards) return;
    
    elements.categoryCards.forEach(card => {
        if (card.dataset.category === gameState.currentCategory) {
            card.classList.add('active');
        } else {
            card.classList.remove('active');
        }
    });
    
    updateCategoryPreview(gameState.currentCategory);
    elements.categoriesModal.style.display = 'flex';
}

function closeCategoryModal() {
    if (elements.categoriesModal) {
        elements.categoriesModal.style.display = 'none';
    }
}

function updateCategoryPreview(category) {
    if (elements.previewMessage) {
        elements.previewMessage.textContent = categoryExamples[category] || 'Select a category to see example';
    }
}

function applyCategory(category) {
    if (category && gameState.currentCategory !== category) {
        gameState.currentCategory = category;
        
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
        
        showNotification(`Category changed to ${categoryNames[category]}`, 'success');
        
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

// ================================================================
// SECTION 18: UI AND NOTIFICATION HELPERS
// ================================================================

function updateVoiceAndLevel() {
    if (elements.mainVoiceSelect) {
        gameState.user.voice = elements.mainVoiceSelect.value;
    }
    if (elements.mainLevelSelect) {
        gameState.user.level = elements.mainLevelSelect.value;
    }
    
    saveUserToStorage();
    
    if (elements.voiceLevelStatus) {
        if (window.statusTimeout) {
            clearTimeout(window.statusTimeout);
        }
        
        elements.voiceLevelStatus.textContent = '✓ Settings saved';
        
        window.statusTimeout = setTimeout(() => {
            if (elements.voiceLevelStatus) {
                elements.voiceLevelStatus.textContent = '';
            }
        }, 2000);
    }
    playSound('click');
}

function setupMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (icon) {
                icon.className = navMenu.classList.contains('active') ? 'fas fa-times' : 'fas fa-bars';
            }
            playSound('click');
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
            playSound('click');
        });
    }
}

function showNotification(message, type = 'info') {
    if (!document.querySelector('.game-area')) return;
    
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
    if (!document.querySelector('.game-area')) return;
    
    const toast = document.createElement('div');
    toast.className = 'welcome-toast';
    toast.innerHTML = `👋 Welcome back, ${gameState.user.name}!`;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}


// ================================================================
// SECTION 19: EVENT LISTENERS
// ================================================================

function setupEventListeners() {
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
            resetVoiceUI();
            resetTypeUI();
            playSound('success');
        });
    }
    
    const accountLinks = [elements.accountNavLink, elements.footerAccountLink];
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
                playSound('click');
            });
        }
    });
    
    if (elements.editNameBtn && elements.accountModal && elements.editNameModal) {
        elements.editNameBtn.addEventListener('click', () => {
            if (elements.newUserName) elements.newUserName.value = gameState.user.name;
            elements.accountModal.style.display = 'none';
            elements.editNameModal.style.display = 'flex';
            playSound('click');
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
                playSound('success');
            }
        });
    }
    
    if (elements.cancelEditName && elements.editNameModal) {
        elements.cancelEditName.addEventListener('click', () => {
            elements.editNameModal.style.display = 'none';
            playSound('click');
        });
    }
    
    if (elements.closeAccountBtn && elements.accountModal) {
        elements.closeAccountBtn.addEventListener('click', () => {
            elements.accountModal.style.display = 'none';
            playSound('click');
        });
    }
    
    if (elements.mainVoiceSelect) elements.mainVoiceSelect.addEventListener('change', updateVoiceAndLevel);
    if (elements.mainLevelSelect) elements.mainLevelSelect.addEventListener('change', updateVoiceAndLevel);
    
    if (elements.startBtn) elements.startBtn.addEventListener('click', startGame);
    if (elements.nextBtn) elements.nextBtn.addEventListener('click', nextRound);
    if (elements.resetBtn) elements.resetBtn.addEventListener('click', resetGame);
    
    if (elements.submitBtn) {
        elements.submitBtn.addEventListener('click', () => {
            const input = elements.playerInput?.value.trim();
            if (input) {
                processPlayerInput(input);
                playSound('click');
            }
        });
    }
    
    if (elements.playerInput) {
        elements.playerInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && gameState.gameActive && gameState.waitingForPlayerInput) {
                const input = elements.playerInput.value.trim();
                if (input) {
                    processPlayerInput(input);
                    playSound('click');
                }
            }
        });
        
        elements.playerInput.addEventListener('input', () => {
            if (gameState.gameActive && gameState.waitingForPlayerInput && gameState.currentTargetMessage) {
                const currentInput = elements.playerInput.value.trim();
                if (currentInput.length > 0) {
                    showTypeMatchFeedback(currentInput, gameState.currentTargetMessage);
                } else if (elements.typeMatchFeedback) {
                    elements.typeMatchFeedback.style.display = 'none';
                }
            }
        });
    }
    
    if (elements.typeTab && elements.voiceTab && elements.typeInput && elements.voiceInput) {
        elements.typeTab.addEventListener('click', () => {
            elements.typeTab.classList.add('active');
            elements.voiceTab.classList.remove('active');
            elements.typeInput.style.display = 'block';
            elements.voiceInput.style.display = 'none';
            resetVoiceUI();
            playSound('click');
        });
        
        elements.voiceTab.addEventListener('click', () => {
            elements.voiceTab.classList.add('active');
            elements.typeTab.classList.remove('active');
            elements.typeInput.style.display = 'none';
            elements.voiceInput.style.display = 'block';
            resetTypeUI();
            playSound('click');
        });
    }
    
    if (elements.startListeningBtn && elements.stopListeningBtn) {
        elements.startListeningBtn.addEventListener('click', () => {
            if (gameState.recognition && gameState.gameActive && gameState.waitingForPlayerInput) {
                try { 
                    gameState.recognition.start();
                    playSound('click');
                } catch (e) {}
            }
        });
        
        elements.stopListeningBtn.addEventListener('click', () => {
            if (gameState.recognition && gameState.isListening) {
                gameState.recognition.stop();
                playSound('click');
            }
        });
    }
    
    if (elements.useVoiceBtn) {
        elements.useVoiceBtn.addEventListener('click', () => {
            const spoken = elements.voiceResult?.textContent;
            if (spoken) {
                processPlayerInput(spoken);
                playSound('click');
            }
        });
    }
    
    if (elements.tryAgainBtn) {
        elements.tryAgainBtn.addEventListener('click', () => {
            resetVoiceUI();
            if (gameState.recognition && gameState.gameActive && gameState.waitingForPlayerInput) {
                try { 
                    gameState.recognition.start();
                    playSound('click');
                } catch (e) {}
            }
        });
    }
    
    if (elements.settingsBtn && elements.settingsModal) {
        elements.settingsBtn.addEventListener('click', () => {
            if (elements.playerCountSelect) elements.playerCountSelect.value = gameState.players;
            if (elements.roundCountSelect) elements.roundCountSelect.value = gameState.totalRounds;
            if (elements.timeLimitSelect) elements.timeLimitSelect.value = gameState.memoryTime;
            if (elements.soundToggle) elements.soundToggle.checked = gameState.soundEnabled;
            if (elements.autoReadToggle) elements.autoReadToggle.checked = gameState.autoReadEnabled;
            
            elements.settingsModal.style.display = 'flex';
            playSound('click');
        });
    }
    
    if (elements.saveSettings && elements.settingsModal) {
        elements.saveSettings.addEventListener('click', saveSettings);
    }
    
    if (elements.closeSettings && elements.settingsModal) {
        elements.closeSettings.addEventListener('click', () => {
            elements.settingsModal.style.display = 'none';
            playSound('click');
        });
    }
    
    if (elements.playAgainBtn && elements.gameOverModal) {
        elements.playAgainBtn.addEventListener('click', () => {
            elements.gameOverModal.style.display = 'none';
            resetGame();
            playSound('click');
        });
    }
    
    if (elements.mainMenuBtn && elements.gameOverModal) {
        elements.mainMenuBtn.addEventListener('click', () => {
            elements.gameOverModal.style.display = 'none';
            playSound('click');
        });
    }
    
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

// ================================================================
// SECTION 20: CLOCK AND INITIALIZATION
// ================================================================

function updateClock() {
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

async function initGame() {
    initElements();
    await loadVoices();
    
    setupMobileMenu();
    setupThemeToggle();
    setupKeyboardShortcuts();
    
    const hasUser = loadUserFromStorage();
    
    if (hasUser && gameState.user.registered) {
        if (elements.userModal) elements.userModal.style.display = 'none';
        updateAccountUI();
        checkCertificates();
        
        // Try to load auto-saved game
        loadAutoSave();
        
        if (document.querySelector('.game-area')) {
            showWelcomeBack();
        }
    } else {
        if (elements.userModal && !window.location.pathname.includes('about') && 
            !window.location.pathname.includes('gameinfo')) {
            elements.userModal.style.display = 'flex';
        }
    }
    
    loadSettings();
    setupEventListeners();
    
    if (elements.playerChain) generatePlayerChain();
    if (elements.startListeningBtn) initSpeechRecognition();
    if (elements.categoriesToggleBtn || elements.categoriesModal) initCategoryModal();
    
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
    resetVoiceUI();
    resetTypeUI();
    
    setInterval(updateClock, 1000);
    updateClock();
    
    setTimeout(() => {
        if (!localStorage.getItem('shortcutsShown')) {
            showShortcutHelp();
            localStorage.setItem('shortcutsShown', 'true');
        }
    }, 1000);
}

document.addEventListener('DOMContentLoaded', initGame);