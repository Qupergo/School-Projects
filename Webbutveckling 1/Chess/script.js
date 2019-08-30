class chess_piece {
  constructor(position, color, piece, starting_square) {
    this.position = position;
    this.color = color;
    this.piece = piece
    this.identifier = starting_square
  }
}

//White pieces
var white_rook_a = new chess_piece([0,0], "White", "Rook", "A");
var white_rook_h = new chess_piece([0,7], "White", "Rook", "H");
var white_knight_b = new chess_piece([0, 1], "White", "Knight", "B");
var white_knight_g = new chess_piece([0, 6], "White", "Knight", "G");
var white_bishop_c = new chess_piece([0, 2], "White", "Bishop", "C");
var white_bishop_f = new chess_piece([0, 5], "White", "Bishop", "F");
var white_king = new chess_piece([0, 3], "White", "King", "D");
var white_queen = new chess_piece([0, 4], "White", "Queen", "E");
var white_pawns = [new chess_piece([1, 0], "White", "Pawn", "A"), new chess_piece([1, 1], "White", "Pawn", "B"), new chess_piece([1, 2], "White", "Pawn", "C"), new chess_piece([1, 3], "White", "Pawn", "D"), new chess_piece([1, 4], "White", "Pawn", "E"), new chess_piece([1, 5], "White", "Pawn", "F"), new chess_piece([1, 6], "White", "Pawn", "G"), new chess_piece([1, 7], "White", "Pawn", "G")];



//Black pieces
var black_rook_a = new chess_piece([7,0], "Black", "Rook", "A");
var black_rook_h = new chess_piece([7,7], "Black", "Rook", "H");
var black_knight_b = new chess_piece([7, 1], "Black", "Knight", "B");
var black_knight_g = new chess_piece([7, 6], "Black", "Knight", "G");
var black_bishop_c = new chess_piece([7, 2], "Black", "Bishop", "C");
var black_bishop_f = new chess_piece([7, 5], "Black", "Bishop", "F");
var black_king = new chess_piece([7, 3], "Black", "King", "D");
var black_queen = new chess_piece([7, 4], "Black", "Queen", "E");
var black_pawns = [new chess_piece([1, 0], "Black", "Pawn", "A"), new chess_piece([1, 1], "Black", "Pawn", "B"), new chess_piece([1, 2], "Black", "Pawn", "C"), new chess_piece([1, 3], "Black", "Pawn", "D"), new chess_piece([1, 4], "Black", "Pawn", "E"), new chess_piece([1, 5], "Black", "Pawn", "F"), new chess_piece([1, 6], "Black", "Pawn", "G"), new chess_piece([1, 7], "Black", "Pawn", "G")];




var piece_positions = [ [white_rook_a, white_knight_b, white_bishop_c, white_king, white_queen, white_bishop_f, white_knight_g, white_rook_h],
					   	[white_pawns[0], white_pawns[1], white_pawns[2], white_pawns[3], white_pawns[4], white_pawns[5], white_pawns[6], white_pawns[7]],
					   	["Empty", "Empty", "Empty", "Empty", "Empty", "Empty", "Empty", "Empty"],
						["Empty", "Empty", "Empty", "Empty", "Empty", "Empty", "Empty", "Empty"],
						["Empty", "Empty", "Empty", "Empty", "Empty", "Empty", "Empty", "Empty"],
						["Empty", "Empty", "Empty", "Empty", "Empty", "Empty", "Empty", "Empty"],
						[black_pawns[0], black_pawns[1], black_pawns[2], black_pawns[3], black_pawns[4], black_pawns[5], black_pawns[6], black_pawns[7]],
						[black_rook_a, black_knight_b, black_bishop_c, black_king, black_queen, black_bishop_f, black_knight_g, black_rook_h]
						];


function move_piece(current_pos, move_pos){

	//After confirming the move is legal
	var temp = piece_positions[current_pos[0]][current_pos[1]];
	piece_positions[current_pos[0]][current_pos[1]] = piece_positions[move_pos[0]][move_pos[1]];
	piece_positions[move_pos[0]][move_pos[1]] = temp;
}

function clicked_piece(td){
	console.log("Clicked");
	console.log(td.id);
}


function create_board(){
	var table = document.createElement("table");
	table.className = "mainChessBoard";
	for (var i = 1; i < 9; i++) {
	    var tr = document.createElement('tr');
	    for (var j = 1; j < 9; j++) {
	        var td = document.createElement('td');
	        td.id = piece_positions[i-1][j-1].piece;
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
	var available_moves = [];
	if (piece == "Rook"){
		for (var x; x < 9; x++) {
			for (var y; y < 9; y++){
				if (position[0] == x && position[1] != y){
					available_moves.push([x, y]);
				}
				if (position[0] != x && position[1] == y){
					available_moves.push([x, y]);
				}
			}
		}
	}

	if (piece == "Knight"){
		var moves = [[2, 1], [-2, 1], [2, -1], [-2, -1], [1, 2], [-1, 2], [1, -2], [-1, -2]];
		for (var i = 0; i < moves.length; i--) {
			testing_pos = position
			testing_pos[0] += moves[i][0];
			testing_pos[1] += moves[i][0];
			if (testing_pos[0] < 8 && testing_pos[0] >= 0)
			{
				if (testing_pos[1] < 8 && testing_pos[1] >= 0){
					available_moves.push(testing_pos);
				}
			}
		}
	}

	return available_moves
}