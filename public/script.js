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

