// Board class represents the main game board and manages mini-boards
class Board {
    constructor() {
        // The main board DOM element
        this.board = document.getElementById('board');
        // Array to hold all mini-board instances
        this.miniBoards = [];
        // Function to be called when a cell is clicked
        this.cellClickCallback = null;
        // Initialize the board with mini-boards
        this.createBoard();
    }

    // Creates and initializes mini-boards
    createBoard() {
        // Clear any existing content in the main board
        this.board.innerHTML = '';
        // Reset miniBoards array
        this.miniBoards = [];

        // Create 9 mini-boards, one for each cell of the main board
        for (let i = 0; i < 9; i++) {
            // Create a MiniBoard instance with an index and a callback for cell clicks
            const miniBoard = new MiniBoard(i, (miniBoardIndex, cellIndex) => {
                // When a cell is clicked, invoke the callback if it's set
                if (this.cellClickCallback) {
                    this.cellClickCallback(miniBoardIndex, cellIndex);
                }
            });
            // Add the mini-board to the array and the main board DOM element
            this.miniBoards.push(miniBoard);
            this.board.appendChild(miniBoard.miniBoard);
        }
    }

    // Sets the callback function for cell clicks
    setCellClickCallback(callback) {
        this.cellClickCallback = callback;
    }

    // Checks if the specified player has won the game
    checkWin(playerClass) {
        // Iterate over all winning combinations to see if any are fulfilled
        return WINNING_COMBINATIONS.some(combination => {
            // For a win, all mini-boards in a combination must be won by the player
            return combination.every(index => {
                const miniBoard = this.miniBoards[index];
                return miniBoard.getWinner() === playerClass;
            });
        });
    }

    // Checks if the game has ended in a draw
    checkDraw() {
        // If all mini-boards have a winner (or 'draw'), the game is a draw
        return this.miniBoards.every(miniBoard => miniBoard.getWinner() !== null);
    }

    // Resets the board for a new game
    reset() {
        // Call reset on each mini-board to clear them
        this.miniBoards.forEach(miniBoard => miniBoard.reset());
    }

    // Retrieves a specific mini-board by index
    getMiniBoard(index) {
        return this.miniBoards[index];
    }
}
