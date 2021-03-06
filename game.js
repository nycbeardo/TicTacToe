var origBoard;
const aiPlayer = 'O';
const huPlayer = 'X';


// winCombos checks for the following winning combinations 
const winCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [6, 4, 2]
];

const cells = document.querySelectorAll('.cell');
startGame();


//this function allows the game to start and sets up parameters for the board 

function startGame() {
  document.querySelector(".endgame").style.display = "none";
  origBoard = Array.from(Array(9).keys());
  for (var i = 0; i < cells.length; i++) {
    cells[i].innerText = '';
    cells[i].style.removeProperty('background-color');
    cells[i].addEventListener('click', turnClick, false);
  }
}

function turnClick(square) {
  if (typeof origBoard[square.target.id] == 'number') {
    turn(square.target.id, huPlayer);
    if (!checkWin(origBoard, huPlayer) && !checkTie()) turn(bestSpot(), aiPlayer);
  }
}

function turn(squareId, player) {
  origBoard[squareId] = player;
  document.getElementById(squareId).innerText = player;
  let gameWon = checkWin(origBoard, player);
  if (gameWon) gameOver(gameWon);
}

function checkWin(board, player) {
  let plays = board.reduce((a, e, i) =>
    (e === player) ? a.concat(i) : a, []);
  let gameWon = null;
  for (let [index, win] of winCombos.entries()) {
    if (win.every(elem => plays.indexOf(elem) > -1)) {
      gameWon = {
        index: index,
        player: player
      };
      break;
    }
  }
  return gameWon;
}

//this detemines behavior and output when winner is chosen
function gameOver(gameWon) {
  for (let index of winCombos[gameWon.index]) {
    document.getElementById(index).style.backgroundColor =
      gameWon.player == huPlayer ? "blue" : "red";
  }
  for (var i = 0; i < cells.length; i++) {
    cells[i].removeEventListener('click', turnClick, false);
  }
  declareWinner(gameWon.player == huPlayer ? "You win!" : "You lose.");
}

//identifies winner of game 
function declareWinner(who) {
  document.querySelector(".endgame").style.display = "block";
  document.querySelector(".endgame .text").innerText = who;
}

//this returns board back to original state
function emptySquares() {
  return origBoard.filter(s => typeof s == 'number');
}


function bestSpot() {
  return minimax(origBoard, aiPlayer).index;
}

//check to see if theres a tied game or not 
function checkTie() {
  if (emptySquares().length == 0) {
    for (var i = 0; i < cells.length; i++) {
      cells[i].style.backgroundColor = "green";
      cells[i].removeEventListener('click', turnClick, false);
    }
    declareWinner("Tie Game!");
    return true;
  }
  return false;
}


//main minimax function 

function minimax(newBoard, player) 
{

  //checks for next two empty spots
  var availSpots = emptySquares();


  // return value if terminal state is found
  if (checkWin(newBoard, huPlayer)) {
    return {
      score: -10 //assigned value
    };
  } else if (checkWin(newBoard, aiPlayer)) {
    return {
      score: 20 //assigned value
    };
  } else if (availSpots.length === 0) {     //when theres no more spots, returns a tie = 0
    return {
      score: 0
    };
  }


  //recursion
  //collect moves and scores for each player
  var moves = [];
  for (var i = 0; i < availSpots.length; i++) {
    var move = {};
    move.index = newBoard[availSpots[i]];
    newBoard[availSpots[i]] = player;

  //when next player turn minimax is called again 

    if (player == aiPlayer) {
      var result = minimax(newBoard, huPlayer);
      move.score = result.score;
     
    } else {
      var result = minimax(newBoard, aiPlayer);
      move.score = result.score;
      
     
    }

    //sets time delay for huPlayer and aiPlayer
    myVar = setTimeout(minimax, 4000);
      clearTimeout(myVar);


      //resets board
    newBoard[availSpots[i]] = move.index;

// pushes moves object to move array
    moves.push(move);
  }

  var bestMove;
  if (player === aiPlayer) {
    var bestScore = -10000;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    var bestScore = 10000;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  // return the players chosen move (object) from the array
  return moves[bestMove];
}
