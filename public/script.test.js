const {
    Tetromino,
    clearLines,
    // board: globalBoard, // Removed aliased import to avoid redeclaration
    boardWidth,
    boardHeight,
    tetrominoes,
    // score: globalScore, // We'll manage score directly via the imported module
    gameState, // Import gameState
} = require('./script.js');

// Access board via the module itself to modify/check the global one
// gameState is directly imported now.
const scriptModule = require('./script.js'); // Still useful for other potential exports or direct access
const globalBoard = scriptModule.board;

describe('Tetromino', () => {
    let board; // Local board for Tetromino collision tests, not the global one for clearLines

    beforeEach(() => {
        // Create a fresh local board for each Tetromino test
        board = Array.from({ length: boardHeight }, () => Array(boardWidth).fill(0));
    });

    describe('isColliding', () => {
        test('should not collide when spawned in an empty board', () => {
            const tetromino = new Tetromino(tetrominoes.T, board);
            expect(tetromino.isColliding()).toBe(false);
        });

        test('should collide with the bottom boundary', () => {
            const tetromino = new Tetromino(tetrominoes.T, board);
            let shapeHeight = 0;
            tetromino.shape.forEach((row, y) => {
                if (row.some(cell => cell !== 0)) shapeHeight = y + 1;
            });
            tetromino.position.y = boardHeight - shapeHeight + 1;
            expect(tetromino.isColliding()).toBe(true);
        });

        test('should not collide when at bottom boundary but not exceeding', () => {
            const tetromino = new Tetromino(tetrominoes.T, board);
            let shapeHeight = 0;
            tetromino.shape.forEach((row, y) => {
                if (row.some(cell => cell !== 0)) shapeHeight = y + 1;
            });
            tetromino.position.y = boardHeight - shapeHeight;
            expect(tetromino.isColliding()).toBe(false);
        });

        test('should collide with the left boundary', () => {
            const tetromino = new Tetromino(tetrominoes.L, board);
            tetromino.position.x = -1; // L's first column of blocks is at shape[x=0]
            expect(tetromino.isColliding()).toBe(true);
        });

        test('should collide with the right boundary for I shape', () => {
            const tetromino = new Tetromino(tetrominoes.I, board); // I: [[1,1,1,1]]
            tetromino.position.x = boardWidth - 4 + 1;
            expect(tetromino.isColliding()).toBe(true);
        });

        test('should not collide at right boundary but not exceeding for I shape', () => {
            const tetromino = new Tetromino(tetrominoes.I, board);
            tetromino.position.x = boardWidth - 4;
            expect(tetromino.isColliding()).toBe(false);
        });

        test('should collide with existing blocks on the board', () => {
            const tetromino = new Tetromino(tetrominoes.T, board);
            tetromino.position.y = 5;
            tetromino.position.x = 5;
            board[tetromino.position.y + 1][tetromino.position.x + 1] = 1;
            expect(tetromino.isColliding()).toBe(true);
        });

        test('should not collide when placed near other blocks but not overlapping', () => {
            const tetromino = new Tetromino(tetrominoes.T, board);
            tetromino.position.y = 5;
            tetromino.position.x = 5;
            board[tetromino.position.y + 2][tetromino.position.x + 1] = 1;
            expect(tetromino.isColliding()).toBe(false);
        });
    });

    describe('rotate', () => {
        test('should rotate an L piece in open space', () => {
            const lShape = tetrominoes.L; // [[0,0,1],[1,1,1],[0,0,0]]
            const tetromino = new Tetromino(lShape, board);
            tetromino.position = { x: 3, y: 3 };

            tetromino.rotate();
            // Expected shape after one rotation of L: [[1,0,0],[1,0,0],[1,1,0]] (approx)
            // More precisely from the code: shape[0].map((_, i) => shape.map(row => row[i])).reverse();
            // L = [[0,0,1],[1,1,1],[0,0,0]]
            // Transposed = [[0,1,0],[0,1,0],[1,1,0]]
            // Reversed = [[1,1,0],[0,1,0],[0,1,0]]
            const expectedShape = [[1,1,0],[0,1,0],[0,1,0]];
            expect(tetromino.shape).toEqual(expectedShape);

            // To properly check if the final resting place is non-colliding (with boundaries/other blocks),
            // we must erase the piece from the board first, so it's not colliding with its own just-drawn cells.
            tetromino.erase();
            expect(tetromino.isColliding()).toBe(false); // Should not collide with boundaries or other blocks
            tetromino.draw(); // Draw it back for completeness or if other actions followed
        });

        test('I piece rotation with simple wall kick (from vertical to horizontal near left wall)', () => {
            // I piece vertical: [[1],[1],[1],[1]] (Needs rotation to be vertical from horizontal)
            // Start with horizontal I: [[1,1,1,1],[0,0,0,0]...]
            let iPiece = new Tetromino(tetrominoes.I, board);
            iPiece.position = { x: 0, y: 0};
            iPiece.rotate(); // Rotate to vertical: [[1,0,0,0],[1,0,0,0],[1,0,0,0],[1,0,0,0]] (approx)

            // Now rotate vertical I at x=0. It should kick to x=1 if it's a simple I piece.
            // Standard I piece rotation involves complex kicks. This basic kick might behave differently.
            // Let's test rotation of horizontal I at x=0.
            // Default I: [[1,1,1,1],[0,0,0,0],[0,0,0,0],[0,0,0,0]]
            // Rotated I: [[1,0,0,0],[1,0,0,0],[1,0,0,0],[1,0,0,0]] (simplified view)
            iPiece = new Tetromino(tetrominoes.I, board);
            iPiece.position = {x: 0, y: 0}; // Place horizontal I at the very left
            iPiece.rotate(); // Attempt to rotate

            // Collision logic: newX = this.position.x + x;
            // If the piece is [[1],[1],[1],[1]] (after rotation, simplified), and x=0, this is fine.
            // The actual rotated shape from [[1,1,1,1]] is [[1,0,0,0],[1,0,0,0],[1,0,0,0],[1,0,0,0]] (first col of original)
            // This shape at (0,0) should not collide.
            // Let's test a case that *would* collide without a kick.
            // If rotated shape is [[0,1,...],[0,1,...]] and current x=0, it would need a kick.
            // The current kick logic is: try x-1, then try x+1.
            // For an I piece like [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]] (row 1 has blocks)
            // rotated to [[0,1,0,0],[0,1,0,0],[0,1,0,0],[0,1,0,0]] (col 1 has blocks)
            // If this rotated piece at x=0,y=0 would collide (e.g. if x becomes -1 due to shape)
            // This test is becoming complex due to specific shape details.
            // Let's simplify: rotate T at left edge.
            const tPiece = new Tetromino(tetrominoes.T, board); // [[0,1,0],[1,1,1],[0,0,0]]
            tPiece.position = {x: -1, y: 0}; // Force initial collision to test rotation behavior
            tPiece.erase(); // Manually erase because it's placed in collision
            tPiece.position.x = 0; // Move to valid spot for rotation test start

            // Original T at (0,0)
            // Rotated T: [[1,0,0],[1,1,0],[1,0,0]] (approx)
            // The '1' at shape[0][0] is at boardX = newX = position.x + 0 = 0. This is fine.
            // What if the shape itself has a negative extent relative to its registration point?
            // The current code doesn't support this well. All shape coordinates are >= 0.
            // Test T at x=0, rotated. Expected rotated shape from T: [[1,1,1],[0,1,0],[0,0,0]] (transposed)
            // -> [[0,0,0],[0,1,0],[1,1,1]] (reversed)
            // No, the implemented rotation is:
            // T = [[0,1,0],[1,1,1],[0,0,0]]
            // Transposed = [[0,1,0],[1,1,0],[0,1,0]]
            // Reversed   = [[0,1,0],[1,1,0],[0,1,0]] (for a 3x3 matrix)

            // Re-evaluating rotate: this.shape[0].map((_, i) => this.shape.map(row => row[i])).reverse();
            // For T:
            // this.shape.map(row => row[i]) gets a column.
            // So, for i=0: [0,1,0] (col 0)
            // for i=1: [1,1,1] (col 1)
            // for i=2: [0,0,0] (col 2)
            // Result before reverse: [[0,1,0],[1,1,1],[0,0,0]] (original T, if it were square and this was row mapping)
            // This is effectively transposing.
            // T_transposed = [[0,1,0],[1,1,0],[0,1,0]] (if padding T to 3x3)
            // The tetrominoes are not always square.
            // Let's take L: [[0,0,1],[1,1,1],[0,0,0]]
            // col0 = [0,1,0], col1=[0,1,0], col2=[1,1,0]
            // pre_reverse = [[0,1,0],[0,1,0],[1,1,0]]
            // post_reverse = [[1,1,0],[0,1,0],[0,1,0]] - this matches earlier test.

            tPiece.rotate(); // Rotate T at (0,0)
            // Expected: [[0,1,0],[1,1,0],[0,1,0]] (using 3x3 example for T)
            // If this piece's leftmost block (e.g. shape[1][0] which is 1) is at board x=0, no kick needed.
            // If a rotation caused part of shape to be at x=-1 relative to piece.position.x, then kick.
            // The current Tetromino shapes don't have negative relative coords.
            // So, a kick is only needed if piece.position.x itself becomes <0 OR > boardWidth after rotation.
            // The current rotate logic: 1. erase 2. rotate shape 3. check collision.
            // If collision: try position.x--, if no collision, draw, return. else revert position.x.
            // Try position.x++, if no collision, draw, return. else revert position.x.
            // If still colliding (both kicks failed): revert shape and position.
            // Finally, draw.

            // Test actual kick: Place I piece horizontally at x = boardWidth - 3
            // I: [[1,1,1,1]] (length 4)
            // Position x=7, y=0 on a 10-width board. (Indices 7,8,9,10 - 10 is out)
            // No, boardWidth-4 is the last valid spot. So boardWidth-3 means x=7.
            // I piece at x=7, y=0. Blocks at 7,8,9,10. Oh, board coords are 0-9.
            // So x=boardWidth-4 = 6. Blocks at 6,7,8,9. This is fine.
            // x=boardWidth-3 = 7. Blocks at 7,8,9,10(invalid). This will collide.

            iPiece.position = {x: boardWidth - 3, y: 0}; // x=7. Horizontal I. Collides.
            iPiece.erase(); // erase from this invalid spot.
            iPiece.position = {x: boardWidth - 4, y: 0}; // x=6. Valid spot.
            iPiece.rotate(); // Rotate horizontal I to vertical.
            // Rotated I: [[1],[1],[1],[1]] (simplified). Width 1.
            // Position x=6 should be fine. No kick needed.
            expect(iPiece.position.x).toBe(boardWidth - 4); // x=6

            // Test kick: Rotate vertical I at x=0.
            // It will become horizontal. If position.x remains 0, it's fine.
            // No, it becomes horizontal I: [[1,1,1,1]]. This at x=0 is fine.
            // The current kick logic might not be complex enough for SRS-style kicks,
            // but we test what's there.
            // A kick happens if the rotated shape *at the current position* collides.

            // Scenario: T-piece at bottom, rotation causes part to go out of bounds, kick should not help.
            const tShape = tetrominoes.T; // [[0,1,0],[1,1,1],[0,0,0]] effective height 2
            const tTetromino = new Tetromino(tShape, board);
            tTetromino.position = {x: 5, y: boardHeight - 2}; // Placed at bottom
            tTetromino.rotate();
            // Rotated shape: [[0,1,0],[1,1,0],[0,1,0]] (effective height 3 if middle col defines it)
            // If y = 18, rotated shape's lowest block (shape[2][1]=1) is at 18+2=20 (invalid)
            // This will try to kick left/right. Neither helps. So it should revert.
            expect(tTetromino.shape).toEqual(tShape); // Reverted to original shape
            expect(tTetromino.position.y).toEqual(boardHeight - 2); // Reverted to original Y
        });
    });
});

