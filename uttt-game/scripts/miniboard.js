class MiniBoard {
    constructor(index, onCellClicked) {
        this.index = index;
        this.onCellClicked = onCellClicked;
        this.miniBoard = document.createElement('div');
        this.miniBoard.className = 'mini-board';
        this.miniBoard.setAttribute('data-mini-board', index);
        this.cells = [];
        this.cellEventListeners = [];
        this.winner = null; // null, X_CLASS, CIRCLE_CLASS, or 'draw'
        this.createCells();
    }

    createCells() {
        for (let c = 0; c < 9; c++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.setAttribute('data-cell', '');
            const cellClickListener = () => {
                if (this.winner === null && 
                    !cell.classList.contains(X_CLASS) && 
                    !cell.classList.contains(CIRCLE_CLASS)) 
                {
                    this.onCellClicked(this.index, c);
                }
            };
            cell.addEventListener('click', cellClickListener);
            this.cellEventListeners[c] = cellClickListener;
            this.miniBoard.appendChild(cell);
            this.cells.push(cell);
        }
    }

    markCell(playerClass, cellIndex) {
        const cell = this.cells[cellIndex];
        if (this.winner === null && 
            !cell.classList.contains(X_CLASS) &&       
            !cell.classList.contains(CIRCLE_CLASS)) 
        {
            cell.classList.add(playerClass);
            this.updateState(playerClass);
            return true;
        }
        return false;
    }

    updateState(playerClass) {
        if (this.checkWin(playerClass)) {
            this.winner = playerClass;
            this.miniBoard.classList.add(playerClass);
        } else if (this.checkDraw()) {
            this.winner = 'draw';
            this.miniBoard.classList.add('draw');
        }
        if (this.winner !== null) {
            this.removeClickListeners();
        }
    }

    checkWin(playerClass) {
        return WINNING_COMBINATIONS.some(combination => {
            return combination.every(index => 
                this.cells[index].classList.contains(playerClass));
        });
    }

    checkDraw() {
        return this.cells.every(cell => cell.classList.contains(X_CLASS) || 
                                        cell.classList.contains(CIRCLE_CLASS));
    }

    getWinner() {
        return this.winner;
    }

    removeClickListeners() {
        this.cells.forEach((cell, index) => {
            const listener = this.cellEventListeners[index];
            cell.classList.remove(X_CLASS, CIRCLE_CLASS);
            cell.removeEventListener('click', listener);
        });
    }

    reset() {
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
