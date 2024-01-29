// MiniBoard class represents each individual tic-tac-toe grid within the main board
class MiniBoard {
    constructor(index, onCellClicked) {
        // Each mini-board has an index and a callback for when a cell is clicked
        this.index = index;
        this.onCellClicked = onCellClicked; // Callback function to handle cell clicks
        // Create the mini-board element with class and custom attribute for identification
        this.miniBoard = document.createElement('div');
        this.miniBoard.className = 'mini-board';
        this.miniBoard.setAttribute('data-mini-board', index);
        // Initialize cell elements and their event listeners
        this.cells = [];
        this.cellEventListeners = [];
        // Track the winner of the mini-board ('null' if no winner, 'draw' if it's a tie)
        this.winner = null;
        // Populate the mini-board with cells
        this.createCells();
    }

    // Creates the cell elements for the mini-board
    createCells() {
        for (let c = 0; c < 9; c++) {
            const cell = document.createElement('div');
            cell.className = 'cell'; // Each cell has a class for styling and event handling
            cell.setAttribute('data-cell', ''); // Data attribute for identifying cells
            // Click listener for cell which invokes the passed callback onCellClicked
            const cellClickListener = () => {
                // Only allow cell clicks if there's no winner and the cell isn't already taken
                if (this.winner === null && !cell.classList.contains(X_CLASS) && !cell.classList.contains(CIRCLE_CLASS)) {
                    this.onCellClicked(this.index, c);
                }
            };
            // Add event listener and store it for potential removal later
            cell.addEventListener('click', cellClickListener);
            this.cellEventListeners[c] = cellClickListener;
            // Append the cell to the mini-board's DOM element
            this.miniBoard.appendChild(cell);
            this.cells.push(cell); // Add cell to the cells array for tracking
        }
    }

    // Marks a cell with the current player's class if the move is legal
    markCell(playerClass, cellIndex) {
        const cell = this.cells[cellIndex];
        // Check if the cell is empty and the mini-board has no winner
        if (this.winner === null && !cell.classList.contains(X_CLASS) && !cell.classList.contains(CIRCLE_CLASS)) {
            cell.classList.add(playerClass); // Mark the cell with the player's class
            this.updateState(playerClass); // Update the state of the mini-board after the mark
            return true; // Indicate a successful mark
        }
        return false; // Indicate the cell was not marked (invalid move)
    }

    // Updates the state of the mini-board, checking for a win or a draw
    updateState(playerClass) {
        if (this.checkWin(playerClass)) {
            // If there's a win, set the winner and update the mini-board's appearance
            this.winner = playerClass;
            this.miniBoard.classList.add(playerClass);
        } else if (this.checkDraw()) {
            // If there's a draw, set the winner as 'draw' and update appearance accordingly
            this.winner = 'draw';
            this.miniBoard.classList.add('draw');
        }
        // If the game has ended (win or draw), remove the click listeners to prevent further moves
        if (this.winner !== null) {
            this.removeClickListeners();
        }
    }

    // Checks if the current player has a winning combination
    checkWin(playerClass) {
        // Iterate through all winning combinations and check if any are met
        return WINNING_COMBINATIONS.some(combination => {
            return combination.every(index => this.cells[index].classList.contains(playerClass));
        });
    }

    // Checks if all cells are filled without a winner, which means a draw
    checkDraw() {
        // If all cells are marked and there's no winner, it's a draw
        return this.cells.every(cell => cell.classList.contains(X_CLASS) || cell.classList.contains(CIRCLE_CLASS));
    }

    // Getter to access the winner property from outside the class
    getWinner() {
        return this.winner;
    }

    // Removes the event listeners from the cells, stopping further interaction
    removeClickListeners() {
        this.cells.forEach((cell, index) => {
            const listener = this.cellEventListeners[index];
            // Remove the specific click listener attached to each cell
            cell.removeEventListener('click', listener);
            cell.classList.remove(X_CLASS, CIRCLE_CLASS);
        });
    }

    // Resets the mini-board to its initial state
    reset() {
        // Clear the winner and reset the class name to remove visual indications of win/draw
        this.winner = null;
        this.miniBoard.className = 'mini-board';
        this.cells.forEach((cell, index) => {
            cell.className = 'cell';
            cell.removeEventListener('click', this.cellEventListeners[index]);
            cell.addEventListener('click', this.cellEventListeners[index]);
            cell.classList.remove(X_CLASS, CIRCLE_CLASS);
        });
    }
}
