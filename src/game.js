// ===== ESCAPE THE ZOO - GAME CODE =====
// Made by a 9-year-old game developer! 🐵

// ===== GAME SETTINGS =====
const CELL_TYPES = {
    GRASS: 'grass',
    PATH: 'path', 
    WALL: 'wall',
    CAGE: 'cage',
    EXIT: 'exit'
};

// Emojis for the game
const EMOJI = {
    MONKEY: '🐵',
    LION: '🦁',
    ELEPHANT: '🐘',
    PENGUIN: '🐧',
    BEAR: '🐻',
    GIRAFFE: '🦒',
    ZOOKEEPER: '👨‍🔧',
    KEY: '🔑',
    EMPTY: ''
};

// ===== GAME STATE =====
let currentLevel = 1;
let monkey = { x: 1, y: 1 };
let zookeepers = [];
let animals = [];
let freedAnimals = [];
let currentPuzzle = null;
let currentAnimalIndex = null;
let gameBoard = [];
let gameRunning = false;

// ===== LEVELS =====
const LEVELS = [
    // Level 1 - Easy Start (2 animals, 1 zookeeper)
    {
        name: "Level 1",
        width: 8,
        height: 6,
        monkeyStart: { x: 1, y: 1 },
        animals: [
            { x: 6, y: 1, type: 'LION', freed: false },
            { x: 6, y: 4, type: 'PENGUIN', freed: false }
        ],
        zookeepers: [
            { x: 3, y: 3, dir: 1, minX: 2, maxX: 5, speed: 1000 }
        ],
        // Map: G=grass, P=path, W=wall, C=cage, E=exit
        map: [
            'WWWWWWWW',
            'WPMPPPCW',
            'WPWWWWPW',
            'WPPPPPPW',
            'WPWWWPCW',
            'WWWWWWWW'
        ]
    },
    // Level 2 - Getting Harder (3 animals, 2 zookeepers)
    {
        name: "Level 2",
        width: 10,
        height: 7,
        monkeyStart: { x: 1, y: 1 },
        animals: [
            { x: 8, y: 1, type: 'ELEPHANT', freed: false },
            { x: 8, y: 3, type: 'BEAR', freed: false },
            { x: 8, y: 5, type: 'GIRAFFE', freed: false }
        ],
        zookeepers: [
            { x: 4, y: 2, dir: 1, minX: 2, maxX: 6, speed: 800 },
            { x: 4, y: 4, dir: -1, minX: 2, maxX: 6, speed: 900 }
        ],
        map: [
            'WWWWWWWWWW',
            'WMPPPPPPCW',
            'WPWWWWWWPW',
            'WPPPPPPPCW',
            'WPWWWWWWPW',
            'WMPPPPPPCW',
            'WWWWWWWWWW'
        ]
    }
];

// ===== PUZZLES =====
function generateMathPuzzle(difficulty) {
    let a, b, answer, question;
    
    if (difficulty === 'easy') {
        // Addition 1-10
        a = Math.floor(Math.random() * 10) + 1;
        b = Math.floor(Math.random() * 10) + 1;
        answer = a + b;
        question = `${a} + ${b} = ?`;
    } else if (difficulty === 'medium') {
        // Addition/Subtraction with bigger numbers
        if (Math.random() > 0.5) {
            a = Math.floor(Math.random() * 20) + 10;
            b = Math.floor(Math.random() * 10) + 1;
            answer = a + b;
            question = `${a} + ${b} = ?`;
        } else {
            a = Math.floor(Math.random() * 20) + 10;
            b = Math.floor(Math.random() * 10) + 1;
            answer = a - b;
            question = `${a} - ${b} = ?`;
        }
    } else {
        // Multiplication
        a = Math.floor(Math.random() * 10) + 2;
        b = Math.floor(Math.random() * 10) + 2;
        answer = a * b;
        question = `${a} × ${b} = ?`;
    }
    
    return { question, answer: answer.toString() };
}

function generateEscapePuzzle() {
    // Quick math puzzle to escape
    const a = Math.floor(Math.random() * 5) + 1;
    const b = Math.floor(Math.random() * 5) + 1;
    return {
        question: `Quick! ${a} + ${b} = ?`,
        answer: (a + b).toString()
    };
}

// ===== SCREEN MANAGEMENT =====
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.style.display = 'none');
    document.getElementById(screenId).style.display = 'block';
}

// ===== GAME INITIALIZATION =====
function startGame() {
    currentLevel = 1;
    freedAnimals = [];
    loadLevel(currentLevel);
    showScreen('game-screen');
    gameRunning = true;
    startZookeepers();
}

