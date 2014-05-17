var machine = 'hal';
var human = 'human';
var currentPlayer = null;
var isWinner = false;
var attack = null;
var counterAttack = null;
var prevHumanMove = null;
var prevMachineMove = null;

var spaces = [
  NaN, NaN, NaN,
  NaN, NaN, NaN,
  NaN, NaN, NaN
];

function resetGame(){
  $('.space').removeClass('hal').removeClass('human');

  spaces = [
    NaN, NaN, NaN,
    NaN, NaN, NaN,
    NaN, NaN, NaN
  ];
  currentPlayer = null;
  isWinner = false;
  attack = null;
  counterAttack = null;
  prevHumanMove = null;
  prevMachineMove = null;
  setFirstPlayer();
}

// Choose first player at random
function setFirstPlayer(){
  var chance = Math.random();
  if (chance < 0.50){
    // If machine, choose center or corner space at random
    currentPlayer = machine;
    if (chance < 0.25){
      markSpace(4);

      // Set attack to the strategy of blocking by T shape
      attack = "t";
      setNextTurn();
    }
    else{
      var index = Math.floor((Math.random()*10)%4)
      var arr = [0, 2, 6, 8];
      var mark = arr[index];
      markSpace(mark);

      // Set attack to blocking by triangle shape
      prevMachineMove = mark;
      attack = "triangle";
      setNextTurn();
    }
  }
  else{
    currentPlayer = machine;
    setNextTurn();
  }
}

// Allow human to make a move
function foolishHuman(){
  $(document).on('click', '#board .space', function(e) {
    var spaceIndex = $(e.currentTarget).index();
    if(spaces[spaceIndex]){
      return false;
    }

      markSpace(spaceIndex);
      prevHumanMove = spaceIndex;

      if (attack == null && counterAttack == null){
        counterAttack = setCounterAttack();
      }
      setNextTurn();
  });
}

// For case when machine goes first, chooses machine strategy.
// If a winning move can be made or prevented, that move is passed to the
// function that handles the strategy, either blockingTshape or blockingTriangle
function attackMethod(){
  var blockMove = countMarks(human);
  var winMove = countMarks(machine);

  if (attack == 't'){
    if (winMove.length > 0){
      blockingTShape(winMove);
    }
    else if (blockMove.length > 0){
      blockingTShape(blockMove);
    } else{
      blockingTShape([])
    }
  }
  else{
    if(winMove.length > 0){
      blockingTriangle(winMove);
    }
    else if(blockMove.length > 0){
      blockingTriangle(blockMove);
    } else{
      blockingTriangle([]);
    }
  }
}

// Chooses machine strategy for case when human goes first.
// If a winning move can be made or prevented, that move is passed to the function
// that handles the strategy: counterCenter, counterCorner, or counterEdge
function counterAttackMethod(){
  var blockMove = countMarks(human);
  var winMove = countMarks(machine);
  if (counterAttack == "center"){
    if (winMove.length > 0){
      counterCenter(winMove);
    }
    else if (blockMove.length > 0){
      counterCenter(blockMove);
    }
    else {
      counterCenter([]);
    }
  }
  else if(counterAttack == "corner"){
    if (winMove.length > 0){
      counterCorner(winMove);
    }
    else if (blockMove.length > 0){
      counterCorner(blockMove);
    }
    else {
      counterCorner([]);
    }
  }
  else {
    if (winMove.length > 0){
      counterEdge(winMove);
    }
    else if (blockMove.length > 0){
      counterEdge(blockMove);
    }
    else{
      counterEdge([]);
    }
  }
}

