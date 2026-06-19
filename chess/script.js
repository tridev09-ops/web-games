// Create the chess board
const board = document.querySelector('.board');
const status = document.querySelector('.status');

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
    // ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'], // Row 1 - Black pawns
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'], // Row 6 - White pawns
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']  // Row 7 - White back rank
];

let currentPlayer = "black"; // black / white
let selectedPiece = null; // Store the selected piece's position as [row, col]
const validMoves = []; // Store valid moves for the selected piece

status.textContent = `It's ${currentPlayer}'s turn.`;

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

const getPieceColor = (row, col) => {
    const piece = getPieceAt(row, col);
    if (!piece) return null;
    return piece === piece.toUpperCase() ? 'white' : 'black';
}

const getPawnValidMoves = (row, col) => {
    const piece = getPieceAt(row, col);
    if (piece.toUpperCase() !== 'P') return [];

    const direction = piece === 'P' ? -1 : 1;
    const moves = [];

    // One square forward
    if (!getPieceAt(row + direction, col)) {
        moves.push([row + direction, col]);
    }

    // Two squares forward from initial position
    if ((piece === 'P' && row === 6) || (piece === 'p' && row === 1)) {
        if (!getPieceAt(row + 2 * direction, col)) {
            moves.push([row + 2 * direction, col]);
        }
    }

    return moves;
};

const getValidRookMoves = (row, col) => {
    const piece = getPieceAt(row, col);
    if (piece.toUpperCase() !== 'R') return [];

    const moves = [];
    const direction = piece === 'R' ? -1 : 1;

    // Check squares in the same row
    for (let c = 0; c < 8; c++) {
        if (c !== col) {
            moves.push([row, c]);

            if (getPieceAt(row, c)) {
                break;
            }
        }
    }

    // Check squares in the same column
    for (let r = 0; r < 8; r++) {
        if (r !== row) {
            moves.push([r, col]);

            if (getPieceAt(r, col)) {
                break;
            }
        }
    }

    return moves;
};

const getValidBishopMoves = (row, col) => {
    const piece = getPieceAt(row, col);
    if (piece.toUpperCase() !== 'B') return [];

    const moves = [];
    const directions = [
        [-1, -1], // Up-Left
        [-1, 1],  // Up-Right
        [1, -1],  // Down-Left
        [1, 1]    // Down-Right
    ];

    directions.forEach(([dr, dc]) => {
        let r = row + dr;
        let c = col + dc;
        while (r >= 0 && r < 8 && c >= 0 && c < 8) {
            if (!getPieceAt(r, c)) {
                moves.push([r, c]);
            } else {
                break; // Stop if there's a piece in the way
            }
            r += dr;
            c += dc;
        }
    });

    return moves;
};

const getValidKingMoves = (row, col) => {
    const piece = getPieceAt(row, col);
    if (piece.toUpperCase() !== 'K') return [];

    const moves = [];
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], [0, 1],
        [1, -1], [1, 0], [1, 1]
    ];

    directions.forEach(([dr, dc]) => {
        const r = row + dr;
        const c = col + dc;
        if (r >= 0 && r < 8 && c >= 0 && c < 8 && !getPieceAt(r, c)) {
            moves.push([r, c]);
        }
    });

    return moves;
};

const getValidQueenMoves = (row, col) => {
    const piece = getPieceAt(row, col);
    if (piece.toUpperCase() !== 'Q') return [];

    const moves = [];
    // Queen moves like rook (horizontal/vertical) + bishop (diagonal)
    const directions = [
        [-1, 0], [1, 0], [0, -1], [0, 1],  // Horizontal and vertical (Rook)
        [-1, -1], [-1, 1], [1, -1], [1, 1] // Diagonal (Bishop)
    ];

    directions.forEach(([dr, dc]) => {
        let r = row + dr;
        let c = col + dc;
        while (r >= 0 && r < 8 && c >= 0 && c < 8) {
            if (getPieceColor(r, c) !== getPieceColor(row, col)) {
                moves.push([r, c]);
            }
            if (getPieceAt(r, c)) {
                break;
            }
            r += dr;
            c += dc;
        }
    });

    return moves;
};

const getValidKnightMoves = (row, col) => {
    const piece = getPieceAt(row, col);
    if (piece.toUpperCase() !== 'N') return [];

    const moves = [];
    const knightMoves = [
        [-2, -1], [-2, 1],
        [-1, -2], [-1, 2],
        [1, -2], [1, 2],
        [2, -1], [2, 1]
    ];

    knightMoves.forEach(([dr, dc]) => {
        const r = row + dr;
        const c = col + dc;
        if (r >= 0 && r < 8 && c >= 0 && c < 8 && !getPieceAt(r, c)) {
            moves.push([r, c]);
        }
    });

    return moves;
}