function loadLevel(levelNum) {
    const level = LEVELS[levelNum - 1];
    if (!level) {
        // Beat all levels!
        showFinalWin();
        return;
    }
    
    // Reset state
    monkey = { ...level.monkeyStart };
    animals = level.animals.map(a => ({ ...a }));
    zookeepers = level.zookeepers.map(z => ({ ...z }));
    
    // Parse map
    gameBoard = [];
    for (let y = 0; y < level.height; y++) {
        gameBoard[y] = [];
        for (let x = 0; x < level.width; x++) {
            const char = level.map[y][x];
            switch(char) {
                case 'W': gameBoard[y][x] = CELL_TYPES.WALL; break;
                case 'P': gameBoard[y][x] = CELL_TYPES.PATH; break;
                case 'G': gameBoard[y][x] = CELL_TYPES.GRASS; break;
                case 'C': gameBoard[y][x] = CELL_TYPES.CAGE; break;
                case 'E': gameBoard[y][x] = CELL_TYPES.EXIT; break;
                case 'M': gameBoard[y][x] = CELL_TYPES.PATH; break; // Monkey start
                default: gameBoard[y][x] = CELL_TYPES.PATH;
            }
        }
    }
    
    // Update display
    document.getElementById('level-display').textContent = level.name;
    updateAnimalsDisplay();
    renderBoard();
    showMessage("Use arrow keys to move! 🐵");
}

function renderBoard() {
    const level = LEVELS[currentLevel - 1];
    const board = document.getElementById('game-board');
    board.innerHTML = '';
    board.style.gridTemplateColumns = `repeat(${level.width}, 50px)`;
    
    for (let y = 0; y < level.height; y++) {
        for (let x = 0; x < level.width; x++) {
            const cell = document.createElement('div');
            cell.className = `cell ${gameBoard[y][x]}`;
            cell.id = `cell-${x}-${y}`;
            
            // Add content to cell
            let content = '';
            
            // Check for animals
            const animal = animals.find(a => a.x === x && a.y === y);
            if (animal) {
                if (animal.freed) {
                    cell.classList.remove('cage');
                    cell.classList.add('cage-open');
                } else {
                    content = EMOJI[animal.type];
                }
            }
            
            // Check for zookeeper
            const keeper = zookeepers.find(z => z.x === x && z.y === y);
            if (keeper) {
                content = EMOJI.ZOOKEEPER;
            }
            
            // Check for monkey
            if (monkey.x === x && monkey.y === y) {
                content = EMOJI.MONKEY;
                cell.classList.add('monkey');
            }
            
            cell.textContent = content;
            board.appendChild(cell);
        }
    }
}

function updateAnimalsDisplay() {
    const freed = animals.filter(a => a.freed).length;
    document.getElementById('animals-display').textContent = `Animals: ${freed}/${animals.length}`;
}

function showMessage(text) {
    document.getElementById('message').textContent = text;
}

// ===== MOVEMENT =====
document.addEventListener('keydown', (e) => {
    if (!gameRunning) return;
    
    let newX = monkey.x;
    let newY = monkey.y;
    
    switch(e.key) {
        case 'ArrowUp': newY--; break;
        case 'ArrowDown': newY++; break;
        case 'ArrowLeft': newX--; break;
        case 'ArrowRight': newX++; break;
        default: return;
    }
    
    e.preventDefault();
    
    // Check if can move there
    if (canMoveTo(newX, newY)) {
        monkey.x = newX;
        monkey.y = newY;
        renderBoard();
        checkCollisions();
    }
});

function canMoveTo(x, y) {
    const level = LEVELS[currentLevel - 1];
    
    // Check bounds
    if (x < 0 || x >= level.width || y < 0 || y >= level.height) {
        return false;
    }
    
    // Check walls
    if (gameBoard[y][x] === CELL_TYPES.WALL) {
        return false;
    }
    
    return true;
}

function checkCollisions() {
    // Check for animal cages
    const animal = animals.find(a => a.x === monkey.x && a.y === monkey.y && !a.freed);
    if (animal) {
        startAnimalPuzzle(animal);
        return;
    }
    
    // Check for zookeepers
    checkZookeeperCollision();
    
    // Check win condition
    if (animals.every(a => a.freed)) {
        winLevel();
    }
}

// ===== ZOOKEEPERS =====
let zookeeperIntervals = [];

function startZookeepers() {
    stopZookeepers();
    
    zookeepers.forEach((keeper, index) => {
        const interval = setInterval(() => {
            if (!gameRunning) return;
            
            // Move zookeeper
            keeper.x += keeper.dir;
            
            // Reverse direction at bounds
            if (keeper.x >= keeper.maxX) keeper.dir = -1;
            if (keeper.x <= keeper.minX) keeper.dir = 1;
            
            renderBoard();
            checkZookeeperCollision();
        }, keeper.speed);
        
        zookeeperIntervals.push(interval);
    });
}

