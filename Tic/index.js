const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors()); 
app.use(express.json());

const games = {};

function checkWinner(board) {
    const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], 
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]             
    ];
    for (let [a, b, c] of lines) {
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    return board.includes(null) ? null : 'Draw';
}

function createBoard() {
    return Array(9).fill(null);
}

// API Routes
app.post('/game/start', (req, res) => {
    const gameId = Date.now().toString();
    games[gameId] = {
        board: createBoard(),
        turn: 'X',
        status: 'ongoing'
    };
    res.json({ gameId });
});

app.post('/game/:gameId/move', (req, res) => {
    const { gameId } = req.params;
    const { position } = req.body;

    if (!games[gameId]) {
        return res.status(404).json({ error: 'Game not found' });
    }

    const game = games[gameId];
    if (game.status !== 'ongoing') {
        return res.status(400).json({ error: 'Game is over' });
    }

    if (position < 0 || position > 8 || game.board[position]) {
        return res.status(400).json({ error: 'Invalid move' });
    }

    game.board[position] = game.turn;
    const winner = checkWinner(game.board);

    if (winner) {
        game.status = winner === 'Draw' ? 'Draw' : `Won by ${winner}`;
    } else {
        game.turn = game.turn === 'X' ? 'O' : 'X';
    }

    res.json({ board: game.board, turn: game.turn, status: game.status });
});

app.get('/game/:gameId', (req, res) => {
    const { gameId } = req.params;
    if (!games[gameId]) {
        return res.status(404).json({ error: 'Game not found' });
    }

    const game = games[gameId];
    res.json({ board: game.board, turn: game.turn, status: game.status });
});

app.listen(port, () => {
    console.log(`Tic-Tac-Toe server running at http://localhost:${port}`);
});