// Check if there are any moves that result in a win
// or that should be blocked
function countMarks(player){
  var row1Arr = [0, 1, 2];
  var row2Arr = [3, 4, 5];
  var row3Arr = [6, 7, 8];

  var col1Arr = [0, 3, 6];
  var col2Arr = [1, 4, 7];
  var col3Arr = [2, 5, 8];

  var diag1Arr = [0, 4, 8]; //Right sloping
  var diag2Arr = [2, 4, 6]; //Left sloping

  var row1 = 0, row2 = 0, row3 = 0;
  var col1 = 0, col2 = 0, col3 = 0;

  var diag1 = 0, diag2 = 0;
  var result = [];

  // Check for possible column wins
  for (var i = 0; i < 9; i++){

    if (spaces[i] == player){
      if (i % 3 == 0){
      col1++;
      index = col1Arr.indexOf(i);
      col1Arr.splice(index, 1);
      if (col1 == 2){
        if (!spaces[col1Arr[0]]){
          return col1Arr;
        }
      }
    }

    else if(i % 3 == 1){
      col2++;
      index = col2Arr.indexOf(i);
      col2Arr.splice(index, 1);
      if (col2 == 2){
        if (!spaces[col2Arr[0]]){
          return col2Arr;
        }
      }
    }
    else{
      col3++;
      index = col3Arr.indexOf(i);
      col3Arr.splice(index, 1);
      if (col3 == 2){
        if (!spaces[col3Arr[0]]){
          return col3Arr;
        }
      }
    }
    }
  }

  // Check for possible row wins
  for (var n = 0; n < 9; n++){
    if (spaces[n] == player){
      if (n < 3){
        row1++;
        index = row1Arr.indexOf(n);
        row1Arr.splice(index, 1);
        if (row1 == 2){
          if (!spaces[row1Arr[0]]){
            return row1Arr;
          }
        }
      }
      else if(n < 6){
        row2++;
        index = row2Arr.indexOf(n);
        row2Arr.splice(index, 1);
        if (row2 == 2){
          if (!spaces[row2Arr[0]]){
            return row2Arr;
          }
        }
      }
      else{
        row3++;
        index = row3Arr.indexOf(n);
        row3Arr.splice(index, 1);
        if (row3 == 2){
          if(!spaces[row3Arr[0]]){
            return row3Arr;
          }
        }
      }
    }
  }

  // Check for possible diagonal wins
  if (spaces[4] == player){
    diag1++;
    diag2++;
    diag1Arr.splice(1, 1);
    diag2Arr.splice(1, 1);
  }
  for (var m = 0; m < 9; m++){
    if (spaces[m] == player && m != 4){
      if (m % 4 == 0){
        diag1++;
        index = diag1Arr.indexOf(m);
        diag1Arr.splice(index, 1);
        if (diag1 == 2){
          if(!spaces[diag1Arr[0]]){
            return diag1Arr;
          }
        }
      }
      else if (m % 2 == 0){
        diag2++;
        index = diag2Arr.indexOf(m);
        diag2Arr.splice(index, 1);
        if (diag2 == 2){
          if(!spaces[diag2Arr[0]]){
            return diag2Arr;
          }
        }
      }
    }
  }
  return result;
}

// Handles strategy of placing marks in a t-shape to guarantee two ways to win
function blockingTShape(nextMove){
  var moveMade = 0;
  if (nextMove.length > 0){
    var spaceIndex = nextMove[0];
    markSpace(spaceIndex);
    setNextTurn();
  }
  // Human move falls on a corner
  else{
    if (prevHumanMove % 2 == 0){
      var cornerArr = [0, 2, 6, 8];
      for (var i = 0; i < 4; i++){
        sum = prevHumanMove + cornerArr[i];
        if (sum == 8){
          markSpace(cornerArr[i]);
          break;
        }
      }
    }
  // Human move falls on an edge
    else {
      var chance = Math.random();
      // Randomly select a furthest corner
      if (chance < 0.50){
        if (prevHumanMove == 1){
            if(!spaces[6]){ markSpace(6); }
              else{ markSpace(8); }
        }
        else if (prevHumanMove == 3){
          if(!spaces[2]){ markSpace(2); }
            else{ markSpace(8); }
        }
        else if (prevHumanMove == 5){
          if(!spaces[0]) { markSpace(0); }
            else{ markSpace(6); }
        }
        else {
          if(!spaces[0]) {markSpace(0); }
            else { markSpace(2); }
        }
      }
      else{
        if (prevHumanMove == 1){
          if(!spaces[8]){ markSpace(8); }
            else{ markSpace(6); }
        }
        else if (prevHumanMove == 3){
          if(!spaces[8]) { markSpace(8); }
            else{ markSpace(2); }
        }
        else if (prevHumanMove == 5){
          if(!spaces[6]) {markSpace(6); }
            else{ markSpace(0); }
        }
        else {
          if(!spaces[2]) { markSpace(2); }
            else{ markSpace(0); }
        }
      }

    }
  setNextTurn();
  }
}

