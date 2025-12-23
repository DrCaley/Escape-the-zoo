// ===== ESCAPE THE ZOO - PUZZLE GAME =====
// Made by a 9-year-old game developer! 🐵

// ===== EMOJIS =====
const EMOJI = {
    MONKEY: '🐵',
    LION: '🦁',
    ELEPHANT: '🐘',
    PENGUIN: '🐧',
    BEAR: '🐻',
    GIRAFFE: '🦒',
    PARROT: '🦜',
    TIGER: '🐯',
    ZOOKEEPER: '👨‍🔧',
    KEY: '🔑',
    BOX: '📦',
    SWITCH_OFF: '🔴',
    SWITCH_ON: '🟢',
    GATE_CLOSED: '🚧',
    GATE_OPEN: '✨',
    WATER: '🌊'
};

// ===== GAME STATE =====
let currentLevel = 0;
let player = { x: 0, y: 0 };
let keysCollected = 0;
let boxes = [];
let switches = [];
let gates = [];
let waterTiles = [];
let animals = [];
let zookeepers = [];
let freedAnimals = [];
let levelMap = [];
let gameRunning = false;
let levelKeys = [];

// ===== LEVELS - Real Puzzle Design! =====
const LEVELS = [
    // LEVEL 1: Learn to push boxes and collect keys
    {
        name: "Level 1: Push & Collect",
        width: 10,
        height: 8,
        hint: "Push the 📦 box to the side, grab the 🔑, free the 🦁!",
        playerStart: { x: 1, y: 6 },
        // W=Wall, .=Floor, C=Cage with animal, K=Key, B=Box, S=Switch, G=Gate, ~=Water
        map: [
            "WWWWWWWWWW",
            "W........W",
            "W........W",
            "W..K.....W",
            "W..B...C.W",
            "W........W",
            "W........W",
            "WWWWWWWWWW"
        ],
        animals: [
            { x: 7, y: 4, type: 'LION', freed: false }
        ],
        zookeepers: [
            { x: 5, y: 2, patrolAxis: 'x', min: 3, max: 7, dir: 1, speed: 1200 }
        ],
        boxes: [{ x: 3, y: 4 }],
        keys: [{ x: 3, y: 3, collected: false }],
        switches: [],
        gates: [],
        water: []
    },
    
    // LEVEL 2: Switches and Gates
    {
        name: "Level 2: Switches & Gates",
        width: 10,
        height: 8,
        hint: "Push a 📦 onto the 🔴 switch to open the 🚧 gate!",
        playerStart: { x: 1, y: 6 },
        map: [
            "WWWWWWWWWW",
            "W......C.W",
            "W...WGWWWW",
            "W...W....W",
            "W.B.S....W",
            "W...W..K.W",
            "W...W....W",
            "WWWWWWWWWW"
        ],
        animals: [
            { x: 7, y: 1, type: 'PENGUIN', freed: false }
        ],
        zookeepers: [
            { x: 6, y: 4, patrolAxis: 'y', min: 3, max: 6, dir: 1, speed: 1000 }
        ],
        boxes: [{ x: 2, y: 4 }],
        keys: [{ x: 7, y: 5, collected: false }],
        switches: [{ x: 4, y: 4, pressed: false, gateId: 0 }],
        gates: [{ x: 5, y: 2, open: false, id: 0 }],
        water: []
    },
    
    // LEVEL 3: Water crossing - build a bridge!
    {
        name: "Level 3: Bridge Builder",
        width: 12,
        height: 9,
        hint: "Push 📦 boxes into 🌊 water to make a bridge!",
        playerStart: { x: 1, y: 4 },
        map: [
            "WWWWWWWWWWWW",
            "W........C.W",
            "W.K..WWWWWWW",
            "W.B..~~....W",
            "W.B..~~..K.W",
            "W....~~..C.W",
            "W....WWWWWWW",
            "W..........W",
            "WWWWWWWWWWWW"
        ],
        animals: [
            { x: 9, y: 1, type: 'ELEPHANT', freed: false },
            { x: 9, y: 5, type: 'BEAR', freed: false }
        ],
        zookeepers: [
            { x: 3, y: 7, patrolAxis: 'x', min: 1, max: 6, dir: 1, speed: 900 }
        ],
        boxes: [{ x: 2, y: 3 }, { x: 2, y: 4 }],
        keys: [{ x: 2, y: 2, collected: false }, { x: 9, y: 4, collected: false }],
        switches: [],
        gates: [],
        water: [
            { x: 5, y: 3, filled: false }, { x: 6, y: 3, filled: false },
            { x: 5, y: 4, filled: false }, { x: 6, y: 4, filled: false },
            { x: 5, y: 5, filled: false }, { x: 6, y: 5, filled: false }
        ]
    },
    
    // LEVEL 4: All mechanics combined!
    {
        name: "Level 4: The Great Escape",
        width: 14,
        height: 10,
        hint: "Use boxes, switches, bridges - free all the animals! 🎯",
        playerStart: { x: 1, y: 8 },
        map: [
            "WWWWWWWWWWWWWW",
            "W.....G....C.W",
            "W.S...WWWWWWWW",
            "W.....W......W",
            "WWWWWWW..B...W",
            "W.K..~~..B.C.W",
            "W....~~......W",
            "W....~~WWWWWWW",
            "W..B.......K.W",
            "WWWWWWWWWWWWWW"
        ],
        animals: [
            { x: 11, y: 1, type: 'GIRAFFE', freed: false },
            { x: 11, y: 5, type: 'PARROT', freed: false }
        ],
        zookeepers: [
            { x: 3, y: 3, patrolAxis: 'x', min: 1, max: 5, dir: 1, speed: 850 },
            { x: 10, y: 4, patrolAxis: 'y', min: 3, max: 6, dir: 1, speed: 950 }
        ],
        boxes: [{ x: 3, y: 8 }, { x: 9, y: 4 }, { x: 11, y: 4 }],
        keys: [{ x: 2, y: 5, collected: false }, { x: 12, y: 8, collected: false }],
        switches: [{ x: 2, y: 2, pressed: false, gateId: 0 }],
        gates: [{ x: 6, y: 1, open: false, id: 0 }],
        water: [
            { x: 5, y: 5, filled: false }, { x: 6, y: 5, filled: false },
            { x: 5, y: 6, filled: false }, { x: 6, y: 6, filled: false },
            { x: 5, y: 7, filled: false }, { x: 6, y: 7, filled: false }
        ]
    },
    
    // LEVEL 5: Bonus Challenge!
    {
        name: "Level 5: Zoo Master",
        width: 14,
        height: 11,
        hint: "The ultimate puzzle! Plan your moves carefully! 🧠",
        playerStart: { x: 1, y: 9 },
        map: [
            "WWWWWWWWWWWWWW",
            "W.K........C.W",
            "W..WWWWGWWWWWW",
            "W..W...S...K.W",
            "W..W.B.......W",
            "W..WWWWWWW~~CW",
            "W........W~~.W",
            "W.B......W...W",
            "WWWWWGWWWW...W",
            "W.S......B.C.W",
            "WWWWWWWWWWWWWW"
        ],
        animals: [
            { x: 11, y: 1, type: 'TIGER', freed: false },
            { x: 11, y: 5, type: 'PENGUIN', freed: false },
            { x: 11, y: 9, type: 'LION', freed: false }
        ],
        zookeepers: [
            { x: 5, y: 1, patrolAxis: 'x', min: 2, max: 8, dir: 1, speed: 700 },
            { x: 5, y: 7, patrolAxis: 'x', min: 1, max: 7, dir: -1, speed: 800 }
        ],
        boxes: [{ x: 5, y: 4 }, { x: 2, y: 7 }, { x: 11, y: 9 }],
        keys: [{ x: 2, y: 1, collected: false }, { x: 12, y: 3, collected: false }],
        switches: [
            { x: 7, y: 3, pressed: false, gateId: 0 },
            { x: 2, y: 9, pressed: false, gateId: 1 }
        ],
        gates: [
            { x: 6, y: 2, open: false, id: 0 },
            { x: 5, y: 8, open: false, id: 1 }
        ],
        water: [
            { x: 10, y: 5, filled: false }, { x: 11, y: 5, filled: false },
            { x: 10, y: 6, filled: false }, { x: 11, y: 6, filled: false }
        ]
    }
];