function stopZookeepers() {
    zookeeperIntervals.forEach(i => clearInterval(i));
    zookeeperIntervals = [];
}

function checkZookeeperCollision() {
    const caught = zookeepers.some(k => k.x === monkey.x && k.y === monkey.y);
    if (caught) {
        getCaught();
    }
}

// ===== PUZZLES =====
function startAnimalPuzzle(animal) {
    gameRunning = false;
    stopZookeepers();
    
    currentAnimalIndex = animals.indexOf(animal);
    
    // Generate puzzle based on level
    const difficulty = currentLevel === 1 ? 'easy' : 'medium';
    currentPuzzle = generateMathPuzzle(difficulty);
    
    document.getElementById('puzzle-title').textContent = `🔓 Solve to Free the ${EMOJI[animal.type]}!`;
    document.getElementById('puzzle-content').textContent = currentPuzzle.question;
    document.getElementById('puzzle-answer').value = '';
    document.getElementById('puzzle-message').textContent = '';
    
    showScreen('puzzle-screen');
    document.getElementById('puzzle-answer').focus();
}

function checkPuzzleAnswer() {
    const answer = document.getElementById('puzzle-answer').value.trim();
    
    if (answer === currentPuzzle.answer) {
        // Correct!
        animals[currentAnimalIndex].freed = true;
        freedAnimals.push(EMOJI[animals[currentAnimalIndex].type]);
        updateAnimalsDisplay();
        
        showScreen('game-screen');
        showMessage(`🎉 You freed the ${EMOJI[animals[currentAnimalIndex].type]}!`);
        
        gameRunning = true;
        startZookeepers();
        renderBoard();
        
        // Check win
        if (animals.every(a => a.freed)) {
            setTimeout(winLevel, 500);
        }
    } else {
        // Wrong answer
        document.getElementById('puzzle-message').textContent = "❌ Try again!";
        document.getElementById('puzzle-answer').classList.add('wrong-answer');
        setTimeout(() => {
            document.getElementById('puzzle-answer').classList.remove('wrong-answer');
        }, 300);
    }
}

// ===== GETTING CAUGHT =====
function getCaught() {
    gameRunning = false;
    stopZookeepers();
    
    currentPuzzle = generateEscapePuzzle();
    document.getElementById('escape-puzzle-content').textContent = currentPuzzle.question;
    document.getElementById('escape-answer').value = '';
    document.getElementById('escape-message').textContent = '';
    
    showScreen('caught-screen');
    document.getElementById('escape-answer').focus();
}

function checkEscapeAnswer() {
    const answer = document.getElementById('escape-answer').value.trim();
    
    if (answer === currentPuzzle.answer) {
        // Escaped!
        // Move monkey back to start
        const level = LEVELS[currentLevel - 1];
        monkey = { ...level.monkeyStart };
        
        showScreen('game-screen');
        showMessage("😅 Phew! You escaped! Be more careful!");
        
        gameRunning = true;
        startZookeepers();
        renderBoard();
    } else {
        document.getElementById('escape-message').textContent = "❌ Hurry, try again!";
        document.getElementById('escape-answer').classList.add('wrong-answer');
        setTimeout(() => {
            document.getElementById('escape-answer').classList.remove('wrong-answer');
        }, 300);
    }
}

// ===== WIN CONDITIONS =====
function winLevel() {
    gameRunning = false;
    stopZookeepers();
    
    document.getElementById('freed-animals').textContent = freedAnimals.join(' ');
    showScreen('win-screen');
}

function nextLevel() {
    currentLevel++;
    if (currentLevel > LEVELS.length) {
        showFinalWin();
    } else {
        loadLevel(currentLevel);
        showScreen('game-screen');
        gameRunning = true;
        startZookeepers();
    }
}

function showFinalWin() {
    document.getElementById('win-screen').innerHTML = `
        <h2>🏆 AMAZING! 🏆</h2>
        <p>You freed ALL the animals!</p>
        <div style="font-size: 3em; margin: 20px 0;">${freedAnimals.join(' ')}</div>
        <p>You're a true Zoo Hero!</p>
        <button onclick="location.reload()">🔄 Play Again!</button>
    `;
    showScreen('win-screen');
}

// ===== ALLOW ENTER KEY FOR PUZZLES =====
document.getElementById('puzzle-answer').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkPuzzleAnswer();
});

document.getElementById('escape-answer').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkEscapeAnswer();
});