// Handles strategy of placing marks in a triangle shape, guaranteeing two
// ways to win.
function blockingTriangle(nextMove) {
  // Block human opponent's win
  var moveMade = 0;
  if (nextMove.length > 0){
    var spaceIndex = nextMove[0];
    spaces[spaceIndex] = currentPlayer;
    $('#board .space:eq(' + spaceIndex + ')').addClass(currentPlayer);
    setNextTurn();
  }
  // Human marks the center
  else{
    if (prevHumanMove == 4){
      var cornerArr = [0, 2, 6, 8];
      for (var i = 0; i < 4; i++){
        sum = prevMachineMove + cornerArr[i];
        if (sum == 8){
          markSpace(cornerArr[i]);
          break;
        }
      }
    }
    // Human marks edge or corner
    else{
      if (prevMachineMove == 0){
        if (prevHumanMove % 3 == 0){
          if(!spaces[2]){ markSpace(2); }
            else{ markSpace(8); }
          prevMachineMove = 2;
        }
        else{
          markSpace(6);
          prevMachineMove = 6;
        }
      }
      else if (prevMachineMove == 2){
        if (prevHumanMove % 3 == 2){
          if(!spaces[0]) { markSpace(0); }
            else{ markSpace(6); }
          prevMachineMove = 0;
        }
        else{
          markSpace(8);
          prevMachineMove = 8;
        }
      }
      else if (prevMachineMove == 6){
        if (prevHumanMove % 3 == 0){
          if(!spaces[8]) { markSpace(8); }
            else{ markSpace(2); }
          prevMachineMove = 8;
        }
        else{
          markSpace(0);
          prevMachineMove = 0;
        }
      }
      else{
        if (prevHumanMove % 3 == 2){
          if (!spaces[6]){ markSpace(6); }
            else{ markSpace(0); }
          prevMachineMove = 6;
        }
        else{
          markSpace(2);
          prevMachineMove = 2;
        }
      }

    } // end of edge move
  setNextTurn();
  }

}

function setCounterAttack(){
  if (prevHumanMove == 4){
    return "center";
  }
  else if (prevHumanMove % 2 == 0){
    return "corner";
  }
  else{
    return "edge";
  }
}

// Counter human move if first human move is center square
function counterCenter(nextMove) {
  var moveMade = 0;
  if (nextMove.length > 0){
    var spaceIndex = nextMove[0];
    markSpace(spaceIndex);
    setNextTurn();
  }
  else{
      index = findEmptyCorners();
      if (index >= 0){
        markSpace(index);
        setNextTurn();
      }
      // Mark a random space (index 4 is already marked)
      else
      {
        markSpace(4);
        setNextTurn();
      }
  }
}

// Counter human move when first human move is a corner
function counterCorner(nextMove) {
  var moveMade = 0;
  if (nextMove.length > 0){
    var spaceIndex = nextMove[0];
    markSpace(spaceIndex);
    setNextTurn();
  }
  else{
    if (!spaces[4]){
      markSpace(4);
    }
    else{
      index = Math.floor((Math.random()*10)%4);
      arr = [1, 3, 5, 7];
      mark = arr[index];
      if(!spaces[mark]){
        markSpace(mark);
      }
      else{
        for (var i = 0; i < 9; i++){
          if(!spaces[arr[i]]){
            markSpace(arr[i]);
            break;
          }
        }
      }
    }
    setNextTurn();
  }
}

