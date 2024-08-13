document.addEventListener('DOMContentLoaded', () => {
    const boardElement = document.getElementById('board');
    const statusElement = document.getElementById('status');
    const startGameButton = document.getElementById('start-game');

    let gameId = null;

    function createBoard() {
        boardElement.innerHTML = '';
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.position = i;
            cell.addEventListener('click', handleCellClick);
            boardElement.appendChild(cell);
        }
    }

    function handleCellClick(event) {
        const position = event.target.dataset.position;

        fetch(`http://localhost:3000/game/${gameId}/move`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ position })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                statusElement.textContent = data.error;
            } else {
                updateBoard(data.board);
                statusElement.textContent = data.status;
            }
        });
    }

    function updateBoard(board) {
        const cells = boardElement.getElementsByClassName('cell');
        for (let i = 0; i < board.length; i++) {
            cells[i].textContent = board[i] ? board[i] : '';
        }
    }

    function startNewGame() {
        fetch(`http://localhost:3000/game/start`, {
            method: 'POST'
        })
        .then(response => response.json())
        .then(data => {
            gameId = data.gameId;
            createBoard();
            statusElement.textContent = 'Game started. Player X\'s turn.';
        });
    }

    startGameButton.addEventListener('click', startNewGame);
    startNewGame();
});
