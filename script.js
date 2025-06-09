const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const resetButton = document.getElementById('reset');
const difficultySelect = document.getElementById('difficulty');

let currentPlayer = 'X';
let board = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;

const winConditions = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

function handleCellClick(e) {
  const index = e.target.getAttribute('data-index');

  if (board[index] !== "" || !gameActive || currentPlayer !== 'X') return;

  makeMove(index, 'X');

  if (gameActive) {
    setTimeout(() => {
      const botIndex = getBotMove();
      makeMove(botIndex, 'O');
    }, 500);
  }
}

function makeMove(index, player) {
  board[index] = player;
  cells[index].textContent = player;

  if (checkWin(player)) {
    statusText.textContent = `${player} wins! 🎉`;
    gameActive = false;
    return;
  }

  if (board.every(cell => cell !== "")) {
    statusText.textContent = "It's a draw! 🤝";
    gameActive = false;
    return;
  }

  currentPlayer = player === 'X' ? 'O' : 'X';
  statusText.textContent = `Player ${currentPlayer}'s turn`;
}

function checkWin(player) {
  return winConditions.some(condition =>
    condition.every(index => board[index] === player)
  );
}

function getBotMove() {
  const difficulty = difficultySelect.value;

  const emptyIndices = board.map((val, i) => val === "" ? i : null).filter(v => v !== null);

  if (difficulty === 'easy') {
    // Random move
    return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  }

  if (difficulty === 'medium') {
    // 50% chance minimax, 50% random
    if (Math.random() < 0.5) {
      return getBestMove();
    } else {
      return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    }
  }

  // Hard: Always use MiniMax
  return getBestMove();
}

function getBestMove() {
  let bestScore = -Infinity;
  let move;

  board.forEach((cell, index) => {
    if (cell === "") {
      board[index] = 'O';
      let score = minimax(board, 0, false);
      board[index] = "";
      if (score > bestScore) {
        bestScore = score;
        move = index;
      }
    }
  });

  return move;
}

function minimax(newBoard, depth, isMaximizing) {
  if (checkWin('O')) return 10 - depth;
  if (checkWin('X')) return depth - 10;
  if (newBoard.every(cell => cell !== "")) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    newBoard.forEach((cell, index) => {
      if (cell === "") {
        newBoard[index] = 'O';
        let score = minimax(newBoard, depth + 1, false);
        newBoard[index] = "";
        bestScore = Math.max(score, bestScore);
      }
    });
    return bestScore;
  } else {
    let bestScore = Infinity;
    newBoard.forEach((cell, index) => {
      if (cell === "") {
        newBoard[index] = 'X';
        let score = minimax(newBoard, depth + 1, true);
        newBoard[index] = "";
        bestScore = Math.min(score, bestScore);
      }
    });
    return bestScore;
  }
}

function resetGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  gameActive = true;
  currentPlayer = 'X';
  statusText.textContent = "Player X's turn";
  cells.forEach(cell => cell.textContent = '');
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetGame);
