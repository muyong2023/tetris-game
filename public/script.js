const gameBoard = document.getElementById('game-board');

const boardWidth = 10;
const boardHeight = 20;

const board = Array.from({ length: boardHeight }, () => Array(boardWidth).fill(0));

function drawBoard() {
    gameBoard.innerHTML = '';
    board.forEach(row => {
        row.forEach(cell => {
            const cellDiv = document.createElement('div');
            cellDiv.className = cell ? 'filled' : 'empty';
            gameBoard.appendChild(cellDiv);
        });
    });
}

drawBoard();

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
        this.erase();
        this.shape = this.shape[0].map((_, i) => this.shape.map(row => row[i])).reverse();
        this.draw();
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


let currentTetromino = new Tetromino(tetrominoes['T'], board);

function update() {
    if (!currentTetromino.isColliding()) {
        currentTetromino.move(0, 1);
    } else {
        currentTetromino.draw();
        currentTetromino = new Tetromino(tetrominoes['T'], board);  // Create a new tetromino (eventually randomize)
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

setInterval(update, 1000);


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
            if (currentTetromino.isColliding()) currentTetromino.rotate();
            break;
    }
    drawBoard();
});


