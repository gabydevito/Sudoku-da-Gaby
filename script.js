let board = [];
let solution = [];
let errorCount = 0;
let startTime;
let timerInterval;
let currentMusic = true;

const difficulties = {
  easy: 40,
  medium: 30,
  hard: 20
};

function startGame() {
  document.getElementById('intro').style.display = 'none';
  document.getElementById('game-container').style.display = 'block';
  newGame();
  startTimer();
}

function startTimer() {
  startTime = Date.now();
  timerInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const minutes = String(Math.floor(elapsed / 60)).padStart(2, '0');
    const seconds = String(elapsed % 60).padStart(2, '0');
    document.getElementById('timer').textContent = `Tempo: ${minutes}:${seconds}`;
  }, 1000);
}

function toggleMusic() {
  const music = document.getElementById('bg-music');
  currentMusic = !currentMusic;
  music.muted = !currentMusic;
}

function playClickSound() {
  const sound = document.getElementById('click-sound');
  sound.currentTime = 0;
  sound.play();
}

document.addEventListener('click', playClickSound);

document.getElementById('difficulty').addEventListener('change', () => newGame());

function switchTheme(theme) {
  document.body.className = '';
  if (theme === 'pastel') {
    document.body.classList.add('theme-pastel');
  } else if (theme === 'dark') {
    document.body.classList.add('theme-dark');
  }
}

function restartGame() {
  renderBoard(board);
  errorCount = 0;
  document.getElementById('error-count').textContent = 'Erros: 0';
  startTime = Date.now();
}

function newGame() {
  const difficulty = document.getElementById('difficulty').value;
  const clues = difficulties[difficulty];
  solution = generateFullSudoku();
  board = removeCells(solution, clues);
  renderBoard(board);
  errorCount = 0;
  document.getElementById('error-count').textContent = 'Erros: 0';
  startTime = Date.now();
}

function renderBoard(puzzle) {
  const boardDiv = document.getElementById('sudoku-board');
  boardDiv.innerHTML = '';

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const cell = document.createElement('input');
      cell.setAttribute('maxlength', 1);
      cell.dataset.row = row;
      cell.dataset.col = col;

      const value = puzzle[row][col];
      if (value !== 0) {
        cell.value = value;
        cell.disabled = true;
        cell.className = 'cell fixed';
      } else {
        cell.className = 'cell editable';
        cell.addEventListener('input', handleInput);
      }

      boardDiv.appendChild(cell);
    }
  }
}

function handleInput(e) {
  const input = e.target;
  const row = parseInt(input.dataset.row);
  const col = parseInt(input.dataset.col);
  const value = parseInt(input.value);

  if (!value || value < 1 || value > 9) {
    input.value = '';
    return;
  }

  if (!isMoveValid(board, row, col, value)) {
    input.classList.add('error');
    setTimeout(() => input.classList.remove('error'), 500);
    errorCount++;
    document.getElementById('error-count').textContent = `Erros: ${errorCount}`;
    input.value = '';
  } else {
    board[row][col] = value;
  }
}

function isMoveValid(grid, row, col, num) {
  for (let i = 0; i < 9; i++) {
    if (grid[row][i] === num || grid[i][col] === num) return false;
  }

  const startRow = row - (row % 3);
  const startCol = col - (col % 3);
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (grid[startRow + i][startCol + j] === num) return false;
    }
  }

  return true;
}

function checkSudoku() {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const input = document.querySelector(`input[data-row='${row}'][data-col='${col}']`);
      const value = parseInt(input.value);
      if (!value || value !== solution[row][col]) {
        alert("Sudoku incompleto ou incorreto. Continue tentando!");
        return;
      }
    }
  }
  alert("Parabéns, Sudoku completo corretamente!");
}

function generateFullSudoku() {
  let grid = Array.from({ length: 9 }, () => Array(9).fill(0));

  function fillGrid() {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === 0) {
          const numbers = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
          for (let num of numbers) {
            if (isMoveValid(grid, row, col, num)) {
              grid[row][col] = num;
              if (fillGrid()) return true;
              grid[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  fillGrid();
  return grid;
}

function removeCells(grid, clues) {
  let puzzle = grid.map(row => [...row]);
  let count = 81 - clues;
  while (count > 0) {
    let row = Math.floor(Math.random() * 9);
    let col = Math.floor(Math.random() * 9);
    if (puzzle[row][col] !== 0) {
      puzzle[row][col] = 0;
      count--;
    }
  }
  return puzzle;
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
