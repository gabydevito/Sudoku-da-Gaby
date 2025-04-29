let board = [];
let solution = [];
let errorCount = 0;
let startTime;
let timerInterval;
let currentMusic = true;

// Carregando a música
const music = new Audio('assets/musica.mp3');

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
  
  // Toca a música quando o jogo começa
  if (currentMusic) {
    music.play().catch((err) => {
      console.error('Erro ao tocar música:', err);
    });
  }
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
    setTimeout(() => input.classLi
