import React, {
  Component
} from 'react';
import './App.css';
import ReactDOM from 'react-dom';
import Fireworks from 'fireworks-react';
var squares = [];
var consumed = {};
var initialized = false;
const numBombs = 40, rows = 10, cols = 10;
var revealed = 0;
var correctlyFlagged = 0;
var inGame = false;
var SwitchElement;

class SideScreen extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div id="mySidenav" className="sidenav">
          <a href="" className="closebtn" onclick={closeNav()}>&times;</a>

         
          <button className="addSubtract">
          
            <img src="https://cdn4.iconfinder.com/data/icons/medical-and-health-2/128/Medical_Medical-512.png" width="100%" height="100%" />
          </button>;

          <button className="addSubtract">
            <img src="https://png.icons8.com/metro/1600/minus-math.png" width="100%" height="100%" />
          </button>;

          <a href="#">About</a>
          <a href="#">Services</a>
          <a href="#">Clients</a>
          <a href="#">Contact</a>
        </div>
        <span className="openButton" onClick={openNav}>&#9776; Settings</span>
      </div>
    );
  }
}

class Switch extends React.Component {
  constructor(props) {
    super(props);
    this.state = { inFlaggingMode: false };
    this.handleFlaggingModeSwitch = this.handleFlaggingModeSwitch.bind(this);
    SwitchElement = this;
  }

  handleFlaggingModeSwitch() {
    this.setState({ inFlaggingMode: !this.state.inFlaggingMode });
  }

  render() {
    var image;
    if (this.state.inFlaggingMode)
      image = <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Minesweeper_flag.svg/120px-Minesweeper_flag.svg.png" width="100%" height="100%" />;
    else
      image = <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Minesweeper_0.svg/120px-Minesweeper_0.svg.png" width="100%" height="100%" />;

    return (
      <button className="square flagBox" onClick={this.handleFlaggingModeSwitch}>
        {image}
      </button>

    );

  }
}

class Square extends React.Component {

  constructor(props) {
    super(props);
    this.state = { isClicked: false };
    this.state = { isFlagged: false };
    this.state = { isBomb: props.isBomb == 'X' ? 'X' : props.isBomb };
    //  this.state={isBomb: props.isBomb=='X'};   
    this.handleClick = this.handleClick.bind(this);
    this.handleFlags = this.handleFlags.bind(this);
    this.changeNumber = this.changeNumber.bind(this);
    this.row = props.row;
    this.col = props.col;
    squares.push(this);
  }

  changeNumber(newNumber) {
    this.setState({ isBomb: newNumber });
  }

  checkIfGameOver() {
    //you win!
    if (revealed == (rows * cols - numBombs) && correctlyFlagged == numBombs) {
      youWin();
    }
  }

  changeState() {

    revealed++;

    this.checkIfGameOver();
    this.setState({ isClicked: true });
  }

  handleFlags() {
    //should be flagged
    if (this.state.isBomb == 'X') {
      if (!this.state.isFlagged) {
        correctlyFlagged++;
      }
      else {
        correctlyFlagged--;
      }
    }
    this.checkIfGameOver();
    this.setState({ isFlagged: !this.state.isFlagged });

  }

  doFlagClick() {
    var checkIfFlagged = true;
    this.updateNeighbors(checkIfFlagged);
  }

  updateNeighbors(checkIfFlagged) {

    var arr = [];

    for (var i = -1; i <= 1; i++) {
      for (var j = -1; j <= 1; j++) {
        var tempRow = this.row + i;
        var tempCol = this.col + j;

        if (tempRow >= 0 && tempRow < rows && tempCol >= 0 && tempCol < cols) {

          var curr_square = squares[tempRow * cols + tempCol];
          var condition = checkIfFlagged ? !curr_square.state.isFlagged : true;
          //trying to reveal bomb
          if (checkIfFlagged && !curr_square.state.isFlagged && curr_square.state.isBomb == 'X') youLose();
          if (!curr_square.state.isClicked) {
            if (curr_square.state.isBomb != 'X' && condition) {
              console.log(curr_square.state.isBomb);

              if (consumed[curr_square.props.id] == null) {
                curr_square.changeState();
                consumed[curr_square.props.id] = 'consumed';
                if (curr_square.state.isBomb == 0 && !curr_square.state.isClicked) {
                  curr_square.updateNeighbors(false);
                }
              }

            }
          }
        }
      }
    }
    for (var i = 0; i < arr.length; i++) {

    }
  }

