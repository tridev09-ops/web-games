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
const initialBoard = [
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'], // Row 0 - Black back rank
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'], // Row 1 - Black pawns
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'], // Row 6 - White pawns
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']  // Row 7 - White back rank
];

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
            const piece = initialBoard[row][col];
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