let originBoard;
const huPlayer = 'X';
const aiPlayer = 'O';
const winCombos = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],	
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[2, 4, 6]
]

const cells = document.querySelectorAll('.cell');

// Démarre la partie en initialisant le plateau et en créant un événement sur chaque case
startGame = () => {
	document.querySelector('.end-message').style.display = 'none';
	originBoard = Array.from(Array(9).keys());
	for(let i = 0; i < cells.length; i++){
		cells[i].innerText = '';
		cells[i].style.removeProperty('background-color');
		cells[i].addEventListener('click', turnClick, false);
	}
}

// Fonction qui permet de changer le joueur en fonction de la case cliquée et de vérifier si la partie est gagnée ou non 
turnClick = (square) => {
	if (typeof originBoard[square.target.id] == 'number') {
		turn(square.target.id, huPlayer)
		if (!checkWin(originBoard, huPlayer) && !checkTie()) turn(bestSpot(), aiPlayer);
	}
}

// Fonction qui permet de changer le joueur en fonction de la case cliquée et de vérifier si la partie est gagnée ou non
turn = (squareId, player) => {
	originBoard[squareId] = player;
	document.getElementById(squareId).innerText = player;
	let gameWon = checkWin(originBoard, player)
	if (gameWon) gameOver(gameWon)
}

// Fonction qui permet de vérifier si la partie est gagnée ou non 
checkWin = (board, player) => {
	let plays = board.reduce((a, e, i) =>
		(e === player) ? a.concat(i) : a, []);
	let gameWon = null;
	for (let [index, win] of winCombos.entries()) {
		if (win.every(elem => plays.indexOf(elem) > -1)) {
			gameWon = {index: index, player: player};
			break;
		}
	}
	return gameWon;
}

// Fonction qui permet de vérifier si la partie est gagnée ou non
gameOver = (gameWon) => {
	// On enlève l'événement sur les cases du plateau
	for (let index of winCombos[gameWon.index]) {
		document.getElementById(index).style.backgroundColor =
			gameWon.player == huPlayer ? "blue" : "red";
	}
	for (var i = 0; i < cells.length; i++) {
		cells[i].removeEventListener('click', turnClick, false);
	}
	// On déclare le gagnant et on affiche le message
	declareWinner(gameWon.player == huPlayer ? "Tu as gagné!" : "Tu as perdu.");
}


declareWinner = (who) => {
	document.querySelector(".end-message").style.display = "block";
	document.querySelector(".end-message").innerText = who;
}


emptySquare = () => {
	return originBoard.filter(s => typeof s == 'number');
}

// Cherche la case la plus favorable pour le joueur ia avec la fonction minimax
bestSpot = () => {
	return minimax(originBoard, aiPlayer).index;
}

// Fonction qui permet de vérifier si la partie est nulle ou non
checkTie = () => {
	// On vérifie si les cases du plateau sont vide
	if (emptySquare().length == 0) {
		for (var i = 0; i < cells.length; i++) {
			cells[i].style.backgroundColor = "green";
			cells[i].removeEventListener('click', turnClick, false);
		}
		// On affiche le message de match nul
		declareWinner("Egalité!");
		return true;
	}
	return false;
}

//
minimax = (newBoard, player) => {
	// Récupère les cases vides
	var availSpots = emptySquare();

	// Si le joueur a gagné, on retourne un score de 10
	if (checkWin(newBoard, huPlayer)) {
		return {score: -10};
	// Si l'ia a gagné, on retourne un score de -10
	} else if (checkWin(newBoard, aiPlayer)) {
		return {score: 10};
	// Si la partie est nulle, on retourne un score de 0
	} else if (availSpots.length === 0) {
		return {score: 0};
	}
	var moves = [];
	// On crée un tableau de toutes les cases vides
	for (var i = 0; i < availSpots.length; i++) {
		var move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;

		// Si le joueur est l'ia, on ajoute le score de la case à la liste des coups possibles
		if (player == aiPlayer) {
			var result = minimax(newBoard, huPlayer);
			move.score = result.score;
		// Si le joueur est l'humain, on ajoute le score de la case à la liste des coups possibles
		} else {
			var result = minimax(newBoard, aiPlayer);
			move.score = result.score;
		}

		newBoard[availSpots[i]] = move.index;

		moves.push(move);
	}

	//	Si le joueur est l'ia, on retourne le score le plus élevé
	let bestMove;
	if(player === aiPlayer) {
		var bestScore = -10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}


startGame();