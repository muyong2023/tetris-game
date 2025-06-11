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

## Live Demo via GitHub Pages

This game can be easily hosted as a live demo using GitHub Pages, as all core game logic is client-side.

**Steps to Deploy:**

1.  **Go to your repository on GitHub.**
2.  **Navigate to the 'Settings' tab.**
3.  **In the sidebar, click on 'Pages'** (under the 'Code and automation' section).
4.  **Under 'Build and deployment', for 'Source', select 'Deploy from a branch'.**
5.  **Under 'Branch', select your main branch** (e.g., `main` or `master`).
6.  **For the folder, select `/public` from the dropdown menu.** This will serve the contents of your `public` directory.
    *   *Note:* If the `/public` folder option is not directly available in the dropdown, or if you prefer to serve from the repository root, you might need to:
        *   Ensure your `index.html`, `script.js`, and `styles.css` are in the root of the branch you are deploying from. (You could temporarily move them from `/public` to the root for this, or use a separate `gh-pages` branch).
        *   Or, use a GitHub Actions workflow to build and deploy your site, which can handle moving files from `/public` to the root of the `gh-pages` branch. For this simple project, selecting the `/public` folder directly is the easiest if available.
7.  **Click 'Save'.**
8.  **GitHub will build your page and provide you with a URL.**
    *   If you selected the `/public` folder, the URL (e.g., `https://<your-username>.github.io/<your-repository-name>/`) should directly load `index.html` from that folder.
    *   If you served from the root of your branch and `index.html` was at the root, the URL will also directly load it.
9.  **Wait a few minutes for the page to be deployed.** You can then access the live demo at the provided URL. If it doesn't load immediately, check the repository's "Actions" tab for the status of the GitHub Pages build and deployment.
