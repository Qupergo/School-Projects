class chess_piece {
  constructor(position, color, piece, starting_square) {
    this.position = position;
    this.color = color;
    this.piece = piece
    this.identifier = starting_square
  }
}

let chess_piece_url = "Purple_Blue/"

//White pieces
let white_rook_a = new chess_piece([0,0], "White", "Rook", "A");
let white_rook_h = new chess_piece([0,7], "White", "Rook", "H");
let white_knight_b = new chess_piece([0, 1], "White", "Knight", "B");
let white_knight_g = new chess_piece([0, 6], "White", "Knight", "G");
let white_bishop_c = new chess_piece([0, 2], "White", "Bishop", "C");
let white_bishop_f = new chess_piece([0, 5], "White", "Bishop", "F");
let white_king = new chess_piece([0, 3], "White", "King", "D");
let white_queen = new chess_piece([0, 4], "White", "Queen", "E");
let white_pawns = [new chess_piece([1, 0], "White", "Pawn", "A"), new chess_piece([1, 1], "White", "Pawn", "B"), new chess_piece([1, 2], "White", "Pawn", "C"), new chess_piece([1, 3], "White", "Pawn", "D"), new chess_piece([1, 4], "White", "Pawn", "E"), new chess_piece([1, 5], "White", "Pawn", "F"), new chess_piece([1, 6], "White", "Pawn", "G"), new chess_piece([1, 7], "White", "Pawn", "G")];



//Black pieces
let black_rook_a = new chess_piece([7,0], "Black", "Rook", "A");
let black_rook_h = new chess_piece([7,7], "Black", "Rook", "H");
let black_knight_b = new chess_piece([7, 1], "Black", "Knight", "B");
let black_knight_g = new chess_piece([7, 6], "Black", "Knight", "G");
let black_bishop_c = new chess_piece([7, 2], "Black", "Bishop", "C");
let black_bishop_f = new chess_piece([7, 5], "Black", "Bishop", "F");
let black_king = new chess_piece([7, 3], "Black", "King", "D");
let black_queen = new chess_piece([7, 4], "Black", "Queen", "E");
let black_pawns = [new chess_piece([1, 0], "Black", "Pawn", "A"), new chess_piece([1, 1], "Black", "Pawn", "B"), new chess_piece([1, 2], "Black", "Pawn", "C"), new chess_piece([1, 3], "Black", "Pawn", "D"), new chess_piece([1, 4], "Black", "Pawn", "E"), new chess_piece([1, 5], "Black", "Pawn", "F"), new chess_piece([1, 6], "Black", "Pawn", "G"), new chess_piece([1, 7], "Black", "Pawn", "G")];




let piece_positions = [
						[white_rook_a, white_knight_b, white_bishop_c, white_king, white_queen, white_bishop_f, white_knight_g, white_rook_h],
					   	[white_pawns[0], white_pawns[1], white_pawns[2], white_pawns[3], white_pawns[4], white_pawns[5], white_pawns[6], white_pawns[7]],
					   	["Empty", "Empty", "Empty", "Empty", "Empty", "Empty", "Empty", "Empty"],
						["Empty", "Empty", "Empty", "Empty", "Empty", "Empty", "Empty", "Empty"],
						["Empty", "Empty", "Empty", "Empty", "Empty", "Empty", "Empty", "Empty"],
						["Empty", "Empty", "Empty", "Empty", "Empty", "Empty", "Empty", "Empty"],
						[black_pawns[0], black_pawns[1], black_pawns[2], black_pawns[3], black_pawns[4], black_pawns[5], black_pawns[6], black_pawns[7]],
						[black_rook_a, black_knight_b, black_bishop_c, black_king, black_queen, black_bishop_f, black_knight_g, black_rook_h]
						];


//Replacing "Empty" with chess_piece class to save position for swapping
for (let y=0; y < piece_positions.length; y++)
{
	for (let x=0; x < piece_positions[y].length; x++)
	{
		if (piece_positions[y][x] == "Empty")
		{
			piece_positions[y][x] = new chess_piece([x, y], "None", "Empty", "None")
		}
	}
}

function move_piece(current_pos, move_pos){
	let piece = piece_positions[current_pos[0]][current_pos[1]]
	let legal_moves = available_moves(chess_piece.piece, chess_piece.position, piece_positions)
	console.log(legal_moves)
	console.log(move_pos)
	if (legal_moves.includes(move_pos)) {
		console.log('Legal move')
	}
	else {
		console.log('Illegal move')
	}

	//After confirming the move is legal
	console.log("Attempting to swap " + current_pos + " with " + move_pos);

	let temp = piece_positions[current_pos[0]][current_pos[1]];
	let temp2 = piece_positions[current_pos[0]][current_pos[1]].position;

	piece_positions[current_pos[0]][current_pos[1]] = piece_positions[move_pos[0]][move_pos[1]];
	piece_positions[current_pos[0]][current_pos[1]] = piece_positions[move_pos[0]][move_pos[1]].position;
	piece_positions[move_pos[0]][move_pos[1]] = temp;
	piece_positions[move_pos[0]][move_pos[1]].position = temp2;
	refresh_board()
	console.log("Success")

}

function clicked_piece(td){
	console.log("Clicked");
	console.log(td.id);
	
	if (document.getElementsByClassName('clicked first').length === 1){
		td.classList.add("clicked");
		td.classList.add("second");
	}
	else {
		td.classList.add("clicked");
		td.classList.add("first");
	}

	if (document.getElementsByClassName('clicked').length === 2){
		let first_element = document.getElementsByClassName('clicked first')[0];
		let second_element = document.getElementsByClassName('clicked second')[0];

		console.log("Attempting to swap " + first_element.id + " with " + second_element.id);

  		first_element.classList.remove("clicked");
  		first_element.classList.remove("first");

		second_element.classList.remove("clicked");
		second_element.classList.remove("second");
		move_piece(first_element.id.split(","), second_element.id.split(","));
	}
}


function refresh_board(){
	for (let i = 1; i < 9; i++) {
	    for (let j = 1; j < 9; j++) {
	    	let current_tile = document.getElementById([i-1, j-1])
	    	current_tile.style.backgroundImage = `url('ChessPieceImages/${chess_piece_url}${piece_positions[i-1][j-1].color}_${piece_positions[i-1][j-1].piece}.png')`
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



function available_moves(piece, position, board){
	let available_moves = [];
	
	if (piece == "Rook") {
		for (let x; x < 9; x++) {
			for (let y; y < 9; y++) {
				if (position[0] == x && position[1] != y) {
					available_moves.push([x, y]);
				}
				if (position[0] != x && position[1] == y) {
					available_moves.push([x, y]);
				}
			}
		}
	}

	if (piece == "Knight") {
		let moves = [
		[2, 1], [-2, 1], [2, -1], [-2, -1], [1, 2], [-1, 2], [1, -2], [-1, -2]
		];
		for (let i = 0; i < moves.length; i++) {
			testing_pos = [...position];
			testing_pos[0] += moves[i][0];
			testing_pos[1] += moves[i][1];

			if (testing_pos[0] < 8 && testing_pos[0] >= 0) {
				if (testing_pos[1] > 8 && testing_pos[1] >= 0) {
					available_moves.push(testing_pos);
				}
			}
		}
	}
	return available_moves
}