const isValidMove = (fromRow, fromCol, toRow, toCol) => {
    const piece = getPieceAt(fromRow, fromCol);
    if (!piece) return false; // No piece to move

    if (fromRow === toRow && fromCol === toCol) return false; // Can't move to the same square

    if (piece.toUpperCase() === 'P') {
        const validPawnMoves = getPawnValidMoves(fromRow, fromCol);
        return validPawnMoves.some(([r, c]) => r === toRow && c === toCol);
    }
    if (piece.toUpperCase() === 'R') {
        const validRookMoves = getValidRookMoves(fromRow, fromCol);
        return validRookMoves.some(([r, c]) => r === toRow && c === toCol);
    }
    if (piece.toUpperCase() === 'B') {
        const validBishopMoves = getValidBishopMoves(fromRow, fromCol);
        return validBishopMoves.some(([r, c]) => r === toRow && c === toCol);
    }
    if (piece.toUpperCase() === 'K') {
        const validKingMoves = getValidKingMoves(fromRow, fromCol);
        return validKingMoves.some(([r, c]) => r === toRow && c === toCol);
    }
    if (piece.toUpperCase() === 'Q') {
        const validQueenMoves = getValidQueenMoves(fromRow, fromCol);
        return validQueenMoves.some(([r, c]) => r === toRow && c === toCol);
    }
    if (piece.toUpperCase() === 'N') {
        const validKnightMoves = getValidKnightMoves(fromRow, fromCol);
        return validKnightMoves.some(([r, c]) => r === toRow && c === toCol);
    }
};

const highlightValidMoves = (row, col) => {
    const piece = getPieceAt(row, col);
    if (!piece) return;

    if (piece.toUpperCase() === 'P') {
        const validPawnMoves = getPawnValidMoves(row, col);
        drawValidMoveIndicators(validPawnMoves);
    }
    if (piece.toUpperCase() === 'R') {
        const validRookMoves = getValidRookMoves(row, col);
        drawValidMoveIndicators(validRookMoves);
    }
    if (piece.toUpperCase() === 'B') {
        const validBishopMoves = getValidBishopMoves(row, col);
        drawValidMoveIndicators(validBishopMoves);
    }
    if (piece.toUpperCase() === 'K') {
        const validKingMoves = getValidKingMoves(row, col);
        drawValidMoveIndicators(validKingMoves);
    }
    if (piece.toUpperCase() === 'Q') {
        const validQueenMoves = getValidQueenMoves(row, col);
        drawValidMoveIndicators(validQueenMoves);
    }
    if (piece.toUpperCase() === 'N') {
        const validKnightMoves = getValidKnightMoves(row, col);
        drawValidMoveIndicators(validKnightMoves);
    }
}

const drawValidMoveIndicators = (validPieceMoves) => {
    validPieceMoves.forEach(([r, c]) => {
        if (!getPieceAt(r, c)) {
            const circle = document.createElement('div');
            circle.className = 'valid-move-indicator';
            squares[`${r}-${c}`].appendChild(circle);
        } else {
            const square = squares[`${r}-${c}`];
            square.classList.add('valid-move-indicator-attack');
        }
        validMoves.push([r, c]);
    });
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
    const toPieceImage = toSquare.querySelector('img');
    if (toPieceImage) {
        toSquare.removeChild(toPieceImage);
    }
    // move the piece image from the fromSquare to the toSquare
    const fromPieceImage = fromSquare.querySelector('img');
    if (fromPieceImage) {
        toSquare.appendChild(fromPieceImage);
    }
}

const selectPiece = (row, col) => {
    // Select piece logic here
    const piece = getPieceAt(row, col);
    if (piece) {
        selectedPiece = [row, col];
        const fromSquare = squares[`${row}-${col}`];

        // Add a visual indication for the selected piece
        fromSquare.classList.add('selected');

        highlightValidMoves(row, col);
    }
}

const removeSelection = (fromRow, fromCol, toRow, toCol) => {
    const fromSquare = squares[`${fromRow}-${fromCol}`];
    const toSquare = squares[`${toRow}-${toCol}`];

    // Remove the selected class from the fromSquare
    fromSquare.classList.remove('selected');

    // Remove the valid-move-indicator circles from all squares
    validMoves.forEach(([r, c]) => {
        if (getPieceAt(r, c)) {
            squares[`${r}-${c}`].classList.remove('valid-move-indicator-attack');
        }
        const indicator = squares[`${r}-${c}`].querySelector('.valid-move-indicator');
        if (indicator) {
            indicator.remove();
        }
    });
    validMoves.length = 0; // Clear the validMoves array
}

board.addEventListener('click', (e) => {
    const square = e.target.closest('.square');

    if (!square) return;
    const row = parseInt(square.dataset.row);
    const col = parseInt(square.dataset.col);

    let pieceColor = null;
    if (gameBoard[row][col]) {
        pieceColor = getPieceColor(row, col);
    }

    if (selectedPiece) {
        const [fromRow, fromCol] = selectedPiece;

        if (isValidMove(fromRow, fromCol, row, col)) {
            movePiece(fromRow, fromCol, row, col);
            selectedPiece = null; // Reset selection after move
            removeSelection(fromRow, fromCol, row, col);

            // currentPlayer = currentPlayer === 'white' ? 'black' : 'white';
            status.textContent = `It's ${currentPlayer}'s turn.`;
        } else {
            if (!gameBoard[row][col]) return; // Clicked on an empty square that is not a valid move, do nothing

            if (pieceColor === currentPlayer) {
                // selected a piece of the current player, so change selection
                removeSelection(fromRow, fromCol, row, col);
                selectPiece(row, col);
            }
        }
    } else {
        if (!gameBoard[row][col]) return; // Clicked on an empty square that is not a valid move, do nothing

        if (pieceColor !== currentPlayer) {
            console.log(`It's ${currentPlayer}'s turn. You cannot select ${pieceColor} pieces.`);
            return;
        }
        selectPiece(row, col);
    }
})