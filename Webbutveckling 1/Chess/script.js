class chess_piece {
  constructor(color, piece, starting_square, position=[0,0], starting_position=[0,0]) {
    this.color = color;
    this.piece = piece
    this.identifier = starting_square
    this.position = position;
  }
}

let chess_piece_url = "Classic/"

//White pieces
let white_rook_a = new chess_piece("White", "Rook", "A");
let white_rook_h = new chess_piece("White", "Rook", "H");
let white_knight_b = new chess_piece("White", "Knight", "B");
let white_knight_g = new chess_piece("White", "Knight", "G");
let white_bishop_c = new chess_piece("White", "Bishop", "C");
let white_bishop_f = new chess_piece("White", "Bishop", "F");
let white_king = new chess_piece("White", "King", "D");
let white_queen = new chess_piece("White", "Queen", "E");
let white_pawns = [new chess_piece("White", "Pawn", "A"), new chess_piece("White", "Pawn", "B"), new chess_piece("White", "Pawn", "C"), new chess_piece("White", "Pawn", "D"), new chess_piece("White", "Pawn", "E"), new chess_piece("White", "Pawn", "F"), new chess_piece("White", "Pawn", "G"), new chess_piece("White", "Pawn", "G")];



//Black pieces
let black_rook_a = new chess_piece("Black", "Rook", "A");
let black_rook_h = new chess_piece("Black", "Rook", "H");
let black_knight_b = new chess_piece("Black", "Knight", "B");
let black_knight_g = new chess_piece("Black", "Knight", "G");
let black_bishop_c = new chess_piece("Black", "Bishop", "C");
let black_bishop_f = new chess_piece("Black", "Bishop", "F");
let black_king = new chess_piece("Black", "King", "D");
let black_queen = new chess_piece("Black", "Queen", "E");
let black_pawns = [new chess_piece("Black", "Pawn", "A"), new chess_piece("Black", "Pawn", "B"), new chess_piece("Black", "Pawn", "C"), new chess_piece("Black", "Pawn", "D"), new chess_piece("Black", "Pawn", "E"), new chess_piece("Black", "Pawn", "F"), new chess_piece("Black", "Pawn", "G"), new chess_piece("Black", "Pawn", "G")];

let piece_positions = [
						[black_rook_a, black_knight_b, black_bishop_c, black_king, black_queen, black_bishop_f, black_knight_g, black_rook_h],
						[black_pawns[0], black_pawns[1], black_pawns[2], black_pawns[3], black_pawns[4], black_pawns[5], black_pawns[6], black_pawns[7]],
					   	["Empty", "Empty", "Empty", "Empty", "Empty", "Empty", "Empty", "Empty"],
						["Empty", "Empty", "Empty", "Empty", "Empty", "Empty", "Empty", "Empty"],
						["Empty", "Empty", "Empty", "Empty", "Empty", "Empty", "Empty", "Empty"],
						["Empty", "Empty", "Empty", "Empty", "Empty", "Empty", "Empty", "Empty"],
					   	[white_pawns[0], white_pawns[1], white_pawns[2], white_pawns[3], white_pawns[4], white_pawns[5], white_pawns[6], white_pawns[7]],
						[white_rook_a, white_knight_b, white_bishop_c, white_king, white_queen, white_bishop_f, white_knight_g, white_rook_h],
						];

let move_history = []

//Replacing "Empty" with chess_piece class to save position for swapping
for (let y=0; y < piece_positions.length; y++)
{
	for (let x=0; x < piece_positions[y].length; x++)
	{
		if (piece_positions[y][x] == "Empty")
		{
			piece_positions[y][x] = new chess_piece("None", "Empty", "None", [y, x], [y, x])
		}
		else {
			piece_positions[y][x].position = [y, x]
			piece_positions[y][x].starting_position = [y, x]
		}
	}
}

