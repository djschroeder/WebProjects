// Constants representing player classes
const X_CLASS = 'x';
const CIRCLE_CLASS = 'circle';

// Winning combinations for the Tic Tac Toe board
const WINNING_COMBINATIONS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3 ,6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6]             // diagonals
];

// Get board element from the DOM
const board = document.getElementById('board');
const restartButton = document.getElementById('restartButton');
// Get element to set winning message text
const winningMessageTextElement = document.querySelector('[data-winning-message-text]');
const winningMessageElement = document.getElementById('winningMessage');

// Variable to track the turn
let circleTurn;

// Start the game
startGame();

restartButton.addEventListener('click', startGame)

// Initializes the game
function startGame() {
    circleTurn = false;
    createMainBoard();
    setBoardHoverClass();   
    winningMessageElement.classList.remove('show');
}

// Creates Primary Game Board
function createMainBoard() {
    board.innerHTML = ''; // Clear board variable from prior game data
    for (let i = 0; i < 9; i++) {
        let miniBoard = createMiniBoard(i);
        board.appendChild(miniBoard);
    }
}

// Creates Secondary miniGame Boards
function createMiniBoard(boardIndex) {
    let miniBoard = document.createElement('div');
    miniBoard.className = 'mini-board';
    miniBoard.setAttribute('data-mini-board', boardIndex);
    for (let j = 0; j <= 8; j++) {
        let cell = document.createElement('div');
        cell.className = 'cell';
        cell.setAttribute('data-cell', '');
        cell.addEventListener('click', handleClick, { once: true });
        miniBoard.appendChild(cell);
    }
    return miniBoard;
}

// Handles cell click events
function handleClick(e) {
    const cell = e.target;
    const miniBoard = findMiniBoard(cell);
    const currentPlayer = circleTurn ? CIRCLE_CLASS : X_CLASS;
    placeMark(cell, currentPlayer);
    // Additional game logic (win, draw, switch turns) goes here
    if (checkWinMiniBoard(miniBoard, currentPlayer)) {
        console.log('Mini-board winner');
        markMiniBoardAsWon(miniBoard, currentPlayer); 
        if (checkWinMainBoard(currentPlayer)) { 
            console.log('MAIN BOARD WINNER');
            endGame(false);
        }
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
        setBoardHoverClass();
    }
}

// Checks if the current player has won
function checkWinMiniBoard(miniBoard, currentPlayer) {
    const cells = miniBoard.querySelectorAll('.cell');
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return cells[index].classList.contains(currentPlayer);
        });
    });
}

// Check for win in the main board
function checkWinMainBoard(currentPlayer) {
    const miniBoards = board.querySelectorAll('.mini-board')
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return miniBoards[index].classList.contains(currentPlayer);
        });
    });
}

// Mark the mini-board as won
function markMiniBoardAsWon(miniBoard, currentPlayer) {
    const cells = miniBoard.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.classList.remove(X_CLASS);
        cell.classList.remove(CIRCLE_CLASS);
        cell.removeEventListener('click', handleClick);
    });
    miniBoard.classList.add(`${currentPlayer}`);
}

function findMiniBoard(cell) {
    return cell.closest('.mini-board');
}

function isDraw() {
    const cells = board.querySelectorAll('.cell');
    return [...cells].every(cell => {
        return cell.classList.contains(X_CLASS) || 
               cell.classList.contains(CIRCLE_CLASS)
    })
}

function endGame(draw) {
    if (draw) {
        winningMessageTextElement.innerText = `Draw!`;
    } else {
        console.log('Game Over');
        winningMessageTextElement.innerText = `${circleTurn ? "O's" : "X's"} Win!`;
    }
    console.log('Here')
    winningMessage.classList.add('show');
}

// Places a mark in the cell
function placeMark(cell, currentPlayer) {
    cell.classList.add(currentPlayer);
}

// Switches the turn
function swapTurns() {
    circleTurn = !circleTurn;
}

// Updates the board's class for hover effects
function setBoardHoverClass() {
    board.classList.remove(X_CLASS);
    board.classList.remove(CIRCLE_CLASS);
    if (circleTurn) {
        board.classList.add(CIRCLE_CLASS);
    } else {
        board.classList.add(X_CLASS);
    }
}