// ===== SCREEN MANAGEMENT =====
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.style.display = 'none');
    document.getElementById(screenId).style.display = 'block';
}

// ===== GAME INITIALIZATION =====
function startGame() {
    currentLevel = 0;
    freedAnimals = [];
    loadLevel(currentLevel);
}

function loadLevel(levelIndex) {
    if (levelIndex >= LEVELS.length) {
        showVictory();
        return;
    }
    
    const level = LEVELS[levelIndex];
    
    // Reset state
    player = { ...level.playerStart };
    keysCollected = 0;
    boxes = level.boxes.map(b => ({ ...b }));
    switches = level.switches.map(s => ({ ...s, pressed: false }));
    gates = level.gates.map(g => ({ ...g, open: false }));
    waterTiles = level.water.map(w => ({ ...w, filled: false }));
    animals = level.animals.map(a => ({ ...a, freed: false }));
    zookeepers = level.zookeepers.map(z => ({ ...z, currentX: z.x, currentY: z.y }));
    levelKeys = level.keys.map(k => ({ ...k, collected: false }));
    
    // Parse base map (walls and floors only)
    levelMap = [];
    for (let y = 0; y < level.map.length; y++) {
        levelMap[y] = [];
        for (let x = 0; x < level.map[y].length; x++) {
            const char = level.map[y][x];
            levelMap[y][x] = (char === 'W') ? 'wall' : 'floor';
        }
    }
    
    // Update UI
    document.getElementById('level-display').textContent = level.name;
    document.getElementById('hint-text').textContent = level.hint;
    updateUI();
    renderBoard();
    showScreen('game-screen');
    gameRunning = true;
    startZookeepers();
}