  handleClick(e) {
    if (!initialized) {
      initialized = true;
      if (!this.state.isBomb == 0) {
        fixInitialization(this.row, this.col);

      }
      this.handleClick(e);
    }
    else {
      var isFlagged = SwitchElement.state.inFlaggingMode;
      var isClicked = this.state.isClicked;
      //In Flagging mode

      if (!isClicked) {
        if (isFlagged) {
          this.handleFlags();
        }
        else {
          if (this.state.isBomb == 'X') {
            youLose();
          }
          else
            this.updateNeighbors(false);
        }
      }
      else {

        if (getNeighboringFlags(this.row, this.col) == this.state.isBomb) {
          this.doFlagClick();
        }

      }
    }
  }

  render() {

    const isClicked = this.state.isClicked;
    const isFlagged = this.state.isFlagged;
    var button;

    if (isClicked) {
      // if (this.state.isBomb == '-1') {
      //   button = <button className="square" onClick={this.handleClick}>{this.state.isBomb}
      //   </button>
      // }
      // else {
      button = <button className="square" onClick={this.handleClick}>
        <img src={getImage(this.state.isBomb)} width="100%" height="100%" />
      </button>;

    } else {
      if (isFlagged) {
        button = <button className="square" onClick={this.handleClick}>
          <img src="https://banner2.kisspng.com/20180325/kqe/kisspng-minesweeper-computer-icons-bing-maps-video-game-mines-5ab7a191c79531.0286407715219838898175.jpg" width="100%" height="100%" />
        </button>
      }
      else {
        button = <button className="square" onClick={this.handleClick}>
        </button>
      }
    }

    return button;
  }
}

class Board extends React.Component {

  constructor(props) {
    super(props);
    this.props = props;
  }



  render() {

    // var rows=10;
    // var cols=10;
    var shuffled = createShuffled();
    var neighboringBombs = NeighboringBombs(shuffled);
    var board = createBoard(neighboringBombs);
    return board;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    //this.board = props.board;
    revealed = 0;
    correctlyFlagged = 0;
    consumed = {};
    inGame = true;
    this.state = { board: props.board };
    this.updateBoard = this.updateBoard.bind(this);

  }

  updateBoard(neighboringBombs) {

  }



  render() {


    return (
      <html>
        <head>
          <title>Minesweeper</title>
        </head>
        <h1>Minesweeper</h1>
        <body className="background">
          <div>
            <SideScreen />
            <Board id="Board" className="" />
            <Switch id="Switch" ref="Switch"></Switch>
          </div>
        </body>
      </html>
    );
  };



}

function NeighboringBombs(arr) {
  var neighboringBombs = [];
  for (var i = 0; i < arr.length; i++) {
    var count = 0;
    for (var j = -1; j <= 1; j++) {
      for (var k = -1; k <= 1; k++) {
        var tempRow = Math.trunc(i / cols) + j;
        var tempCol = i % cols + k;
        if (tempRow >= 0 && tempRow < rows && tempCol >= 0 && tempCol < cols && !(i == 0 && j == 0)) {
          if (arr[tempRow * cols + tempCol] == 'X')
            count++;
        }
      }
    }
    if (arr[i] == 'X')
      neighboringBombs.push('X');
    else
      neighboringBombs.push(count);
  }
  return neighboringBombs;
}

function fixInitialization(row, col) {
  while (true) {
    var shuffled = createShuffled();
    var neighboringBombs = NeighboringBombs(shuffled);
    if (neighboringBombs[row * cols + col] == 0) {

      for (var i = 0; i < neighboringBombs.length; i++) {
        squares[i].changeNumber(neighboringBombs[i]);
      }
      //createBoard(neighboringBombs));
      return;
    }
  }
}

