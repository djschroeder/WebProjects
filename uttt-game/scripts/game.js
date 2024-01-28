// Constants representing the classes for X and O
const X_CLASS = 'x';
const CIRCLE_CLASS = 'circle';

// All the possible winning combinations for the board
const WINNING_COMBINATIONS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6]             // diagonals
];

class Game {
    constructor() {
        // Initialize the game board and UI elements
        this.gameBoard = new Board();
        this.circleTurn = false; // Start with X's turn
        this.activeMiniBoardIndex = null; // No active mini board at start
        // Grab UI elements for later updates
        this.winningMessageElement = document.getElementById('winningMessage');
        this.winningMessageTextElement = document.querySelector('[data-winning-message-text]');
        this.restartButton = document.getElementById('restartButton');
        this.restartButton.addEventListener('click', () => this.startGame());
        // Kick off the game
        this.startGame();
    }

    // Resets the game to the initial state
    startGame() {
        this.circleTurn = false; // X starts the game
        this.gameBoard.reset(); // Clear the board
        this.gameBoard.setCellClickCallback(this.handleCellClick.bind(this));
        this.activateAllMiniBoards(); // Make all mini boards clickable
        this.setBoardHoverClass(); // Set the hover class based on who's turn it is
        this.winningMessageElement.classList.remove('show'); // Hide any winning message
    }

    // Handles clicks on cells within the mini boards
    handleCellClick(miniBoardIndex, cellIndex) {
        // Check if the clicked cell is within the active mini board
        if (!this.isActiveBoard(miniBoardIndex)) {
            return; // If not, ignore the click
        }
        const miniBoard = this.gameBoard.getMiniBoard(miniBoardIndex);
        const currentPlayer = this.circleTurn ? CIRCLE_CLASS : X_CLASS; // Determine current player
        // Attempt to mark the cell for the current player
        if (miniBoard.markCell(currentPlayer, cellIndex)) {
            this.processMove(miniBoard, cellIndex); // Process the move if successful
        }
    }

    // Determines if the clicked mini board is the active board
    isActiveBoard(miniBoardIndex) {
        // The board is active if it's the next board to play in, or if there's no active board
        return this.activeMiniBoardIndex === null || 
               this.activeMiniBoardIndex === miniBoardIndex ||
               this.gameBoard.getMiniBoard(this.activeMiniBoardIndex).getWinner() !== null;
    }

    // Makes all mini boards active at the start of the game
    activateAllMiniBoards() {
        this.gameBoard.miniBoards.forEach(mb => mb.miniBoard.classList.add('active-mini-board'));
        this.activeMiniBoardIndex = null; // Reset the active mini board
    }

    // Processes a move and updates the game state
    processMove(miniBoard, cellIndex) {
        // First, check if the current move won the game before swapping turns
        this.checkWinner();
        // Then, swap turns for the next player
        this.swapTurns();
        // Determine the next mini board to play in based on the last move
        const nextMiniBoard = this.gameBoard.getMiniBoard(cellIndex);
        // Remove active class from all mini boards and set it on the next one
        this.gameBoard.miniBoards.forEach(mb => mb.miniBoard.classList.remove('active-mini-board'));
        if (nextMiniBoard.getWinner() === null) {
            nextMiniBoard.miniBoard.classList.add('active-mini-board');
            this.activeMiniBoardIndex = cellIndex;
        } else {
            // If the next mini board is already won or drawn, make all boards active
            this.activeMiniBoardIndex = null;
            this.gameBoard.miniBoards.forEach(mb => {
                if (mb.getWinner() === null) mb.miniBoard.classList.add('active-mini-board');
            });
        }
    }

    // The `checkWinner` function checks if the current player has won or if the game is a draw.
    checkWinner() {
        // Determine the current player's class based on whose turn it is.
        const currentPlayer = this.circleTurn ? CIRCLE_CLASS : X_CLASS;
        
        // If the current player has won (by checking the win condition on the main board), end the game.
        if (this.gameBoard.checkWin(currentPlayer)) {
            this.endGame(false); // False indicates that it's not a draw but a win.
        } 
        // If nobody has won but it's a draw (no more moves possible), end the game as a draw.
        else if (this.gameBoard.checkDraw()) {
            this.endGame(true); // True indicates it's a draw.
        }
    }

    // The `endGame` function displays the winning message and reveals the winning message element.
    endGame(draw) {
        // Set the text to display if it's a draw or if there's a winner, depending on the `draw` parameter.
        this.winningMessageTextElement.innerText = draw ? `Draw!` : `${this.circleTurn ? "O's" : "X's"} Win!`;
        // Show the winning message to the players.
        this.winningMessageElement.classList.add('show');
    }

    // The `swapTurns` function inverts the turn (from X to O or O to X).
    swapTurns() {
        // Switch the turn to the opposite player.
        this.circleTurn = !this.circleTurn;
        // Update the hover class to reflect the current player's turn.
        this.setBoardHoverClass();
    }

    // The `setBoardHoverClass` function updates the board's class for hover effects.
    setBoardHoverClass() {
        // First remove both potential hover classes.
        this.gameBoard.board.classList.remove(X_CLASS, CIRCLE_CLASS);
        // Then add the hover class corresponding to the player whose turn it is.
        this.gameBoard.board.classList.add(this.circleTurn ? CIRCLE_CLASS : X_CLASS);
    }
}

const game = new Game();