function renderBoard() {
    const level = LEVELS[currentLevel];
    const board = document.getElementById('game-board');
    board.innerHTML = '';
    board.style.gridTemplateColumns = `repeat(${level.width}, 45px)`;
    
    for (let y = 0; y < level.map.length; y++) {
        for (let x = 0; x < level.width; x++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            
            const baseType = levelMap[y][x];
            let content = '';
            let bgClass = baseType;
            
            // Check for water
            const water = waterTiles.find(w => w.x === x && w.y === y);
            if (water) {
                if (water.filled) {
                    bgClass = 'filled-water';
                    content = '📦';
                } else {
                    bgClass = 'water';
                    content = EMOJI.WATER;
                }
            }
            
            // Check for switches (on floor)
            const sw = switches.find(s => s.x === x && s.y === y);
            if (sw) {
                bgClass = 'switch';
                content = sw.pressed ? EMOJI.SWITCH_ON : EMOJI.SWITCH_OFF;
            }
            
            // Check for gates
            const gate = gates.find(g => g.x === x && g.y === y);
            if (gate) {
                if (gate.open) {
                    bgClass = 'gate-open';
                    content = EMOJI.GATE_OPEN;
                } else {
                    bgClass = 'gate-closed';
                    content = EMOJI.GATE_CLOSED;
                }
            }
            
            // Check for keys
            const key = levelKeys.find(k => k.x === x && k.y === y && !k.collected);
            if (key) {
                content = EMOJI.KEY;
            }
            
            // Check for boxes (on top of floor/switch)
            const box = boxes.find(b => b.x === x && b.y === y);
            if (box) {
                content = EMOJI.BOX;
            }
            
            // Check for animals in cages
            const animal = animals.find(a => a.x === x && a.y === y);
            if (animal) {
                if (animal.freed) {
                    bgClass = 'cage-open';
                } else {
                    bgClass = 'cage';
                    content = EMOJI[animal.type];
                }
            }
            
            // Check for zookeepers
            const keeper = zookeepers.find(z => z.currentX === x && z.currentY === y);
            if (keeper) {
                content = EMOJI.ZOOKEEPER;
            }
            
            // Check for player (on top of everything)
            if (player.x === x && player.y === y) {
                content = EMOJI.MONKEY;
                cell.classList.add('player');
            }
            
            cell.classList.add(bgClass);
            cell.textContent = content;
            board.appendChild(cell);
        }
    }
}

