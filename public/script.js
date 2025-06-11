// Jest/Node.js environment setup
let gameBoard, scoreDisplay, gameInterval; // These will be undefined in Node, which is fine for tests not using them.
if (typeof document !== 'undefined') {
    gameBoard = document.getElementById('game-board');
    scoreDisplay = document.getElementById('score-display');
} else {
    // Provide basic mocks if needed by functions under test, though Tetromino/clearLines might not need these.
    // For instance, if updateScoreDisplay were directly tested, scoreDisplay would need a mock:
    scoreDisplay = { textContent: '' };
}

const boardWidth = 10;
const boardHeight = 20;

const board = Array.from({ length: boardHeight }, () => Array(boardWidth).fill(0));

//drawBoard();

const tetrominoes = {
    I: [
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    J: [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    L: [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0]
    ],
    O: [
        [1, 1],
        [1, 1]
    ],
    S: [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0]
    ],
    T: [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    Z: [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]
    ]
};

class Tetromino {
    constructor(shape, board) {
        this.shape = shape;
        this.board = board;
        this.position = { x: Math.floor(board[0].length / 2) - 1, y: 0 };
    }

    draw() {
        this.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value) {
                    this.board[this.position.y + y][this.position.x + x] = value;
                }
            });
        });
    }

    erase() {
        this.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value) {
                    this.board[this.position.y + y][this.position.x + x] = 0;
                }
            });
        });
    }

    move(offsetX, offsetY) {
        this.erase();
        this.position.x += offsetX;
        this.position.y += offsetY;
        this.draw();
    }

    rotate() {
        const originalShape = this.shape;
        const originalX = this.position.x;
        const originalY = this.position.y;

        this.erase();
        this.shape = this.shape[0].map((_, i) => this.shape.map(row => row[i])).reverse();

        if (this.isColliding()) {
            // Try kick left
            this.position.x--;
            if (!this.isColliding()) {
                this.draw();
                return;
            }
            this.position.x++; // Revert kick left

            // Try kick right
            this.position.x++;
            if (!this.isColliding()) {
                this.draw();
                return;
            }
            this.position.x--; // Revert kick right

            // If both kicks fail, revert to original shape and position
            this.shape = originalShape;
            this.position.x = originalX;
            this.position.y = originalY;
        }
        this.draw(); // Draw the piece in its final state (rotated, kicked, or reverted)
    }

    isColliding() {
        return this.shape.some((row, y) => {
            return row.some((value, x) => {
                let newX = this.position.x + x;
                let newY = this.position.y + y;
                return value && (
                    newX < 0 ||
                    newX >= this.board[0].length ||
                    newY >= this.board.length ||
                    this.board[newY][newX]
                );
            });
        });
    }
}

const tetrominoShapes = Object.keys(tetrominoes);

function getRandomShape() {
    const randomIndex = Math.floor(Math.random() * tetrominoShapes.length);
    return tetrominoShapes[randomIndex];
}

let currentTetromino = new Tetromino(tetrominoes[getRandomShape()], board);

let gameState = { score: 0 };

function updateScoreDisplay() {
    scoreDisplay.textContent = `Score: ${gameState.score}`;
}

function clearLines() {
    let linesClearedThisTurn = 0;
    for (let y = boardHeight - 1; y >= 0; y--) {
        if (board[y].every(cell => cell !== 0)) {
            board.splice(y, 1); // Remove the filled row
            board.unshift(Array(boardWidth).fill(0)); // Add an empty row at the top
            linesClearedThisTurn++;
            y++; // Re-check the current row index as rows have shifted down
        }
    }

    if (linesClearedThisTurn > 0) {
        if (linesClearedThisTurn === 1) {
            gameState.score += 100;
        } else if (linesClearedThisTurn === 2) {
            gameState.score += 300;
        } else if (linesClearedThisTurn === 3) {
            gameState.score += 500;
        } else if (linesClearedThisTurn >= 4) { // Could be more than 4 if game mechanics allowed
            gameState.score += 800;
        }
        updateScoreDisplay();
    }
    return linesClearedThisTurn; // Though not strictly needed by `update` anymore, good for potential future use
}

function update() {
    if (!currentTetromino.isColliding()) {
        currentTetromino.move(0, 1);
    } else {
        currentTetromino.draw(); // Ensure the piece is drawn at its final position
        const linesCleared = clearLines(); // Check for and clear any completed lines
        // Future: Could use linesCleared for other game events if needed
        currentTetromino = new Tetromino(tetrominoes[getRandomShape()], board);  // Create a new tetromino

        if (currentTetromino.isColliding()) {
            clearInterval(gameInterval);
            displayGameOverMessage();
        }
    }
    drawBoard();
}

function drawBoard() {
    gameBoard.innerHTML = '';
    board.forEach(row => {
        row.forEach(cell => {
            const cellDiv = document.createElement('div');
            cellDiv.className = cell ? 'filled' : 'empty';
            gameBoard.appendChild(cellDiv);
        });
    });
    currentTetromino.draw();
}

// Initial setup
updateScoreDisplay(); // Display initial score
gameInterval = typeof setInterval !== 'undefined' ? setInterval(update, 1000) : null; // Assign, don't redeclare. Guard setInterval for Node.

function displayGameOverMessage() {
    const gameOverDiv = document.createElement('div');
    gameOverDiv.id = 'game-over-message';
    gameOverDiv.textContent = 'Game Over';
    // Basic styling for the Game Over message
    gameOverDiv.style.position = 'absolute';
    gameOverDiv.style.top = '50%';
    gameOverDiv.style.left = '50%';
    gameOverDiv.style.transform = 'translate(-50%, -50%)';
    gameOverDiv.style.padding = '20px';
    gameOverDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.75)';
    gameOverDiv.style.color = 'white';
    gameOverDiv.style.fontSize = '2em';
    gameOverDiv.style.border = '2px solid white';
    gameOverDiv.style.borderRadius = '10px';
    document.body.appendChild(gameOverDiv);
}

document.addEventListener('keydown', event => {
    switch (event.key) {
        case 'ArrowLeft':
            currentTetromino.move(-1, 0);
            if (currentTetromino.isColliding()) currentTetromino.move(1, 0);
            break;
        case 'ArrowRight':
            currentTetromino.move(1, 0);
            if (currentTetromino.isColliding()) currentTetromino.move(-1, 0);
            break;
        case 'ArrowDown':
            currentTetromino.move(0, 1);
            if (currentTetromino.isColliding()) currentTetromino.move(0, -1);
            break;
        case 'ArrowUp':
            currentTetromino.rotate();
            // The isColliding check and potential second rotate was removed from here,
            // as rotate() now handles its own collision and reversion.
            break;
    }
    // Only draw if the game is not over
    // Only draw if the game is not over
    if (typeof gameInterval !== 'undefined' && gameInterval) { // Check if gameInterval is still active
        drawBoard();
    }
});

// Exports for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Tetromino,
        clearLines,
        board, // Exporting for manipulation in tests
        boardWidth,
        boardHeight,
        tetrominoes,
        gameState, // Exporting gameState for checking/resetting score in tests
        // Note: Be careful when exporting global state like board and gameState.score,
        // as tests might interfere with each other if not reset properly.
        // For more complex scenarios, consider refactoring to avoid global state.

        // Mock-related or UI-related functions are generally not exported for unit tests
        // unless they contain testable logic independent of the UI.
        // e.g. getRandomShape could be exported if needed.
    };
}

