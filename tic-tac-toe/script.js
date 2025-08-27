// Select DOM elements
const btns = document.querySelectorAll('.board .cell');
const reset = document.querySelector('.reset');
const statusMessage = document.querySelector('.status-message');
const onOff = document.querySelector('#on-off');

// Game state variables
let isPlayerMove = true;
let xPattern = [];
let oPattern = [];
let isGameOver = false;

// on off Computer
let isComputerOn = false;

// Scoreboard variables
let playerScore = 0;
let computerScore = 0;
let drawScore = 0;

// Scoreboard display elements
const playerScoreDisplay = document.getElementById('player-score');
const computerScoreDisplay = document.getElementById('computer-score');
const drawScoreDisplay = document.getElementById('draw-score');

// Winning combinations
const winningPattern = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
];

// Function to update the status message
const updateStatusMessage = (message) => {
    statusMessage.textContent = message;
};

// Function to highlight winning cells
const highlightWinningCells = (combo) => {
    combo.forEach((index) => {
        btns[index].classList.add('highlight');
    });
};

// Function to check winner
const checkWinner = () => {
    const hasWon = (pattern) => {
        return winningPattern.find((combo) =>
            combo.every((index) => pattern.includes(index))
        );
    };

    const xWinCombo = hasWon(xPattern);
    const oWinCombo = hasWon(oPattern);

    if (xWinCombo) {
        highlightWinningCells(xWinCombo);
        updateStatusMessage("Player (X) wins!");
        playerScore++;
        playerScoreDisplay.textContent = playerScore;
        isGameOver = true;
    } else if (oWinCombo) {
        highlightWinningCells(oWinCombo);
        updateStatusMessage("Computer (O) wins!");
        computerScore++;
        computerScoreDisplay.textContent = computerScore;
        isGameOver = true;
    } else if (xPattern.length + oPattern.length === 9) {
        updateStatusMessage("It's a draw!");
        drawScore++;
        drawScoreDisplay.textContent = drawScore;
        isGameOver = true;
    }
};

// Event listener for cell clicks
btns.forEach((btn, index) => {
    btn.addEventListener('click', () => {
        if (isGameOver || btn.textContent) return; // Prevent moves on filled or finished game

        // Assign "X" or "O" based on current turn
        if (isPlayerMove || isComputerOn) {
            btn.textContent = "X";
            btn.classList.add("X");
            xPattern.push(index);
            updateStatusMessage("Computer (O)'s turn.");

            if (isComputerOn) {
                let random = parseInt(Math.random()*9);
                while (true) {
                    if (!btns[random].textContent)break;
                    random = parseInt(Math.random()*9);
                }
                setTimeout(()=> {
                    btns[random].textContent = "O";
                    btns[random].classList.add("O");
                    oPattern.push(random);
                    updateStatusMessage("Player (X)'s turn.");

                }, 500)
            }
        } else {
            if (!isComputerOn) {
                btn.textContent = "O";
                btn.classList.add("O");
                oPattern.push(index);
                updateStatusMessage("Player (X)'s turn.");
            }
        }

        isPlayerMove = !isPlayerMove; // Switch turn
        checkWinner(); // Check for a winner
    });
});


// Reset button functionality
reset.addEventListener('click', () => {
    btns.forEach((btn) => {
        btn.textContent = '';
        btn.classList.remove('X', 'O', 'highlight');
    });
    xPattern = [];
    oPattern = [];
    isPlayerMove = true;
    isGameOver = false;
    updateStatusMessage("Game reset! Player (X)'s turn.");
});

onOff.addEventListener('change', ()=> {
    isComputerOn=!isComputerOn;
})

// Initial message
updateStatusMessage("Player (X)'s turn.");