# Jeopardy

An Electron + React + TypeScript implementation of a Jeopardy-style quiz game.

## Quick Start

Install dependencies and run the app in development mode:

```bash
npm install
npm run dev
```

To run the packaged/preview build (when available):

```bash
npm start
```

To create distributable builds (platform-specific):

```bash
# macOS
npm run build:mac

# Windows
npm run build:win

# Linux
npm run build:linux
```

## Gameplay Overview

- Players form teams (or play solo) and take turns selecting clues from the game board.
- Each clue has a point value. Selecting a tile reveals the clue text; you can then reveal the answer.
- After a clue is revealed, award points to the team that answered correctly and deduct points for incorrect answers according to your house rules.
- The game proceeds until all clues on the board are played. The team with the highest score wins.

## How to Play (in-app)

- Select a category and value tile on the board to reveal the clue.
- Use the in-screen controls to reveal the clue and then the answer. The UI provides buttons to show/hide clues and move between screens.
- Track scores manually using the score controls in the app, or agree on a host to update scores.

Notes:
- The app is designed for mouse/touch control; it also works with keyboard and remote controls where supported by your platform.
- If you're running the app locally, open it on a screen that all players can see.

## Custom Games

- Sample games are provided in the `resources/games` folder (for example `resources/sample-game.json`).
- To add your own game, create a JSON file that follows the sample format and place it in `resources/games`.
- Restart the app (or use the in-app editor if available) to load new game files.

## Tips for Hosts

- Decide on buzz/answer rules before you start (e.g., single answer per team, timed responses).
- Use the Editor screen (if included) to modify clues and categories before a show.

## Developer / Contributors

For developers working on the codebase, the recommended editor setup and scripts are below.

Recommended IDE: Visual Studio Code with ESLint and Prettier extensions.

Development scripts are available in `package.json`:

```bash
npm run dev    # start development
npm run build  # build app (+ typechecks)
npm start      # preview packaged app
```

If you plan to build installers, run the platform-specific build scripts listed above.

Enjoy the game — have fun and good luck!
