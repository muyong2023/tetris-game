// jest.setup.js
// Set up the JSDOM environment with expected HTML structure
// before any test files are run (but after JSDOM environment is up).

document.body.innerHTML = `
    <div id="score-display">Score: 0</div>
    <div id="game-board"></div>
    <div id="game-over-message" style="display: none;"></div>
`;
// Added game-over-message as well, as script.js might try to style it if displayGameOverMessage is called.
// Though for unit tests of Tetromino/clearLines, it might not be strictly necessary.
// It's good practice to include all elements the script might interact with at a global level.