function updateUI() {
    document.getElementById('keys-display').textContent = `🔑 x${keysCollected}`;
    const freed = animals.filter(a => a.freed).length;
    document.getElementById('animals-display').textContent = `Freed: ${freed}/${animals.length}`;
}

// ===== MOVEMENT & GAME LOGIC =====
document.addEventListener('keydown', (e) => {
    if (!gameRunning) return;
    
    let dx = 0, dy = 0;
    
    switch(e.key) {
        case 'ArrowUp': case 'w': case 'W': dy = -1; break;
        case 'ArrowDown': case 's': case 'S': dy = 1; break;
        case 'ArrowLeft': case 'a': case 'A': dx = -1; break;
        case 'ArrowRight': case 'd': case 'D': dx = 1; break;
        case 'r': case 'R': loadLevel(currentLevel); return; // Restart level
        default: return;
    }
    
    e.preventDefault();
    tryMove(dx, dy);
});

function tryMove(dx, dy) {
    const newX = player.x + dx;
    const newY = player.y + dy;
    const level = LEVELS[currentLevel];
    
    // Check bounds
    if (newX < 0 || newX >= level.width || newY < 0 || newY >= level.map.length) {
        return;
    }
    
    // Can't walk through walls
    if (levelMap[newY][newX] === 'wall') return;
    
    // Check for closed gates
    const gate = gates.find(g => g.x === newX && g.y === newY);
    if (gate && !gate.open) return;
    
    // Check for unfilled water
    const water = waterTiles.find(w => w.x === newX && w.y === newY);
    if (water && !water.filled) return;
    
    // Check for box - try to push it
    const box = boxes.find(b => b.x === newX && b.y === newY);
    if (box) {
        if (!tryPushBox(box, dx, dy)) {
            return; // Can't push box, can't move
        }
    }
    
    // Check for animal cage - need key to enter!
    const animal = animals.find(a => a.x === newX && a.y === newY && !a.freed);
    if (animal) {
        if (keysCollected > 0) {
            // Has key - free the animal!
            keysCollected--;
            animal.freed = true;
            freedAnimals.push(EMOJI[animal.type]);
            showMessage(`🎉 Freed the ${EMOJI[animal.type]}!`);
            
            // Check win condition
            if (animals.every(a => a.freed)) {
                setTimeout(winLevel, 600);
            }
        } else {
            // No key - can't enter cage
            showMessage("🔒 Need a key!");
            updateUI();
            renderBoard();
            return; // Don't move onto the cage
        }
    }
    
    // Move player!
    player.x = newX;
    player.y = newY;
    
    // Check for key pickup
    const key = levelKeys.find(k => k.x === newX && k.y === newY && !k.collected);
    if (key) {
        key.collected = true;
        keysCollected++;
        showMessage("🔑 Got a key!");
    }
    
    // Check zookeeper collision
    checkZookeeperCollision();
    
    updateUI();
    renderBoard();
}

