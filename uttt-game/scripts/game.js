// Game class controls the flow and rules of the game
class Game {
    constructor() {
        // Initial setup of game components and state
        this.gameBoard = new Board(); // Represents the main game board
        this.circleTurn = false; // Tracks whose turn it is; false for X, true for O
        this.activeMiniBoardIndex = null; // Index of the currently active mini-board
        // Set up references to DOM elements for game messages and controls
        this.winningMessageElement = document.getElementById('winningMessage');
        this.winningMessageTextElement = document.querySelector('[data-winning-message-text]');
        this.restartButton = document.getElementById('restartButton');
        // Event listener to restart the game when the button is clicked
        this.restartButton.addEventListener('click', () => this.startGame());
        this.startGame(); // Kick off the game
    }

    // Sets up the game board for a new game or restarts the game
    startGame() {
        this.circleTurn = false; // X always starts first
        this.gameBoard.reset(); // Clear all mini-boards
        this.activateAllMiniBoards(); // Enable all mini-boards for the first turn
        this.setBoardHoverClass(); // Set the visual cue for the current player
        this.winningMessageElement.classList.remove('show'); // Hide winning message if visible
        this.gameBoard.setCellClickCallback(this.handleCellClick.bind(this)); // Bind cell click event
    }

    // Determines if the mini-board clicked is active or not
    isActiveBoard(miniBoardIndex) {
        // A mini-board is active if it's the next one in the sequence or if any can be played (no specific active board)
        return this.activeMiniBoardIndex === null || this.activeMiniBoardIndex === miniBoardIndex;
    }

    // Event handler for cell clicks within mini-boards
    handleCellClick(miniBoardIndex, cellIndex) {
        // Ignore click if the mini-board isn't active
        if (!this.isActiveBoard(miniBoardIndex)) return;
        const currentPlayer = this.circleTurn ? CIRCLE_CLASS : X_CLASS;
        const miniBoard = this.gameBoard.getMiniBoard(miniBoardIndex);
        // Mark the cell and proceed if it's a valid move
        if (miniBoard.markCell(currentPlayer, cellIndex)) {
            this.processMove(miniBoard, cellIndex);
        }
    }

    // Processes a move and updates the game state accordingly
    processMove(miniBoard, cellIndex) {
        // Handle win/draw and turn swapping
        this.checkWinner();
        this.swapTurns(); // Change the active player
        this.updateActiveMiniBoard(cellIndex); // Set the next active mini-board
        this.setBoardHoverClass(); // Update the hover effect for the new active player
    }

    // Swaps the active player
    swapTurns() {
        this.circleTurn = !this.circleTurn;
    }

    // Updates visual cues to indicate the active player
    setBoardHoverClass() {
        this.gameBoard.board.classList.remove(X_CLASS, CIRCLE_CLASS);
        this.gameBoard.board.classList.add(this.circleTurn ? CIRCLE_CLASS : X_CLASS);
    }

    // Activates all mini-boards at the start of the game
    activateAllMiniBoards() {
        this.gameBoard.miniBoards.forEach(mb => mb.miniBoard.classList.add('active-mini-board'));
        this.activeMiniBoardIndex = null;
    }

    // Updates the active mini-board after a move
    updateActiveMiniBoard(cellIndex) {
        // If the mini-board played leads to a win or draw, activate all other non-completed boards
        const nextMiniBoard = this.gameBoard.getMiniBoard(cellIndex);
        if (!nextMiniBoard.getWinner()) {
            nextMiniBoard.miniBoard.classList.add('active-mini-board');
            this.activeMiniBoardIndex = cellIndex;
        } else {
            this.activateAllMiniBoards();
        }
    }

    // Checks the overall game state for a win or draw
    checkWinner() {
        const currentPlayer = this.circleTurn ? CIRCLE_CLASS : X_CLASS;
        if (this.gameBoard.checkWin(currentPlayer)) {
            this.endGame(false); // End game with a win
        } else if (this.gameBoard.checkDraw()) {
            this.endGame(true); // End game with a draw
        }
    }

    // Ends the game and displays the result
    endGame(draw) {
        const resultMessage = draw ? 'Draw!' : `${this.circleTurn ? "O's" : "X's"} Win!`;
        this.winningMessageTextElement.innerText = resultMessage;
        this.winningMessageElement.classList.add('show');
    }
}

const game = new Game();
