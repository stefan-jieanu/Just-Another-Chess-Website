/* DONT FORGET TO IMPOLEMENT THE STALE MATE THING */
/* DONT FORGET TO IMPOLEMENT THE STALE MATE THING */
/* DONT FORGET TO IMPOLEMENT THE STALE MATE THING */
/* DONT FORGET TO IMPOLEMENT THE STALE MATE THING */
/* DONT FORGET TO IMPOLEMENT THE STALE MATE THING */
/* DONT FORGET TO IMPOLEMENT THE STALE MATE THING */

let sketch = function(p) {
    let board;
    let whiteColor;
    let blackColor;
    let backgroundColor;
    let piecesSprite;

    let canvasSize = 600;

    // Enum containing the all the piece types
    const pieces = {
        WHITE: {
            PAWN: 'white_pawn',
            KING: 'white_king',
            QUEEN: 'white_queen',
            KNIGHT: 'white_knight',
            BISHOP: 'white_bishop',
            ROOK: 'white_rook'
        }, 
        BLACK: {
            PAWN: 'black_pawn',
            KING: 'black_king',
            QUEEN: 'black_queen',
            KNIGHT: 'black_knight',
            BISHOP: 'black_bishop',
            ROOK: 'black_rook'
        },
        EMPTY: 'empty'
    }

    // The tile that the mouse hovers
    let hoveredTile;

    // The tile which piece is picked up 
    let pickedupTile;

    // The tile that was previously moved, use this like a 'ctrl-z'
    // Also neede for a correct 'ctrl-z'
    let initialDestPiece;

    // Used to get accurate mouse position relative to the board because we translate 
    let translateCorrect;

    // Used to offset the piece image on the tile
    let tileImageOffsetX = 16;
    let tileImageOffsetY = 2;
    // Used to offset the piece when it's picked up
    let cursorImageOffsetX = -16;
    let cursorImageOffsetY = -32;

    // Keeps track of the turns
    let sideTurn = pieces.WHITE;
    let playerPieces = pieces.WHITE;

    // Keeps track of wether one of the kings is in check
    let isWhiteKingCheck = false;
    let isBlackKingCheck = false;
    let wasPreviousTurnCheck = false;

    // Keeps track of wether the game is running or not 
    let isGameOver = false;
    let winnerSide = '';

    p.preload = function() {
        // Load the image containing the pieces
        piecesSprite = p.loadImage("chess pieces better.png");
    }

    p.setup = function() {
        p.createCanvas(canvasSize, canvasSize);
        whiteColor = p.color(255, 255, 255);
        blackColor = p.color(163, 93, 31);
        backgroundColor = p.color(74, 41, 10);

        // Initialize the board
        board = new Board(560, whiteColor, blackColor);
        hoveredTile = null;
        pickedupTile = null;
        initialDestPiece = null;
        translateCorrect = (p.width - board.size) / 2;
    }

    p.draw = function() {
        p.background(backgroundColor);
        // Translate the board to the middle of the canvas
        p.translate((p.width - board.size) / 2, (p.height - board.size) / 2);

        board.checkMouseInsideBoard();
        board.show();

        // Draw the piece that is picked up on top of the board and other pieces
        if (pickedupTile != null) {
            p.drawChessPiece(pickedupTile.piece_type, p.mouseX - translateCorrect, p.mouseY - translateCorrect, cursorImageOffsetX, cursorImageOffsetY);
        }

        if (isGameOver) {
            p.noLoop();
        }
    }

    p.mousePressed = function() {
        if (hoveredTile != null) {
            // Make sure the player can only pick up his pieces
            if (board.getPieceSide(hoveredTile) == playerPieces) {
                hoveredTile.isPickedUp = true;
                pickedupTile = hoveredTile;
            }
        }
    }

    p.mouseReleased = function() {
        if (pickedupTile != null) {
            // Try to move the piece
            board.movePiece(pickedupTile, hoveredTile);
        }
    }

    p.drawGradient = function(x, y, dim, r, g, b) {
        let radius = dim / 2;
        let alpha = 0;
        for (let i = radius; i > 0; --i) {
            p.fill(r, g, b, alpha);
            p.ellipse(x, y, i, i);
            alpha += Math.round(r / 256);
        }
    }

    /************************************************************************/
    // Swith the turn and also the side in here for now
    // When doing multiplayer we will implement this with other things
    p.switchSides = function() {
        if (sideTurn == pieces.BLACK) {
            sideTurn = pieces.WHITE;
            playerPieces = pieces.WHITE;
        } else if (sideTurn == pieces.WHITE) {
            sideTurn = pieces.BLACK;
            playerPieces = pieces.BLACK;
        }
    }

    p.drawChessPiece = function(type, posX, posY, imageOffsetX, imageOffsetY) {
        switch(type) {
            // Draw the white pieces
            case pieces.WHITE.PAWN:
                p.image(piecesSprite, posX + imageOffsetX, posY + imageOffsetY, 64, 64, 0, 64, 64, 64);
                break;
            case pieces.WHITE.KING:
                p.image(piecesSprite, posX + imageOffsetX, posY + imageOffsetY, 64, 64, 256, 64, 64, 64);
                break;
            case pieces.WHITE.QUEEN:
                p.image(piecesSprite, posX + imageOffsetX, posY + imageOffsetY, 64, 64, 320, 64, 64, 64);
                break;
            case pieces.WHITE.KNIGHT:
                p.image(piecesSprite, posX + imageOffsetX, posY + imageOffsetY, 64, 64, 192, 64, 64, 64);
                break;
            case pieces.WHITE.BISHOP:
                p.image(piecesSprite, posX + imageOffsetX, posY + imageOffsetY, 64, 64, 128, 64, 64, 64);
                break;
            case pieces.WHITE.ROOK:
                p.image(piecesSprite, posX + imageOffsetX, posY + imageOffsetY, 64, 64, 64, 64, 64, 64);
                break;
            
            // Draw the black pieces
            case pieces.BLACK.PAWN:
                p.image(piecesSprite, posX + imageOffsetX, posY + imageOffsetY, 64, 64, 0, 0, 64, 64);
                break;
            case pieces.BLACK.KING:
                p.image(piecesSprite, posX + imageOffsetX, posY + imageOffsetY, 64, 64, 256, 0, 64, 64);
                break;
            case pieces.BLACK.QUEEN:
                p.image(piecesSprite, posX + imageOffsetX, posY + imageOffsetY, 64, 64, 320, 0, 64, 64);
                break;
            case pieces.BLACK.KNIGHT:
                p.image(piecesSprite, posX + imageOffsetX, posY + imageOffsetY, 64, 64, 192, 0, 64, 64);
                break;
            case pieces.BLACK.BISHOP:
                p.image(piecesSprite, posX + imageOffsetX, posY + imageOffsetY, 64, 64, 128, 0, 64, 64);
                break;
            case pieces.BLACK.ROOK:
                p.image(piecesSprite, posX + imageOffsetX, posY + imageOffsetY, 64, 64, 64, 0, 64, 64);
                break;
        }
    }

    class Tile {
        constructor(posX, posY, size, color, ix, iy) {
            this.posX = posX;
            this.posY = posY;
            this.size = size;

            this.color = color;
            this.ix = ix;
            this.iy = iy;
        
            this.isPickedUp = false;
            this.piece_type = pieces.EMPTY;

            // The number of pieces that can attack this square
            this.attackedByWhite = 0;
            this.attackedByBlack = 0;
        }

        show() {
            p.fill(this.color);
            p.noStroke();

            // Draw the tile
            p.rect(this.posX, this.posY, this.size, this.size);
            
            // If this is the hoveredTile color it something different
            if (this == hoveredTile){
                p.noFill();
                p.stroke(0, 255, 0);
                p.strokeWeight(5);
                p.rect(this.posX + 2.5, this.posY + 2.5, this.size - 5, this.size - 5);
            }

            // If the king is on this piece and is also in check
            // Draw a nice red dot under it
            if (this.piece_type == pieces.WHITE.KING && this.attackedByBlack > 0 && !this.isPickedUp) {
                p.noStroke();
                p.drawGradient(this.posX + (this.size / 2), this.posY + (this.size / 2), this.size * 2, 255, 0, 0);
            } else if (this.piece_type == pieces.BLACK.KING && this.attackedByWhite > 0 && !this.isPickedUp) {
                p.noStroke();
                p.drawGradient(this.posX + (this.size / 2), this.posY + (this.size / 2), this.size * 2, 255, 0, 0);
            }
            

            // Draw the piece on the tile
            // If the piece if picked up draw it at the mouse position
            if (!this.isPickedUp) {
                p.drawChessPiece(this.piece_type, this.posX, this.posY, tileImageOffsetX, tileImageOffsetY);
            } 

            // If the mouse is over the tile make this tile the hoveredTile
            if (p.mouseX - translateCorrect > this.posX &&
                p.mouseX - translateCorrect < this.posX + this.size &&
                p.mouseY - translateCorrect > this.posY && 
                p.mouseY - translateCorrect< this.posY + this.size) {
                    hoveredTile = this;
                }
            
            // Show the number of pieces that are attacking this square for debugging 
            // p.textSize(16);
            // p.fill(255, 0, 0);
            // p.text(this.attackedByWhite + ',' + this.attackedByBlack, this.posX, this.posY + 64);
        }
    }

    // The class board class
    // It contains all the tiles 
    class Board {
        constructor(size, whiteColor, blackColor) {
            this.size = size;
            this.squareSize = size / 8;
            this.tiles = Array(8);
            this.whiteColor = whiteColor;
            this.blackColor = blackColor;

            // Initialize the tile array
            for (let i = 0; i < 8; i++) 
                this.tiles[i] = new Array(8);

            // Initialize the tiles
            let tileId = 0;
            for (let i = 0; i < 8; i++) {
                for (let j = 0; j < 8; j++) {
                    tileId += 1;

                    if ((i + j) % 2 == 0) {
                        // Add a white square
                        this.tiles[i][j] = new Tile(i * this.squareSize, j * this.squareSize, this.squareSize, this.whiteColor, i, j);
                    } else {
                        // Add a black square
                        this.tiles[i][j] = new Tile(i * this.squareSize, j * this.squareSize, this.squareSize, this.blackColor, i, j);
                    }
                }
            }

            // Arranging the pieces on the board
            // The black side
            this.tiles[0][1].piece_type = pieces.BLACK.PAWN;
            this.tiles[1][1].piece_type = pieces.BLACK.PAWN;
            this.tiles[2][1].piece_type = pieces.BLACK.PAWN;
            this.tiles[3][1].piece_type = pieces.BLACK.PAWN;
            this.tiles[4][1].piece_type = pieces.BLACK.PAWN;
            this.tiles[5][1].piece_type = pieces.BLACK.PAWN;
            this.tiles[6][1].piece_type = pieces.BLACK.PAWN;
            this.tiles[7][1].piece_type = pieces.BLACK.PAWN;
            this.tiles[0][0].piece_type = pieces.BLACK.ROOK;
            this.tiles[7][0].piece_type = pieces.BLACK.ROOK;
            this.tiles[1][0].piece_type = pieces.BLACK.KNIGHT;
            this.tiles[6][0].piece_type = pieces.BLACK.KNIGHT;
            this.tiles[2][0].piece_type = pieces.BLACK.BISHOP;
            this.tiles[5][0].piece_type = pieces.BLACK.BISHOP;
            this.tiles[3][0].piece_type = pieces.BLACK.QUEEN;
            this.tiles[4][0].piece_type = pieces.BLACK.KING;

            // The white side
            this.tiles[0][6].piece_type = pieces.WHITE.PAWN;
            this.tiles[1][6].piece_type = pieces.WHITE.PAWN;
            this.tiles[2][6].piece_type = pieces.WHITE.PAWN;
            this.tiles[3][6].piece_type = pieces.WHITE.PAWN;
            this.tiles[4][6].piece_type = pieces.WHITE.PAWN;
            this.tiles[5][6].piece_type = pieces.WHITE.PAWN;
            this.tiles[6][6].piece_type = pieces.WHITE.PAWN;
            this.tiles[7][6].piece_type = pieces.WHITE.PAWN;
            this.tiles[0][7].piece_type = pieces.WHITE.ROOK;
            this.tiles[7][7].piece_type = pieces.WHITE.ROOK;
            this.tiles[1][7].piece_type = pieces.WHITE.KNIGHT;
            this.tiles[6][7].piece_type = pieces.WHITE.KNIGHT;
            this.tiles[2][7].piece_type = pieces.WHITE.BISHOP;
            this.tiles[5][7].piece_type = pieces.WHITE.BISHOP;
            this.tiles[3][7].piece_type = pieces.WHITE.QUEEN;
            this.tiles[4][7].piece_type = pieces.WHITE.KING;

            // Calculate the initial attacks by each piece
            this.calcAllAttacks();
        }

        show() {
            for (let i = 0; i < 8; i++) {
                for (let j = 0; j < 8; j++) {
                    this.tiles[i][j].show();
                }
            }
        }

        // Returns the legal squares that a piece can move to 
        getLegalMoves(startTile) {
            let allowedTiles = [];

            switch(startTile.piece_type) {
                case pieces.WHITE.PAWN: {
                    // Add the square directly above if it's empty
                    if (this.tiles[startTile.ix][startTile.iy - 1].piece_type == pieces.EMPTY)
                        allowedTiles.push(this.tiles[startTile.ix][startTile.iy - 1]);

                    // Add the square 2 tile above if it's empty and first time the pawn moves
                    if (startTile.iy == 6 && this.tiles[startTile.ix][startTile.iy - 2].piece_type == pieces.EMPTY)
                        // Make sure we're not jumping over a piece
                        if (this.tiles[startTile.ix][startTile.iy - 1].piece_type == pieces.EMPTY)
                            allowedTiles.push(this.tiles[startTile.ix][startTile.iy - 2]);  

                    // Check the side squares
                    if (this.areCoordsInBounds(startTile.ix - 1, startTile.iy - 1))
                        if (this.getPieceSide(this.tiles[startTile.ix - 1][startTile.iy - 1]) == pieces.BLACK)
                            allowedTiles.push(this.tiles[startTile.ix - 1][startTile.iy - 1]);
                    if (this.areCoordsInBounds(startTile.ix + 1, startTile.iy - 1))
                        if (this.getPieceSide(this.tiles[startTile.ix + 1][startTile.iy - 1]) == pieces.BLACK)
                            allowedTiles.push(this.tiles[startTile.ix + 1][startTile.iy - 1]);

                    return allowedTiles;
                }
                case pieces.BLACK.PAWN: {
                    // Add the square directly above if it's empty
                    if (this.tiles[startTile.ix][startTile.iy + 1].piece_type == pieces.EMPTY)
                    allowedTiles.push(this.tiles[startTile.ix][startTile.iy + 1]);

                    // Add the square 2 tile above if it's empty and first time the pawn moves
                    if (startTile.iy == 1 && this.tiles[startTile.ix][startTile.iy + 2].piece_type == pieces.EMPTY)
                        // Make sure we're not jumping over a piece
                        if (this.tiles[startTile.ix][startTile.iy + 1].piece_type == pieces.EMPTY)
                            allowedTiles.push(this.tiles[startTile.ix][startTile.iy + 2]);  

                    // Check the side squares
                    if (this.areCoordsInBounds(startTile.ix - 1, startTile.iy + 1))
                        if (this.getPieceSide(this.tiles[startTile.ix - 1][startTile.iy + 1]) == pieces.WHITE)
                            allowedTiles.push(this.tiles[startTile.ix - 1][startTile.iy + 1]);
                    if (this.areCoordsInBounds(startTile.ix + 1, startTile.iy + 1))
                        if (this.getPieceSide(this.tiles[startTile.ix + 1][startTile.iy + 1]) == pieces.WHITE)
                            allowedTiles.push(this.tiles[startTile.ix + 1][startTile.iy + 1]);

                    return allowedTiles;
                }

                case pieces.WHITE.KING:
                case pieces.BLACK.KING: {
                    let aux_piece_type = startTile.piece_type;

                    // We'll just check each tile individually
                    let temp_tiles = [];
                    if (this.areCoordsInBounds(startTile.ix - 1, startTile.iy - 1))
                        temp_tiles.push(this.tiles[startTile.ix - 1][startTile.iy - 1]);
                    if (this.areCoordsInBounds(startTile.ix, startTile.iy - 1))
                        temp_tiles.push(this.tiles[startTile.ix][startTile.iy - 1]);
                    if (this.areCoordsInBounds(startTile.ix + 1, startTile.iy - 1))
                        temp_tiles.push(this.tiles[startTile.ix + 1][startTile.iy - 1]);

                    if (this.areCoordsInBounds(startTile.ix - 1, startTile.iy + 1))
                        temp_tiles.push(this.tiles[startTile.ix - 1][startTile.iy + 1]);
                    if (this.areCoordsInBounds(startTile.ix, startTile.iy + 1))
                        temp_tiles.push(this.tiles[startTile.ix][startTile.iy + 1]);
                    if (this.areCoordsInBounds(startTile.ix + 1, startTile.iy + 1))
                        temp_tiles.push(this.tiles[startTile.ix + 1][startTile.iy + 1]);

                    if (this.areCoordsInBounds(startTile.ix - 1, startTile.iy))
                        temp_tiles.push(this.tiles[startTile.ix - 1][startTile.iy]);
                    if (this.areCoordsInBounds(startTile.ix + 1, startTile.iy))
                        temp_tiles.push(this.tiles[startTile.ix + 1][startTile.iy]);


                    // Basically 'turn off' the king and recalculate attacks
                    startTile.piece_type = pieces.EMPTY;
                    this.calcAllAttacks();
                    temp_tiles.forEach(t => {

                        if (aux_piece_type == pieces.WHITE.KING) {
                            if ((this.getPieceSide(t) == pieces.BLACK || t.piece_type == pieces.EMPTY) && t.attackedByBlack == 0)
                                allowedTiles.push(t);
                        } else if (aux_piece_type == pieces.BLACK.KING) {
                            if ((this.getPieceSide(t) == pieces.WHITE || t.piece_type == pieces.EMPTY) && t.attackedByWhite == 0)
                                allowedTiles.push(t);
                        }    
                    });
                    // Turn the king back on and recalculate attacks
                    startTile.piece_type = aux_piece_type;
                    this.calcAllAttacks();
                    
                    return allowedTiles;
                }

                case pieces.WHITE.QUEEN: {
                    this.getRookMovesHelper(startTile, pieces.WHITE).forEach(t => {
                        allowedTiles.push(t);
                    });
                    this.getBishopMovesHelper(startTile, pieces.WHITE).forEach(t => {
                        allowedTiles.push(t);
                    });

                    return allowedTiles;
                }
                case pieces.BLACK.QUEEN: {
                    this.getRookMovesHelper(startTile, pieces.BLACK).forEach(t => {
                        allowedTiles.push(t);
                    });
                    this.getBishopMovesHelper(startTile, pieces.BLACK).forEach(t => {
                        allowedTiles.push(t);
                    });

                    return allowedTiles;
                }

                case pieces.WHITE.BISHOP: {
                    this.getBishopMovesHelper(startTile, pieces.WHITE).forEach(t => {
                        allowedTiles.push(t);
                    });

                    return allowedTiles;
                }
                case pieces.BLACK.BISHOP: {
                    this.getBishopMovesHelper(startTile, pieces.BLACK).forEach(t => {
                        allowedTiles.push(t);
                    });

                    return allowedTiles;
                }

                case pieces.WHITE.KNIGHT: {
                    this.getKnightMovesHelper(startTile, pieces.WHITE).forEach(t => {
                        allowedTiles.push(t);
                    });

                    return allowedTiles;
                }
                case pieces.BLACK.KNIGHT: {
                    this.getKnightMovesHelper(startTile, pieces.BLACK).forEach(t => {
                        allowedTiles.push(t);
                    });

                    return allowedTiles;
                }

                case pieces.WHITE.ROOK: {
                    this.getRookMovesHelper(startTile, pieces.WHITE).forEach(t => {
                        allowedTiles.push(t);
                    });
                    return allowedTiles;
                }
                case pieces.BLACK.ROOK: {
                    this.getRookMovesHelper(startTile, pieces.BLACK).forEach(t => {
                        allowedTiles.push(t);
                    });

                    return allowedTiles;
                }
                default:
                    return allowedTiles;
            }
        }

        // Returns true if the piece can move to the destination tile
        getCanPieceMove(startTile, destTile) {
            return this.getLegalMoves(startTile).includes(destTile);
        }

        // Moves a piece and handles the out come of that move
        movePiece(startTile, destTile) {
            if (isGameOver)
                return;
            if (wasPreviousTurnCheck) {
                destTile.piece_type = startTile.piece_type;
                startTile.piece_type = initialDestPiece;

                wasPreviousTurnCheck = false;
                this.calcAllAttacks();
                return;
            }

            // Check if the piece is moving to an allowed square
            if (board.getCanPieceMove(startTile, destTile) && destTile != startTile) {
                // Move the piece
                initialDestPiece = destTile.piece_type;
                console.log(initialDestPiece);

                destTile.piece_type = startTile.piece_type;
                startTile.piece_type = pieces.EMPTY;

                // Calculate all the attacks
                this.calcAllAttacks();

                // Check to see if a king is in check
                for (let i = 0; i < 8; i++) 
                for (let j = 0; j < 8; j++) {
                    if (this.tiles[i][j].piece_type == pieces.WHITE.KING && this.tiles[i][j].attackedByBlack > 0) {
                        isWhiteKingCheck = true;
                    } else if (this.tiles[i][j].piece_type == pieces.WHITE.KING && this.tiles[i][j].attackedByBlack == 0) {
                        isWhiteKingCheck = false;
                    }

                    if (this.tiles[i][j].piece_type == pieces.BLACK.KING && this.tiles[i][j].attackedByWhite > 0) {
                        isBlackKingCheck = true;
                    } else if (this.tiles[i][j].piece_type == pieces.BLACK.KING && this.tiles[i][j].attackedByWhite == 0) {
                        isBlackKingCheck = false;
                    }
                }

                if (isBlackKingCheck && sideTurn == pieces.BLACK) {
                    // Check to see if the king is still in check after a new move
                    for (let i = 0; i < 8; i++) 
                        for (let j = 0; j < 8; j++) {
                            if (this.tiles[i][j].piece_type == pieces.BLACK.KING && this.tiles[i][j].attackedByWhite > 0) {
                                // Revert the move
                                if (!wasPreviousTurnCheck) {
                                    wasPreviousTurnCheck = true;
                                    this.movePiece(destTile, startTile);
                                } 
                            } else {
                                /*********************************************/
                                // Again temporary side switching
                                p.switchSides();
                                isBlackKingCheck = false;
                            }
                    }
                } else if (isWhiteKingCheck && sideTurn == pieces.WHITE) {
                    // Check to see if the king is still in check after a new move
                    for (let i = 0; i < 8; i++) 
                        for (let j = 0; j < 8; j++) {
                            if (this.tiles[i][j].piece_type == pieces.WHITE.KING && this.tiles[i][j].attackedByBlack > 0) {
                                // Revert the move
                                if (!wasPreviousTurnCheck) {
                                    wasPreviousTurnCheck = true;
                                    this.movePiece(destTile, startTile);
                                }
                            } else {
                                /*********************************************/
                                // Again temporary side switching
                                p.switchSides();
                                isWhiteKingCheck = false;
                            }
                    }
                }

                // If one of the kings is in check, check for mate
                if (isWhiteKingCheck) this.checkForMate(pieces.WHITE);
                else if (isBlackKingCheck) this.checkForMate(pieces.BLACK);

                /************************************************************************/
                // Swith the turn and also the side in here for now
                // When doing multiplayer we will implement this with other things
                p.switchSides();
                /************************************************************************/ 

                // Recalcualte attacks for each tile
            } else {
                // Say the move was illegal
                console.log('illegal');
            }

            startTile.isPickedUp = false;
            pickedupTile = null;
        }

        // Calculates all the attacks
        calcAllAttacks() {
            // Reset all the attacks
            for (let i = 0; i < 8; i++) {
                for (let j = 0; j < 8; j++) {
                    this.tiles[i][j].attackedByWhite = 0;
                    this.tiles[i][j].attackedByBlack = 0;
                }
            }

            // Add the attacks for each piece
            for (let i = 0; i < 8; i++) {
                for (let j = 0; j < 8; j++) {
                    this.addAttacksByPiece(this.tiles[i][j]);
                }
            }
        }

        // Calculate attacks by a piece
        addAttacksByPiece(tile) {
            if (tile.piece_type == pieces.EMPTY)
                return [];

            let attackedTiles = this.getAttackedSquaresByPiece(tile);

            if (this.getPieceSide(tile) == pieces.WHITE)
                attackedTiles.forEach(t => {
                    t.attackedByWhite += 1;
                });
            else if (this.getPieceSide(tile) == pieces.BLACK)
                attackedTiles.forEach(t => {
                    t.attackedByBlack += 1;
                });
        }

        // Gets all the attacked squares 
        // Necessary because pawns and kings are *special 
        getAttackedSquaresByPiece(tile) {
            // Get the pawns side squares
            if (tile.piece_type == pieces.WHITE.PAWN) {
                let at = [];

                // Check the side squares
                if (this.areCoordsInBounds(tile.ix - 1, tile.iy - 1))
                    at.push(this.tiles[tile.ix - 1][tile.iy - 1]);
                if (this.areCoordsInBounds(tile.ix + 1, tile.iy - 1))
                    at.push(this.tiles[tile.ix + 1][tile.iy - 1]);
            
                return at;
            } else if (tile.piece_type == pieces.BLACK.PAWN) {
                let at = [];

                // Check the side squares
                if (this.areCoordsInBounds(tile.ix - 1, tile.iy + 1))
                    at.push(this.tiles[tile.ix - 1][tile.iy + 1]);
                if (this.areCoordsInBounds(tile.ix + 1, tile.iy + 1))
                    at.push(this.tiles[tile.ix + 1][tile.iy + 1]);

                return at;
            }

            // Get all the squares around the king
            if (tile.piece_type == pieces.WHITE.KING) {
                let at = [], temp_tiles = [];
                if (this.areCoordsInBounds(tile.ix - 1, tile.iy - 1))
                    at.push(this.tiles[tile.ix - 1][tile.iy - 1]);
                if (this.areCoordsInBounds(tile.ix, tile.iy - 1))
                    at.push(this.tiles[tile.ix][tile.iy - 1]);
                if (this.areCoordsInBounds(tile.ix + 1, tile.iy - 1))
                    at.push(this.tiles[tile.ix + 1][tile.iy - 1]);

                if (this.areCoordsInBounds(tile.ix - 1, tile.iy + 1))
                    at.push(this.tiles[tile.ix - 1][tile.iy + 1]);
                if (this.areCoordsInBounds(tile.ix, tile.iy + 1))
                    at.push(this.tiles[tile.ix][tile.iy + 1]);
                if (this.areCoordsInBounds(tile.ix + 1, tile.iy + 1))
                    at.push(this.tiles[tile.ix + 1][tile.iy + 1]);

                if (this.areCoordsInBounds(tile.ix - 1, tile.iy))
                    at.push(this.tiles[tile.ix - 1][tile.iy]);
                if (this.areCoordsInBounds(tile.ix + 1, tile.iy))
                    at.push(this.tiles[tile.ix + 1][tile.iy]);

                return at;
            } else if (tile.piece_type == pieces.BLACK.KING) {
                let at = [], temp_tiles = [];
                if (this.areCoordsInBounds(tile.ix - 1, tile.iy - 1))
                    at.push(this.tiles[tile.ix - 1][tile.iy - 1]);
                if (this.areCoordsInBounds(tile.ix, tile.iy - 1))
                    at.push(this.tiles[tile.ix][tile.iy - 1]);
                if (this.areCoordsInBounds(tile.ix + 1, tile.iy - 1))
                    at.push(this.tiles[tile.ix + 1][tile.iy - 1]);

                if (this.areCoordsInBounds(tile.ix - 1, tile.iy + 1))
                    at.push(this.tiles[tile.ix - 1][tile.iy + 1]);
                if (this.areCoordsInBounds(tile.ix, tile.iy + 1))
                    at.push(this.tiles[tile.ix][tile.iy + 1]);
                if (this.areCoordsInBounds(tile.ix + 1, tile.iy + 1))
                    at.push(this.tiles[tile.ix + 1][tile.iy + 1]);

                if (this.areCoordsInBounds(tile.ix - 1, tile.iy))
                    at.push(this.tiles[tile.ix - 1][tile.iy]);
                if (this.areCoordsInBounds(tile.ix + 1, tile.iy))
                    at.push(this.tiles[tile.ix + 1][tile.iy]);

                return at;
            }

            // Get all the rook squares
            if (tile.piece_type == pieces.WHITE.ROOK) {
                return this.getRookMovesHelper(tile, pieces.WHITE, true);
            } else if (tile.piece_type == pieces.BLACK.ROOK) {
                return this.getRookMovesHelper(tile, pieces.BLACK, true);
            }

            // Get all the bishop squares
            if (tile.piece_type == pieces.WHITE.BISHOP) {
                return this.getBishopMovesHelper(tile, pieces.WHITE, true);
            } else if (tile.piece_type == pieces.BLACK.BISHOP) {
                return this.getBishopMovesHelper(tile, pieces.BLACK, true);
            }

            // Get all the knight squares
            if (tile.piece_type == pieces.WHITE.KNIGHT) {
                return this.getKnightMovesHelper(tile, pieces.WHITE, true);
            } else if (tile.piece_type == pieces.BLACK.KNIGHT) {
                return this.getKnightMovesHelper(tile, pieces.BLACK, true);
            }

            // Get all the queen squares
            if (tile.piece_type == pieces.WHITE.QUEEN) {
                let tmp = [];
                this.getRookMovesHelper(tile, pieces.WHITE, true).forEach(t => {
                    tmp.push(t);
                });
                this.getBishopMovesHelper(tile, pieces.WHITE, true).forEach(t => {
                    tmp.push(t);
                });

                return tmp;
            } else if (tile.piece_type == pieces.BLACK.QUEEN) {
                let tmp = [];
                this.getRookMovesHelper(tile, pieces.BLACK, true).forEach(t => {
                    tmp.push(t);
                });
                this.getBishopMovesHelper(tile, pieces.BLACK, true).forEach(t => {
                    tmp.push(t);
                });

                return tmp;
            }

            console.error("Something wrong in getAttackedSquaresbyPiece");
            return [];
        }

        // Checks if one of the kings is mated
        checkForMate(side) {
            let noEscape = true;

            // We will move every piece in every allowed position once
            // If none of these moves saves the king, than it's check mate
            for (let i = 0; i < 8; i++) {
                for (let j = 0; j < 8; j++) {
                    if (this.getPieceSide(this.tiles[i][j]) == side) {
                        // Get all the squares that the piece can move to and move the piece there
                        // If the king is still in danger, move it back and try again
                        let possibleTiles = this.getLegalMoves(this.tiles[i][j]);
                        possibleTiles.forEach(t => {
                            let sT = this.tiles[i][j].piece_type;
                            let dT = t.piece_type;

                            this.tiles[i][j].piece_type = pieces.EMPTY;
                            t.piece_type = sT;

                            this.calcAllAttacks();
                            // Check if the king is still in check
                            for (let k = 0; k < 8; k++) {
                                for (let l = 0; l < 8; l++) {
                                    if (side == pieces.WHITE) {
                                        if (this.tiles[k][l].piece_type == pieces.WHITE.KING) {
                                            if (this.tiles[k][l].attackedByBlack == 0) noEscape = false; 
                                        }
                                    }
                                    else if (side == pieces.BLACK) {
                                        if (this.tiles[k][l].piece_type == pieces.BLACK.KING) {
                                            if (this.tiles[k][l].attackedByWhite == 0) noEscape = false;
                                        }
                                    }
                                }
                            }

                            this.tiles[i][j].piece_type = sT;
                            t.piece_type = dT;
                            this.calcAllAttacks();
                        });
                    }
                }
            }

            if (noEscape) {
                console.log('game over');
                if (side == pieces.WHITE) console.log('black won');
                else console.log('white won');
                isGameOver = true;
                return true;
            } 
            return false;
        }

        // Return true if the value passed is within the bounds of 
        areCoordsInBounds(x, y) {
            return x >= 0 && x < 8 && y >= 0 && y < 8;
        }

        // Return the piece side (black or white)
        getPieceSide(tile) {
            if (tile.piece_type == pieces.BLACK.PAWN || tile.piece_type == pieces.BLACK.KING || tile.piece_type == pieces.BLACK.QUEEN ||
                tile.piece_type == pieces.BLACK.BISHOP || tile.piece_type == pieces.BLACK.KNIGHT || tile.piece_type == pieces.BLACK.ROOK)
                return pieces.BLACK;
            if (tile.piece_type == pieces.WHITE.PAWN || tile.piece_type == pieces.WHITE.KING || tile.piece_type == pieces.WHITE.QUEEN ||
                tile.piece_type == pieces.WHITE.BISHOP || tile.piece_type == pieces.WHITE.KNIGHT || tile.piece_type == pieces.WHITE.ROOK)
                return pieces.WHITE;
            return pieces.EMPTY;
        }

        // Get rook moves helper
        getRookMovesHelper(startTile, side, includeSide = false) {
            let opposingSide;
            if (side == pieces.WHITE) 
                opposingSide = pieces.BLACK;
            else 
                opposingSide = pieces.WHITE;


            let allowedTiles = [];
            // We'll loop through tile left / right / up / down relative to the rook
            for (let i = startTile.ix + 1; i < 8; i++) {
                if (this.tiles[i][startTile.iy].piece_type == pieces.EMPTY) {
                    allowedTiles.push(this.tiles[i][startTile.iy]);
                }
                if (this.getPieceSide(this.tiles[i][startTile.iy]) == opposingSide) {
                    allowedTiles.push(this.tiles[i][startTile.iy]);
                    break;
                }
                if (this.getPieceSide(this.tiles[i][startTile.iy]) == side) {
                    if (includeSide) {
                        allowedTiles.push(this.tiles[i][startTile.iy]);
                        break;
                    } else break;
                }
            }

            for (let i = startTile.ix - 1; i >= 0; i--) {
                if (this.tiles[i][startTile.iy].piece_type == pieces.EMPTY) {
                    allowedTiles.push(this.tiles[i][startTile.iy]);
                }
                if (this.getPieceSide(this.tiles[i][startTile.iy]) == opposingSide) {
                    allowedTiles.push(this.tiles[i][startTile.iy]);
                    break;
                }
                if (this.getPieceSide(this.tiles[i][startTile.iy]) == side) {
                    if (includeSide) {
                        allowedTiles.push(this.tiles[i][startTile.iy]);
                        break;
                    } else break;
                }
            }

            for (let i = startTile.iy + 1; i < 8; i++) {
                if (this.tiles[startTile.ix][i].piece_type == pieces.EMPTY) {
                    allowedTiles.push(this.tiles[startTile.ix][i]);
                }
                if (this.getPieceSide(this.tiles[startTile.ix][i]) == opposingSide) {
                    allowedTiles.push(this.tiles[startTile.ix][i]);
                    break;
                }
                if (this.getPieceSide(this.tiles[startTile.ix][i]) == side) {
                    if (includeSide) {
                        allowedTiles.push(this.tiles[startTile.ix][i]);
                        break;
                    } else break;
                }
            }

            for (let i = startTile.iy - 1; i >= 0; i--) {
                if (this.tiles[startTile.ix][i].piece_type == pieces.EMPTY) {
                    allowedTiles.push(this.tiles[startTile.ix][i]);
                }
                if (this.getPieceSide(this.tiles[startTile.ix][i]) == opposingSide) {
                    allowedTiles.push(this.tiles[startTile.ix][i]);
                    break;
                }
                if (this.getPieceSide(this.tiles[startTile.ix][i]) == side) {
                    if (includeSide) {
                        allowedTiles.push(this.tiles[startTile.ix][i]);
                        break;
                    } else break;
                }
            }
            return allowedTiles;
        }

        // Get bishop moves helper
        getBishopMovesHelper(startTile, side, includeSide = false) {
            let opposingSide;
            if (side == pieces.WHITE) 
                opposingSide = pieces.BLACK;
            else 
                opposingSide = pieces.WHITE;

            let allowedTiles = [];
            // We'll loop diagonaly through the tiles
            for (let i = 0; i < 8; i++) {
                if (this.areCoordsInBounds(startTile.ix - i - 1, startTile.iy - i - 1)) {
                    if (this.tiles[startTile.ix - i - 1][startTile.iy - i - 1].piece_type == pieces.EMPTY) {
                        allowedTiles.push(this.tiles[startTile.ix - i - 1][startTile.iy - i - 1]);
                    }
                    if (this.getPieceSide(this.tiles[startTile.ix - i - 1][startTile.iy - i - 1]) == opposingSide) {
                        allowedTiles.push(this.tiles[startTile.ix - i - 1][startTile.iy - i - 1]);
                        break;
                    }
                    if (this.getPieceSide(this.tiles[startTile.ix - i - 1][startTile.iy - i - 1]) == side) {
                        if (includeSide) {
                            allowedTiles.push(this.tiles[startTile.ix - i - 1][startTile.iy - i - 1]);
                            break;
                        } else break;
                    }
                }
            }

            for (let i = 0; i < 8; i++) {
                if (this.areCoordsInBounds(startTile.ix + i + 1, startTile.iy - i - 1)) {
                    if (this.tiles[startTile.ix + i + 1][startTile.iy - i - 1].piece_type == pieces.EMPTY) {
                        allowedTiles.push(this.tiles[startTile.ix + i + 1][startTile.iy - i - 1]);
                    }
                    if (this.getPieceSide(this.tiles[startTile.ix + i + 1][startTile.iy - i - 1]) == opposingSide) {
                        allowedTiles.push(this.tiles[startTile.ix + i + 1][startTile.iy - i - 1]);
                        break;
                    }
                    if (this.getPieceSide(this.tiles[startTile.ix + i + 1][startTile.iy - i - 1]) == side) {
                        if (includeSide) {
                            allowedTiles.push(this.tiles[startTile.ix + i + 1][startTile.iy - i - 1]);
                            break;
                        } else break;
                    }
                }
            }

            for (let i  = 0; i < 8; i++) {
                if (this.areCoordsInBounds(startTile.ix + i + 1, startTile.iy + i + 1)) {
                    if (this.tiles[startTile.ix + i + 1][startTile.iy + i + 1].piece_type == pieces.EMPTY) {
                        allowedTiles.push(this.tiles[startTile.ix + i + 1][startTile.iy + i + 1]);
                    }
                    if (this.getPieceSide(this.tiles[startTile.ix + i + 1][startTile.iy + i + 1]) == opposingSide) {
                        allowedTiles.push(this.tiles[startTile.ix + i + 1][startTile.iy + i + 1]);
                        break;
                    }
                    if (this.getPieceSide(this.tiles[startTile.ix + i + 1][startTile.iy + i + 1]) == side) {
                        if (includeSide) {
                            allowedTiles.push(this.tiles[startTile.ix + i + 1][startTile.iy + i + 1]);
                            break;
                        } else break;
                    }
                }
            }

            for (let i = 0; i < 8; i++) {
                if (this.areCoordsInBounds(startTile.ix - i - 1, startTile.iy + i + 1)) {
                    if (this.tiles[startTile.ix - i - 1][startTile.iy + i + 1].piece_type == pieces.EMPTY) {
                        allowedTiles.push(this.tiles[startTile.ix - i - 1][startTile.iy + i + 1]);
                    }
                    if (this.getPieceSide(this.tiles[startTile.ix - i - 1][startTile.iy + i + 1]) == opposingSide) {
                        allowedTiles.push(this.tiles[startTile.ix - i - 1][startTile.iy + i + 1]);
                        break;
                    }
                    if (this.getPieceSide(this.tiles[startTile.ix - i - 1][startTile.iy + i + 1]) == side) {
                        if (includeSide) {
                            allowedTiles.push(this.tiles[startTile.ix - i - 1][startTile.iy + i + 1]);
                            break;
                        } else break;
                    }
                }
            }
            
            return allowedTiles;
        }

        // Get knight moves helper
        getKnightMovesHelper(startTile, side, includeSide = false) {
            let opposingSide;
            if (side == pieces.WHITE) 
                opposingSide = pieces.BLACK;
            else 
                opposingSide = pieces.WHITE;

            // Check each possible square
            let allowedTiles = [];
            let possibleTiles = [{x: -1,y: 2}, {x: 1, y: 2}, {x: -1,y: -2}, {x: 1, y: -2}, {x: -2, y: -1}, {x: -2, y: 1}, {x: 2, y: -1}, {x: 2, y: 1}]

            possibleTiles.forEach(t => {
                if (this.areCoordsInBounds(startTile.ix + t.x, startTile.iy + t.y)) {
                    if (includeSide)
                        allowedTiles.push(this.tiles[startTile.ix + t.x][startTile.iy + t.y]);
                    else {
                        if (this.tiles[startTile.ix + t.x][startTile.iy + t.y].piece_type == pieces.EMPTY)
                            allowedTiles.push(this.tiles[startTile.ix + t.x][startTile.iy + t.y]);
                        if (this.getPieceSide(this.tiles[startTile.ix + t.x][startTile.iy + t.y]) == opposingSide)
                            allowedTiles.push(this.tiles[startTile.ix + t.x][startTile.iy + t.y]);
                    }
                }
            });
            return allowedTiles;
        }

        // If the mouse is outside the board set the hoveredTile to null
        checkMouseInsideBoard() {
            if (p.mouseX - translateCorrect < 0 || p.mouseX -translateCorrect > this.size ||
                p.mouseY -translateCorrect < 0 || p.mouseY -translateCorrect > this.size) {
                hoveredTile = null;
            }
        }
    }
}
let game = new p5(sketch, window.document.getElementById('board-container'));