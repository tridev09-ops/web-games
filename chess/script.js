// Create the chess board
const board = document.querySelector('.board');
const squares = {};

// Piece mapping
const pieces = {
    R: 'Rook',
    N: 'Knight',
    B: 'Bishop',
    Q: 'Queen',
    K: 'King',
    P: 'Pawn'
};

// Initial board setup
const gameBoard = [
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'], // Row 0 - Black back rank
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'], // Row 1 - Black pawns
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'], // Row 6 - White pawns
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']  // Row 7 - White back rank
];

let currentPlayer = "black" // black / white
let selectedPiece = null; // Store the selected piece's position as [row, col]
const validMoves = []; // Store valid moves for the selected piece

const drawBoard = () => {
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const square = document.createElement('div');
            square.className = 'square';

            // Alternate colors: light and dark
            const isLight = (row + col) % 2 === 0;
            square.classList.add(isLight ? 'light' : 'dark');

            // Add data attributes for position
            square.dataset.row = row;
            square.dataset.col = col;

            // Store square reference
            squares[`${row}-${col}`] = square;

            // Add piece if exists
            const piece = gameBoard[row][col];
            if (piece) {
                const isWhite = piece === piece.toUpperCase();
                const pieceName = pieces[piece.toUpperCase()];
                const color = isWhite ? 'White' : 'Black';
                const img = document.createElement('img');
                img.src = `assets/peices/${pieceName}, ${color}.svg`;
                img.style.height = '75%';
                square.appendChild(img);
            }

            board.appendChild(square);
        }
    }
}

drawBoard()

const getPieceAt = (row, col) => {
    return gameBoard[row][col];
}

const isValidMove = (fromRow, fromCol, toRow, toCol) => {
    const piece = getPieceAt(fromRow, fromCol);
    if (!piece) return false; // No piece to move

    if (fromRow === toRow && fromCol === toCol) return false; // Can't move to the same square

    if (piece.toUpperCase() === 'P') {
        // Pawn move logic
        const direction = piece === 'P' ? -1 : 1; // White pawns move up, black pawns move down
        if (fromCol === toCol) {
            // Move forward
            if (toRow === fromRow + direction && !getPieceAt(toRow, toCol)) {
                return true; // Move one square forward
            }

            // Initial two-square move
            if ((piece === 'P' && fromRow === 6) || (piece === 'p' && fromRow === 1)) {
                if (toRow === fromRow + 2 * direction && !getPieceAt(toRow, toCol) && !getPieceAt(fromRow + direction, toCol)) {
                    return true; // Move two squares forward
                }
            }
        }
    }

};

const highlightValidMoves = (row, col) => {
    const piece = getPieceAt(row, col);
    if (!piece) return;
    if (piece.toUpperCase() === 'P') {
        const direction = piece === 'P' ? -1 : 1;
        // Highlight one square forward
        if (isValidMove(row, col, row + direction, col)) {
            squares[`${row + direction}-${col}`].classList.add('valid-move');
            validMoves.push([row + direction, col]);
        }
        // Highlight two squares forward from initial position
        if ((piece === 'P' && row === 6) || (piece === 'p' && row === 1)) {
            if (isValidMove(row, col, row + 2 * direction, col)) {
                squares[`${row + 2 * direction}-${col}`].classList.add('valid-move');
                validMoves.push([row + 2 * direction, col]);
            }
        }
    }
}

const movePiece = (fromRow, fromCol, toRow, toCol) => {
    if (!isValidMove(fromRow, fromCol, toRow, toCol)) {
        console.log(`Invalid move from ${fromRow}, ${fromCol} to ${toRow}, ${toCol}`);
        return false;
    }
    gameBoard[toRow][toCol] = gameBoard[fromRow][fromCol];
    gameBoard[fromRow][fromCol] = null;
    // Update the board visually
    const fromSquare = squares[`${fromRow}-${fromCol}`];
    const toSquare = squares[`${toRow}-${toCol}`];

    // move the piece image from the fromSquare to the toSquare
    const pieceImage = fromSquare.querySelector('img');
    if (pieceImage) {
        toSquare.appendChild(pieceImage);
    }

    // Remove the selected class from the fromSquare
    fromSquare.classList.remove('selected');


}

board.addEventListener('click', (e) => {
    const square = e.target.closest('.square');

    if (!square) return;
    const row = parseInt(square.dataset.row);
    const col = parseInt(square.dataset.col);

    if (selectedPiece) {
        // Move piece logic here
        const [fromRow, fromCol] = selectedPiece;
        movePiece(fromRow, fromCol, row, col);

        const fromSquare = squares[`${row}-${col}`];

        // Remove the selected class from the fromSquare
        fromSquare.classList.remove('selected');

        selectedPiece = null; // Reset selection after move

        // Remove the valid-move class from all squares
        validMoves.forEach(([r, c]) => {
            squares[`${r}-${c}`].classList.remove('valid-move');
        });
        validMoves.length = 0; // Clear the validMoves array
    } else {
        // Select piece logic here
        const piece = getPieceAt(row, col);
        if (piece) {
            selectedPiece = [row, col];
            const fromSquare = squares[`${row}-${col}`];

            // Add a visual indication for the selected piece
            fromSquare.classList.add('selected');
            // console.log(`Selected piece at: ${row}, ${col}`);

            highlightValidMoves(row, col);
        }
    }
})