// Counter human move when first human move is an edge
function counterEdge(nextMove){
  if (nextMove.length > 0){
    var spaceIndex = nextMove[0];
    markSpace(spaceIndex);
    setNextTurn();
  }
  else{
    if (!spaces[4]){
      markSpace(4);
    }
    else{
      var row1 = [0, 1, 2], row3 = [6, 7, 8];
      var col1 = [0, 3, 6], col3 = [2, 5, 8];
      var arrColl = [row1, row3, col1, col3];
      var interArr = [], intersection = [];

      for (var i = 0; i < 9; i++){
        if (spaces[i] == human){
          for (var m = 0; m < 4; m++){
            if (arrColl[m].indexOf(i) != -1){
              interArr.push(arrColl[m]);
            }
          }
        }
      }

      intersection = interArr[0].filter(function(n){
          return interArr[1].indexOf(n) != -1
        });

      if (intersection.length > 0){
        markSpace(intersection[0]);
      }
      else{
        index = findEmptyCorners();
        if (index >= 0){
          markSpace(index);

        }
        // Mark a random space (index 4 is already marked)
        else{
          markSpace(4);
        }
      }
    }
    setNextTurn();
  }
}

function markSpace(index){
  if(!spaces[index]){
    spaces[index] = currentPlayer;
    $('#board .space:eq(' + index + ')').addClass(currentPlayer);
  }
  else{
    var index = findEmptyIndex();
    spaces[index] = currentPlayer;
    $('#board .space:eq(' + index + ')').addClass(currentPlayer);
  }
}

// Find an empty space for the machine to mark
function findEmptyIndex(){
  var emptyIndices = [], index = null;
  for (var i = 0; i < 9; i++){
    if (!spaces[i]){
      emptyIndices.push(i);
    }
  }
  index = Math.floor((Math.random()*10)%emptyIndices.length);
  return emptyIndices[index];
}

// Find an empty corner for the machine to mark
function findEmptyCorners(){
  var emptyCorners = [], index = null;
  for (var i = 0; i < 9; i++){
    if (!spaces[i] && i%2 == 0 && i!=4){
      emptyCorners.push(i);
    }
  }

  if (emptyCorners.length > 0){
  index = Math.floor((Math.random()*10)%emptyCorners.length);
  return emptyCorners[index];
  }
  else{
    return -1;
  }
}

function setNextTurn() {
  var win = checkIfWon();
  var tie = checkIfTied();

  if (!win && !tie){
    if (currentPlayer == machine) {
      currentPlayer = human;
      $('#turn-label').text('Your turn, Dave.');
      foolishHuman();
    }
    else {
      currentPlayer = machine;
      $('#turn-label').text("I'm afraid I can't allow you to win.");
      $(document).off('click', '#board .space');
      $('.calculating').effect('pulsate', 'slow');

      // Set delay between human and machine move
      window.setTimeout(function(){
        if (attack){
            attackMethod();
          }
          else{
            counterAttackMethod();
          }
        }, 1500);
    }
  }
  else{
    if(!win){
      $('#turn-label').text('We are tied, Dave.');
    }
  }
}

function checkIfWon(){
  if ( spaces[0] === spaces[1] && spaces[1] === spaces[2]
    || spaces[3] === spaces[4] && spaces[4] === spaces[5]
    || spaces[6] === spaces[7] && spaces[7] === spaces[8]
    || spaces[0] === spaces[3] && spaces[3] === spaces[6]
    || spaces[1] === spaces[4] && spaces[4] === spaces[7]
    || spaces[2] === spaces[5] && spaces[5] === spaces[8]
    || spaces[0] === spaces[4] && spaces[4] === spaces[8]
    || spaces[2] === spaces[4] && spaces[4] === spaces[6]
  )
  {
    $(document).trigger('game-win',currentPlayer);
    return true;
  }
  return false;
}

function checkIfTied(){
  var allMarked = true;
  for(var i = 0; i < 9; i++){
    if (!spaces[i]){
      allMarked = false;
      break;
    }
  }

  if(!allMarked){
    return false;
  }
   return true;
}

$(document).on('click', '.reset', function(e){
  e.preventDefault();
  resetGame();
});

$(document).on('game-win', function(e, winner) {
  alert("You lose, Dave.");
});

// Start the game
setFirstPlayer();