function move_piece(current_pos, move_pos){
	let legal = false;
	move_pos[0] = parseInt(move_pos[0], 10);
	move_pos[1] = parseInt(move_pos[1], 10);
	let piece = piece_positions[current_pos[0]][current_pos[1]];
	let legal_moves = available_moves(piece.piece, piece.position, piece_positions, piece.color, piece.starting_position);

	for (let i = 0; i < legal_moves.length; i++) {
		if (legal_moves[i].equals(move_pos)) {
			console.log('Legal move');
			legal = true;
			break;
		}
	}

	if (legal)
	{
	//After confirming the move is legal
	let temp = [...piece_positions][current_pos[0]][current_pos[1]];
	let temp2 = piece_positions[current_pos[0]][current_pos[1]].position;

	piece_positions[current_pos[0]][current_pos[1]].position = piece_positions[move_pos[0]][move_pos[1]].position;
	piece_positions[current_pos[0]][current_pos[1]] = piece_positions[move_pos[0]][move_pos[1]];

	piece_positions[move_pos[0]][move_pos[1]].position = temp2;
	piece_positions[move_pos[0]][move_pos[1]] = temp;

	//Refresh board to have all pieces show correct positions
	refresh_board()
	move_history.push([temp.color, temp.piece, temp.color + " " + temp.piece + " moved to " + move_pos])
	console.log(move_history)
	}
	else {
		console.log("Illegal move!")
	}
}

function clicked_piece(td) {

	//If player has not yet clicked and there are legal moves for the piece clicked on
	if (document.getElementsByClassName('clicked first').length != 1) {
		let piece = piece_positions[td.id.split(",")[0]][td.id.split(",")[1]];
		let legal_moves = available_moves(piece.piece, piece.position, piece_positions, piece.color, piece.starting_position);
		if (legal_moves.length > 0) {
			td.classList.add("clicked");
			td.classList.add("first");

			//Add all available moves to the board
			for (let i = 1; i < 9; i++) {
			    for (let j = 1; j < 9; j++) {
			    	for (let k = 0; k < legal_moves.length; k++) {
				    	if (legal_moves[k].equals([i-1, j-1])) {
				    	let current_tile = document.getElementById([i-1, j-1]);
				    	current_tile.classList.add('available');
			    		}
			    	}
				}
			}
		}
	}
	

	//Otherwise this is the second click
	else {

		td.classList.add("clicked");
		td.classList.add("second");
		
		let second_element = document.getElementsByClassName('clicked second')[0];
		let first_element = document.getElementsByClassName('clicked first')[0];
		//Refresh board to remove all excess classes
		refresh_board()
		move_piece(first_element.id.split(","), second_element.id.split(","));
	}
}



function refresh_board(){
	for (let y = 0; y < 8; y++) {
	    for (let x = 0; x < 8; x++) {
	    	let current_tile = document.getElementById([y, x])
	    	current_tile.style.backgroundImage = `url('ChessPieceImages/${chess_piece_url}${piece_positions[y][x].color}_${piece_positions[y][x].piece}.png')`
	    	if (y%2 == x%2) {
	            current_tile.className = "white";
	        } else {
	            current_tile.className = "black";
	        }
	        
	        if (piece_positions[y][x] == "Empty") {
				piece_positions[y][x] = new chess_piece("None", "Empty", "None", [y, x], [y, x]);
			}
	    }
	}
}

function create_board(){
	let table = document.createElement("table");
	table.className = "mainChessBoard";
	for (let i = 1; i < 9; i++) {
	    let tr = document.createElement('tr');
	    for (let j = 1; j < 9; j++) {
	        let td = document.createElement('td');
	        td.id = [i-1, j-1];
	        td.style.backgroundImage = `url('ChessPieceImages/${chess_piece_url}${piece_positions[i-1][j-1].color}_${piece_positions[i-1][j-1].piece}.png')`
	        console.log('Chess/' + piece_positions[i-1][j-1].color + "_" + piece_positions[i-1][j-1].piece)
			td.addEventListener('click', function() {clicked_piece(this)});
	        if (i%2 == j%2) {
	            td.className = "white";
	        } else {
	            td.className = "black";
	        }
	        tr.appendChild(td);
	    }
	    table.appendChild(tr);
	}
	document.body.appendChild(table);
}



