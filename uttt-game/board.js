class Board {
    constructor() {
        this.board = document.getElementById('board');
        this.miniBoards = [];
        this.cellClickCallback = null;
        this.createBoard();
    }

    createBoard() {
        this.board.innerHTML = '';
        this.miniBoards = [];

        for (let i = 0; i < 9; i++) {
            const miniBoard = new MiniBoard(i, (miniBoardIndex, cellIndex) => {
                if (this.cellClickCallback) {
                    this.cellClickCallback(miniBoardIndex, cellIndex);
                }
            });
            this.miniBoards.push(miniBoard);
            this.board.appendChild(miniBoard.miniBoard);
        }
    }

    setCellClickCallback(callback) {
        this.cellClickCallback = callback;
    }

    checkWin(playerClass) {
        return WINNING_COMBINATIONS.some(combination => {
            return combination.every(index => {
                const miniBoard = this.miniBoards[index];
                return miniBoard.getWinner() === playerClass;
            });
        });
    }

    checkDraw() {
        return this.miniBoards.every(miniBoard => miniBoard.getWinner() !== null);
    }

    reset() {
        this.miniBoards.forEach(miniBoard => miniBoard.reset());
    }

    getMiniBoard(index) {
        return this.miniBoards[index];
    }
}
