document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const result = document.getElementById('result');
    const resetBtn = document.getElementById('resetBtn');
    const difficultySelector = document.getElementById('difficultySelector');

    let currentPlayer = 'X';
    let boardState = ['', '', '', '', '', '', '', '', ''];
    let gameActive = true;
    let currentDifficulty = 1; // Default difficulty is medium

    // Create the Tic Tac Toe board dynamically
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = i;
        cell.addEventListener('click', handleCellClick);
        board.appendChild(cell);
    }

    function handleCellClick(event) {
        const index = event.target.dataset.index;

        if (boardState[index] === '' && gameActive) {
            boardState[index] = currentPlayer;
            event.target.textContent = currentPlayer;
            
            if (checkWin()) {
                result.textContent = `${currentPlayer} wins!`;
                gameActive = false;
            } else if (boardState.every(cell => cell !== '')) {
                result.textContent = 'It\'s a draw!';
                gameActive = false;
            } else {
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                if (currentPlayer === 'O') {
                    // Bot's turn
                    setTimeout(() => makeBotMove(currentDifficulty), 500);
                }
            }
        }
    }

    function makeBotMove(difficulty) {
        switch (difficulty) {
            case 0:
                makeRandomMove();
                break;
            case 1:
                makeMediumMove();
                break;
            case 2:
                makeHardMove();
                break;
            default:
                makeRandomMove();
        }
    }

    function makeRandomMove() {
        const emptyCells = getEmptyCells();

        if (emptyCells.length > 0 && gameActive) {
            const randomIndex = Math.floor(Math.random() * emptyCells.length);
            const botMove = emptyCells[randomIndex];

            makeMove(botMove);
        }
    }

    function makeMediumMove() {
        const playerSymbol = currentPlayer === 'X' ? 'O' : 'X';
        const winningMove = getWinningMove(playerSymbol);

        if (winningMove !== -1) {
            makeMove(winningMove);
        } else {
            makeRandomMove();
        }
    }

    function makeHardMove() {
        const bestMove = minimax(boardState, currentPlayer).index;
        makeMove(bestMove);
    }

    function getWinningMove(symbol) {
        for (let i = 0; i < boardState.length; i++) {
            if (boardState[i] === '') {
                boardState[i] = symbol;
                if (checkWin()) {
                    boardState[i] = '';
                    return i;
                }
                boardState[i] = '';
            }
        }
        return -1;
    }

    function minimax(newBoard, player) {
        const availableSpots = getEmptyCells();

        if (checkWin()) {
            return player === 'O' ? { score: -1 } : { score: 1 };
        } else if (availableSpots.length === 0) {
            return { score: 0 };
        }

        const moves = [];
        for (let i = 0; i < availableSpots.length; i++) {
            const move = {};
            move.index = availableSpots[i];
            newBoard[availableSpots[i]] = player;

            if (player === 'O') {
                const result = minimax(newBoard, 'X');
                move.score = result.score;
            } else {
                const result = minimax(newBoard, 'O');
                move.score = result.score;
            }

            newBoard[availableSpots[i]] = '';

            moves.push(move);
        }

        let bestMove;
        if (player === 'O') {
            let bestScore = -Infinity;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score > bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score < bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }

        return moves[bestMove];
    }

    function getEmptyCells() {
        return boardState.reduce((acc, cell, index) => {
            if (cell === '') {
                acc.push(index);
            }
            return acc;
        }, []);
    }

    function makeMove(index) {
        boardState[index] = currentPlayer;
        document.querySelector(`.cell[data-index="${index}"]`).textContent = currentPlayer;

        if (checkWin()) {
            result.textContent = `${currentPlayer} wins!`;
            gameActive = false;
        } else if (boardState.every(cell => cell !== '')) {
            result.textContent = 'It\'s a draw!';
            gameActive = false;
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        }
    }

    function checkWin() {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]              // Diagonals
        ];

        return winPatterns.some(pattern => {
            const [a, b, c] = pattern;
            return boardState[a] !== '' && boardState[a] === boardState[b] && boardState[b] === boardState[c];
        });
    }

    function resetGame() {
        currentPlayer = 'X';
        boardState = ['', '', '', '', '', '', '', '', ''];
        gameActive = true;
        result.textContent = '';
        document.querySelectorAll('.cell').forEach(cell => {
            cell.textContent = '';
        });
        if (currentPlayer === 'O') {
            setTimeout(() => makeBotMove(currentDifficulty), 500);
        }
    }

    resetBtn.addEventListener('click', resetGame);

    difficultySelector.addEventListener('change', (event) => {
        currentDifficulty = parseInt(event.target.value);
        resetGame();
    });
});