function getImage(isBomb) {
  switch (isBomb) {
    //bomb
    case 'X':
      return "https://banner2.kisspng.com/20180325/kqe/kisspng-minesweeper-computer-icons-bing-maps-video-game-mines-5ab7a191c79531.0286407715219838898175.jpg";
    case 0:
      return "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Minesweeper_0.svg/120px-Minesweeper_0.svg.png";
    case 1:
      return "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Minesweeper_1.svg/2000px-Minesweeper_1.svg.png";
    case 2:
      return "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Minesweeper_2.svg/76px-Minesweeper_2.svg.png";
    case 3:
      return "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Minesweeper_3.svg/120px-Minesweeper_3.svg.png";
    case 4:
      return "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Minesweeper_4.svg/120px-Minesweeper_4.svg.png";
    case 5:
      return "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Minesweeper_5.svg/120px-Minesweeper_5.svg.png";
    case 6:
      return "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Minesweeper_6.svg/120px-Minesweeper_6.svg.png";
    case 7:
      return "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Minesweeper_7.svg/120px-Minesweeper_7.svg.png";
    case 8:
      return "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Minesweeper_8.svg/120px-Minesweeper_8.svg.png";
    default:
      return null;
  }
}

function createBoard(neighboringBombs) {

  var arr = [];
  for (var i = 0; i < rows; i++) {
    arr.push(createRow(neighboringBombs.splice(0, cols), i));
  }
  var squareWidth = 110;
  var totalWidth = (squareWidth * cols) + 'px';
  return (
    <ul style={{ width: totalWidth }} key='board' ref='board' id='board'>
      {arr.map(function (row, index) {
        return (
          <ul key={index}>
            {row}
          </ul>);
      })}
    </ul>
  )
}

function createRow(square_nums, row) {
  return (
    <ul>
      {square_nums.map(function (number, index) {
        var total = index + row * cols + "";
        return <Square key={total} isBomb={number} id={total} row={row} col={index}></Square>;
      })}
    </ul>
  )
}
function createShuffled() {
  var bombs = [];
  for (var i = 0; i < rows * cols; i++) {
    bombs.push(i < numBombs ? 'X' : 0);
  }

  let shuffled = bombs
    .map((a) => ({ sort: Math.random(), value: a }))
    .sort((a, b) => a.sort - b.sort)
    .map((a) => a.value)

  return shuffled;
}

function getNeighboringFlags(row, col) {
  var total = 0;
  for (var i = -1; i <= 1; i++) {
    for (var j = -1; j <= 1; j++) {
      var index = cols * (row + i) + col + j;
      if (index >= 0 && index < rows * cols) {
        var currentSquare = squares[index];
        if (currentSquare.state.isFlagged) total++;
      }
    }
  }
  return total;
}

function switchFlags() {
  // document.getElementById ("balklongwaarde").addEventListener("click", function(){ //changeIdValue("balklongwaarde", "60px")
  //  });
  window.onkeydown = function (e) {
    var letterPressed = String.fromCharCode(e.keyCode ? e.keyCode : e.which);
    //Flag only when in game
    if (letterPressed == 'F' && inGame) {
      // var switch_element = document.getElementById("Switch");
      SwitchElement.handleFlaggingModeSwitch();
    }
  };
}

function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
  var x = document.getElementById("mySidenav")
  if (x != null) x.style.width = "0px";
}

function youWin() {
  console.log('u win');
  inGame = false;

  var renderObject = (
    <body>
      <div id="mySidenav" className="sidenav">
        <a href="javascript:void(0)" className="closebtn" onclick="closeNav()">&times;</a>
        <a href="#">About</a>
        <a href="#">Services</a>
        <a href="#">Clients</a>
        <a href="#">Contact</a>
      </div>
      <span style="font-size:30px;cursor:pointer" onclick="openNav()">&#9776; open</span>
      <text className="firework">I love SVG!</text>

    </body>
  );
  ReactDOM.render(renderObject, document.getElementById("root"));

}

function youLose() {
  console.log('you lose');
  inGame = false;
}

switchFlags();

export default Game;