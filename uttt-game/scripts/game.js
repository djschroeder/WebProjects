const X_CLASS = 'x';
const CIRCLE_CLASS = 'circle';

const WINNING_COMBINATIONS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6]             // diagonals
];

class Game {
    constructor() {
        this.gameBoard = new Board();
        this.circleTurn = false;
        this.activeMiniBoardIndex = null;
        this.winningMessageElement = document.getElementById('winningMessage');
        this.winningMessageTextElement = document.querySelector('[data-winning-message-text]');
        this.restartButton = document.getElementById('restartButton');
        this.restartButton.addEventListener('click', () => this.startGame());
        this.startGame();
    }

    startGame() {
        this.circleTurn = false;
        this.gameBoard.reset();
        this.gameBoard.setCellClickCallback(this.handleCellClick.bind(this));
        this.activateAllMiniBoards();
        this.setBoardHoverClass();
        this.winningMessageElement.classList.remove('show');
    }

    handleCellClick(miniBoardIndex, cellIndex) {
        if (!this.isActiveBoard(miniBoardIndex)) {
            return;
        }
        const miniBoard = this.gameBoard.getMiniBoard(miniBoardIndex);
        const currentPlayer = this.circleTurn ? CIRCLE_CLASS : X_CLASS;
        if (miniBoard.markCell(currentPlayer, cellIndex)) {
            this.processMove(miniBoard, cellIndex);
        }
    }

    isActiveBoard(miniBoardIndex) {
        return this.activeMiniBoardIndex === null ||
               this.activeMiniBoardIndex === miniBoardIndex ||
               this.gameBoard.getMiniBoard(this.activeMiniBoardIndex).getWinner() !== null;
    }

    activateAllMiniBoards() {
        this.gameBoard.miniBoards.forEach(mb => {
            mb.miniBoard.classList.add('active-mini-board');
        });
        this.activeMiniBoardIndex = null; // No specific active mini-board at the start
    }

    processMove(miniBoard, cellIndex) {
        this.checkWinner();
        this.swapTurns();

        // Update active mini-board
        const nextMiniBoard = this.gameBoard.getMiniBoard(cellIndex);
        this.gameBoard.miniBoards.forEach(mb => mb.miniBoard.classList.remove('active-mini-board'));
        if (nextMiniBoard.getWinner() === null) {
            nextMiniBoard.miniBoard.classList.add('active-mini-board');
            this.activeMiniBoardIndex = cellIndex;
        } else {
            this.activeMiniBoardIndex = null;
            this.gameBoard.miniBoards.forEach(mb => {
                if (mb.getWinner() === null) {
                    mb.miniBoard.classList.add('active-mini-board');
                }
            });
        }
    }

    checkWinner() {
        const currentPlayer = this.circleTurn ? CIRCLE_CLASS : X_CLASS;
        if (this.gameBoard.checkWin(currentPlayer)) {
            this.endGame(false);
        } else if (this.gameBoard.checkDraw()) {
            this.endGame(true);
        }
    }

    endGame(draw) {
        this.winningMessageTextElement.innerText = draw ? `Draw!` : `${this.circleTurn ? "O's" : "X's"} Win!`;
        this.winningMessageElement.classList.add('show');
    }

    swapTurns() {
        this.circleTurn = !this.circleTurn;
        this.setBoardHoverClass();
    }

    setBoardHoverClass() {
        this.gameBoard.board.classList.remove(X_CLASS, CIRCLE_CLASS);
        this.gameBoard.board.classList.add(this.circleTurn ? CIRCLE_CLASS : X_CLASS);
    }
}

const game = new Game();