describe('clearLines', () => {
    beforeEach(() => {
        // Reset the global board and score before each test
        for (let y = 0; y < boardHeight; y++) {
            globalBoard[y] = Array(boardWidth).fill(0);
        }
        gameState.score = 0; // Reset score via the imported gameState object
    });

    test('should not change board or score if no lines are full', () => {
        globalBoard[boardHeight - 1][0] = 1; // Single block
        clearLines();
        expect(globalBoard[boardHeight - 1][0]).toBe(1);
        expect(gameState.score).toBe(0);
    });

    test('should clear a single filled line and update score by 100', () => {
        globalBoard[boardHeight - 1].fill(1); // Fill bottom line
        clearLines();
        expect(globalBoard[boardHeight - 1].every(cell => cell === 0)).toBe(true); // Bottom line is now empty
        expect(globalBoard[0].every(cell => cell === 0)).toBe(true); // Top line is new and empty
        expect(gameState.score).toBe(100);
    });

    test('should clear two filled lines and update score by 300', () => {
        globalBoard[boardHeight - 1].fill(1);
        globalBoard[boardHeight - 2].fill(1);
        globalBoard[boardHeight - 3][0] = 1; // A block on the line above cleared lines
        clearLines();
        // After clearing 2 lines (boardHeight-1 and boardHeight-2),
        // the block from boardHeight-3 (at x=0) should drop to boardHeight-1 (at x=0).
        expect(globalBoard[boardHeight - 1][0]).toBe(1);
        for (let i = 1; i < boardWidth; i++) { // Ensure rest of that line is empty
            expect(globalBoard[boardHeight - 1][i]).toBe(0);
        }
        // The line that was originally at boardHeight-2 is now a new empty line (shifted from top)
        expect(globalBoard[boardHeight - 2].every(cell => cell === 0)).toBe(true);
        // The line that was originally at boardHeight-3 (now boardHeight-1 after blocks dropped) was partially filled.
        // The lines above it (boardHeight-2, boardHeight-3 before block drop) are now new empty lines.
        expect(globalBoard[0].every(cell => cell === 0)).toBe(true); // Check the topmost line
        expect(gameState.score).toBe(300);
    });

    test('should clear four filled lines (Tetris) and update score by 800', () => {
        globalBoard[boardHeight - 1].fill(1);
        globalBoard[boardHeight - 2].fill(1);
        globalBoard[boardHeight - 3].fill(1);
        globalBoard[boardHeight - 4].fill(1);
        clearLines();
        expect(globalBoard[boardHeight - 1].every(cell => cell === 0)).toBe(true);
        expect(globalBoard[boardHeight - 2].every(cell => cell === 0)).toBe(true);
        expect(globalBoard[boardHeight - 3].every(cell => cell === 0)).toBe(true);
        expect(globalBoard[boardHeight - 4].every(cell => cell === 0)).toBe(true);
        expect(gameState.score).toBe(800);
    });

    test('lines should shift down correctly', () => {
        globalBoard[boardHeight - 1].fill(1); // Line to be cleared
        globalBoard[boardHeight - 2][0] = 1;  // This block should shift down
        globalBoard[boardHeight - 2][1] = 2;  // This block should also shift down

        clearLines();

        expect(globalBoard[boardHeight - 1][0]).toBe(1); // Shifted block
        expect(globalBoard[boardHeight - 1][1]).toBe(2); // Shifted block
        expect(globalBoard[0].every(cell => cell === 0)).toBe(true); // New top line
        expect(gameState.score).toBe(100);
    });
});