function available_moves(piece, position, board, color, starting_position){
	let available_moves = [];
	//Check if piece whose turn it is is trying to move or if it is the first turn
	if (move_history.length === 0 && color == "White" || color != move_history[move_history.length - 1][0]) {
		if (piece == "Empty")
		{
			return available_moves;
		}

		if (piece == "Rook" || piece == "Queen") {

			let moves = [
			[1, 0], [-1, 0], [0, -1], [0, 1]
			]

			for (let i = 0; i < moves.length; i++) {
				let testing_pos = [...position];
				while (true) {

					testing_pos[0] += moves[i][0];
					testing_pos[1] += moves[i][1];
					if (testing_pos[0] < 8 && testing_pos[0] >= 0) {
						if (testing_pos[1] < 8 && testing_pos[1] >= 0) {

							let piece_at_position = piece_positions[testing_pos[0]][testing_pos[1]]
							if (piece_at_position.piece != "Empty" && color == piece_at_position.color) {
								break
							}

							legal_move = [...testing_pos];
							available_moves.push(legal_move);
							if (piece_at_position.piece != "Empty" && color != piece_at_position.color)
							{
								break
							}
						}
						else {
							break;
						}
					}
					else {
						break;
					}
				}
			}
		}

		if (piece == "Bishop" || piece == "Queen") {
			let moves = [
			[1, 1], [-1, 1], [1, -1], [-1, -1]
			]

			for (let i = 0; i < moves.length; i++) {
				let testing_pos = [...position];
				while (true) {

					testing_pos[0] += moves[i][0];
					testing_pos[1] += moves[i][1];

					

					if (testing_pos[0] < 8 && testing_pos[0] >= 0) {
						if (testing_pos[1] < 8 && testing_pos[1] >= 0) {
							let piece_at_position = piece_positions[testing_pos[0]][testing_pos[1]]
							if (piece_at_position.piece != "Empty" && color == piece_at_position.color) {
								break
							}
							legal_move = [...testing_pos];
							available_moves.push(legal_move);

							if (piece_at_position.piece != "Empty" && color != piece_at_position.color )
							{
								break
							}

						}
						else {
							break;
						}
					}
					else {
						break;
					}
				}
			}
		}

		else if (piece == "Knight") {
			let moves = [
			[2, 1], [-2, 1], [2, -1], [-2, -1], [1, 2], [-1, 2], [1, -2], [-1, -2]
			];
			for (let i = 0; i < moves.length; i++) {
				testing_pos = [...position];

				testing_pos[0] += moves[i][0];
				testing_pos[1] += moves[i][1];


					if (testing_pos[0] < 8 && testing_pos[0] >= 0) {
						if (testing_pos[1] < 8 && testing_pos[1] >= 0) {
							let piece_at_position = piece_positions[testing_pos[0]][testing_pos[1]]
							
							if (piece_at_position.piece == "Empty" || color != piece_at_position.color) {
							available_moves.push(testing_pos);
						}
					}
				}
			}
		}

		else if (piece == "King") {
			let moves = [
			[1, 1], [-1, 1], [1, -1], [-1, -1], [1, 0], [-1, 0], [0, 1], [0, -1]
			]
			for (let i = 0; i < moves.length; i++) {
				testing_pos = [...position];

				testing_pos[0] += moves[i][0];
				testing_pos[1] += moves[i][1];

				if (testing_pos[0] < 8 && testing_pos[0] >= 0) {
					if (testing_pos[1] < 8 && testing_pos[1] >= 0) {
						available_moves.push(testing_pos);
					}
				}
			}
		}

		else if (piece == "Pawn")
		{

			testing_pos = [...position];

			const moves = [1, 2]
			const capture_moves = [[-1, -1], [-1, 1]]

			//If pawn started at lower part of board subtraction to move up
			if (starting_position[0] === 6)
			{
				//if Pawn is still in starting position an extra step can be taken
				if (position[0] === starting_position[0]) {
						available_moves.push([testing_pos[0]-moves[1], testing_pos[1]]);
					}
				testing_pos[0] -= moves[0];
			}

			//Otherwise the pawn started at the upper part of the board so addition to move down
			else {
				//if Pawn is still in starting position an extra step can be taken
				if (position[0] === starting_position[0]) {
						available_moves.push([testing_pos[0] + moves[1], testing_pos[1]]);
					}
				testing_pos[0] += moves[0];
			}

			if (testing_pos[0] < 8 && testing_pos[0] >= 0) {
				if (testing_pos[1] < 8 && testing_pos[1] >= 0) {
					available_moves.push(testing_pos);
				}
			}
		}

		//Remove all moves where piece moves into it's own colors pieces
		for (let i = 0; i < available_moves.length; i++) {
			piece_at_position = piece_positions[available_moves[i][0]][available_moves[i][1]]
			if (piece_at_position.piece != "Empty" && color == piece_at_position.color) {
				available_moves[i] = []
			}
		}
	}
	return available_moves;

}








Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time 
    if (this.length != array.length)
        return false;

    for (let i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;       
        }           
        else if (this[i] != array[i]) { 
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;   
        }           
    }       
    return true;
}
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", {enumerable: false});
