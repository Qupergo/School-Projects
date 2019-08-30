var piece_positions = [ ["Rook", "Knight", "Bishop", "King", "Queen", "Bishop", "Knight", "Rook"],
					   	["Pawn", "Pawn", "Pawn", "Pawn", "Pawn", "Pawn", "Pawn", "Pawn"],
					   	["Empty", "Empty", "Empty", "Empty", "Empty", "Empty", "Empty", "Empty"],
						["Empty", "Empty", "Empty", "Empty", "Empty", "Empty", "Empty", "Empty"],
						["Empty", "Empty", "Empty", "Empty", "Empty", "Empty", "Empty", "Empty"],
						["Empty", "Empty", "Empty", "Empty", "Empty", "Empty", "Empty", "Empty"],
						["Pawn", "Pawn", "Pawn", "Pawn", "Pawn", "Pawn", "Pawn", "Pawn"],
						["Rook", "Knight", "Bishop", "King", "Queen", "Bishop", "Knight", "Rook"]
						];



function clicked_piece(td){
	console.log("Clicked")
	console.log(td.id);
}


function create_board(){
	var table = document.createElement("table");
	table.className = "mainChessBoard";
	for (var i = 1; i < 9; i++) {
	    var tr = document.createElement('tr');
	    for (var j = 1; j < 9; j++) {
	        var td = document.createElement('td');
	        td.id = piece_positions[i-1][j-1];
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

	if (piece == "Bishop")

	return available_moves
}