function tryPushBox(box, dx, dy) {
    const newBoxX = box.x + dx;
    const newBoxY = box.y + dy;
    const level = LEVELS[currentLevel];
    
    // Check bounds
    if (newBoxX < 0 || newBoxX >= level.width || newBoxY < 0 || newBoxY >= level.map.length) {
        return false;
    }
    
    // Can't push into walls
    if (levelMap[newBoxY][newBoxX] === 'wall') return false;
    
    // Can't push into closed gates
    const gate = gates.find(g => g.x === newBoxX && g.y === newBoxY && !g.open);
    if (gate) return false;
    
    // Can't push into other boxes
    const otherBox = boxes.find(b => b.x === newBoxX && b.y === newBoxY);
    if (otherBox) return false;
    
    // Can't push into animals
    const animal = animals.find(a => a.x === newBoxX && a.y === newBoxY && !a.freed);
    if (animal) return false;
    
    // Can't push into zookeepers
    const keeper = zookeepers.find(z => z.currentX === newBoxX && z.currentY === newBoxY);
    if (keeper) return false;
    
    // Check for water - box fills it!
    const water = waterTiles.find(w => w.x === newBoxX && w.y === newBoxY && !w.filled);
    if (water) {
        water.filled = true;
        // Remove the box (it's now in the water)
        const boxIndex = boxes.indexOf(box);
        boxes.splice(boxIndex, 1);
        showMessage("💦 Box fell in! Now you can cross!");
        return true;
    }
    
    // Check if box was on a switch (release it)
    const oldSwitch = switches.find(s => s.x === box.x && s.y === box.y && s.pressed);
    if (oldSwitch) {
        oldSwitch.pressed = false;
        // Close the gate again
        const connectedGate = gates.find(g => g.id === oldSwitch.gateId);
        if (connectedGate) {
            connectedGate.open = false;
            showMessage("🚧 Gate closed!");
        }
    }
    
    // Push the box
    box.x = newBoxX;
    box.y = newBoxY;
    
    // Check if box is now on a switch
    const sw = switches.find(s => s.x === newBoxX && s.y === newBoxY);
    if (sw && !sw.pressed) {
        sw.pressed = true;
        // Open the connected gate
        const connectedGate = gates.find(g => g.id === sw.gateId);
        if (connectedGate) {
            connectedGate.open = true;
            showMessage("✨ Gate opened!");
        }
    }
    
    return true;
}

let messageTimeout = null;
function showMessage(text) {
    const msg = document.getElementById('message');
    msg.textContent = text;
    msg.classList.add('show');
    if (messageTimeout) clearTimeout(messageTimeout);
    messageTimeout = setTimeout(() => msg.classList.remove('show'), 2000);
}

// ===== ZOOKEEPERS =====
let zookeeperIntervals = [];

function startZookeepers() {
    stopZookeepers();
    
    zookeepers.forEach((keeper) => {
        const interval = setInterval(() => {
            if (!gameRunning) return;
            
            // Move zookeeper along patrol path
            if (keeper.patrolAxis === 'x') {
                keeper.currentX += keeper.dir;
                if (keeper.currentX >= keeper.max) keeper.dir = -1;
                if (keeper.currentX <= keeper.min) keeper.dir = 1;
            } else if (keeper.patrolAxis === 'y') {
                keeper.currentY += keeper.dir;
                if (keeper.currentY >= keeper.max) keeper.dir = -1;
                if (keeper.currentY <= keeper.min) keeper.dir = 1;
            }
            
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
    const caught = zookeepers.some(k => k.currentX === player.x && k.currentY === player.y);
    if (caught) {
        getCaught();
    }
}

function getCaught() {
    gameRunning = false;
    stopZookeepers();
    showScreen('caught-screen');
}

function retryLevel() {
    loadLevel(currentLevel);
}

// ===== WIN CONDITIONS =====
function winLevel() {
    gameRunning = false;
    stopZookeepers();
    
    document.getElementById('freed-animals').textContent = freedAnimals.slice(-animals.length).join(' ');
    document.getElementById('win-level-name').textContent = LEVELS[currentLevel].name + ' Complete!';
    showScreen('win-screen');
}

function nextLevel() {
    currentLevel++;
    if (currentLevel >= LEVELS.length) {
        showVictory();
    } else {
        loadLevel(currentLevel);
    }
}

function showVictory() {
    document.getElementById('all-freed-animals').textContent = freedAnimals.join(' ');
    showScreen('victory-screen');
}

function playAgain() {
    currentLevel = 0;
    freedAnimals = [];
    loadLevel(0);
}
