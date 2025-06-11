# Tetris Game

A classic implementation of the Tetris game playable in your web browser.

## How to Play

There are two ways to play the game:

**1. Playing Locally (Simplest)**

*   **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd <repository_name>
    ```
*   **Navigate to the `public` directory:**
    ```bash
    cd public
    ```
*   **Open `index.html`:** Open the `index.html` file in this directory directly in your web browser.

**2. Running with the Node.js Server (Optional, for serving files via HTTP)**

*   **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd <repository_name>
    ```
*   **Install dependencies:** (This will install Express, which is used by `server.js`. Note: `server.js` also has MongoDB dependencies which are not required for basic gameplay.)
    ```bash
    npm install
    ```
*   **Start the server:**
    ```bash
    node server.js
    ```
*   **Open in browser:** Open `http://localhost:3000` in your web browser.

## Controls

*   **Left Arrow:** Move piece left
*   **Right Arrow:** Move piece right
*   **Down Arrow:** Move piece down (soft drop)
*   **Up Arrow:** Rotate piece

## Objective

*   Arrange the falling Tetrominoes (game pieces) to form complete horizontal lines at the bottom of the playing field.
*   Completed lines will disappear, and the blocks above will shift down.
*   You score points for each cleared line. More lines cleared at once result in more points.
*   The game ends if the blocks stack up and reach the top of the screen. Try to play as long as possible and achieve the highest score!
