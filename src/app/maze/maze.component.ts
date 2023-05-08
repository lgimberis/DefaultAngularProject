import { Component, Output, EventEmitter } from '@angular/core';
import { MazeSquare } from '../maze-square';
import Mazes from '../../assets/Mazes.json';

const SQUARE_WIDTH_PIXELS = 118;
const SQUARE_HEIGHT_PIXELS = 75;
const IMG_URL_FLAG = '../../assets/Assignment Assets/Icons/flag-checkered.svg';

function parseMaze(mazeCollision: number[][]) {
  // Processes the given collision matrix as read directly from a JSON file
  // Runs various checks that the defined matrix is sensible with no mistakes
  // Extracts CSS classes for drawing the maze for each square

  let mazeSquares: MazeSquare[][] = Array(mazeCollision.length);
  for (let r = 0; r < mazeSquares.length; r++) {
    mazeSquares[r] = Array(mazeCollision[r].length);
    for (let c = 0; c < mazeSquares[r].length; c++) {
      mazeSquares[r][c] = {classNames: '', row: r, column: c, hasObject: false, objectImgURL: '', objectName: ''};
    }
  }
  const LEFT_VALUE = 8;
  const BOTTOM_VALUE = 4;
  const RIGHT_VALUE = 2;
  const TOP_VALUE = 1;
  const TOTAL_VALUE = LEFT_VALUE + BOTTOM_VALUE + RIGHT_VALUE + TOP_VALUE;
  const classValues = [
    [LEFT_VALUE, "maze-square-left"],
    [BOTTOM_VALUE, "maze-square-bottom"],
    [RIGHT_VALUE, "maze-square-right"],
    [TOP_VALUE, "maze-square-top"]
  ];
  function complainAboutSquare(r: Number, c: Number, s: string) {
    // Helper function to report errors with maze encoding
    console.error("Maze square (%d, %d) %s", r, c, s);
  }
  for (const [r, row] of mazeCollision.entries()) {
    for (const [c, squareValue] of row.entries()) {
      // Various checks that maze coding is correct:
      // Blatantly incorrect values outside the valid range
      if (squareValue < 0 || squareValue > TOTAL_VALUE) {
        complainAboutSquare(r, c, "has an invalid collision value");
      }

      // Because maze borders are encoded via bit flags we can use bitwise operators & and ^
      // To check which sides are set for each square
      // Top/bottom border problems
      if (r == 0) {
        // Top row
        if (!(squareValue & TOP_VALUE)) {
          complainAboutSquare(r, c, "is on the top edge but does not have collision on its top");
        }
      } else {
        // Has a square above
        if (Boolean(squareValue & TOP_VALUE) != Boolean(mazeCollision[r - 1][c] & BOTTOM_VALUE)) {
          complainAboutSquare(r, c, "does not match borders with the square above it");
        }
        // Bottom edge
        if (r == mazeCollision.length - 1 && !(squareValue & BOTTOM_VALUE)) {
          complainAboutSquare(r, c, "is on the bottom edge but does not have collision on its bottom");
        }
      } 

      // Left/right border problems
      if (c == 0) {
        // Left column
        if (!(squareValue & LEFT_VALUE)) {
          complainAboutSquare(r, c, "is on the left edge but does not have collision on its left");
        }
      } else {
        // Has a square to the left
        if (c > 0 && (Boolean(squareValue & LEFT_VALUE) != Boolean(mazeCollision[r][c - 1] & RIGHT_VALUE))) {
          complainAboutSquare(r, c, "does not match borders with the square left of it");
        }
        // Right edge
        if (c == row.length - 1 && !(squareValue & RIGHT_VALUE)) {
          complainAboutSquare(r, c, "is on the right edge but does not have collision on its right");
        } 
      }
      
      // Set HTML class name for display purposes
      for (const [value, className] of classValues) {
        if (squareValue & Number(value)) {
          mazeSquares[r][c].classNames += " " + String(className); 
        }
      }

    }
  }
  // Place flag
  const flagLocation = Mazes["maze-1"]["flagLocation"];
  let index = 0;
  for (let [r, row] of mazeSquares.entries()) {
    for (let [c, square] of row.entries()) {
      if (index == flagLocation) {
        mazeSquares[r][c].hasObject = true;
        mazeSquares[r][c].objectImgURL = IMG_URL_FLAG;
        mazeSquares[r][c].objectName = "Flag";
        break;
      }
      index++;
    }
  }
  return mazeSquares;
}

const MOVE_UP = 1;
const MOVE_RIGHT = 2;
const MOVE_DOWN = 4;
const MOVE_LEFT = 8;


@Component({
  selector: 'app-maze',
  templateUrl: './maze.component.html',
  styleUrls: ['./maze.component.css']
})
export class MazeComponent {
  numRows: number = 10;
  numColumns: number = 10;
  rows: number[] = Array(this.numRows).fill(0);
  mazeCollision: number[][] = Mazes["maze-1"]["mazeData"];
  maze: MazeSquare[][] = parseMaze(this.mazeCollision);
  playerRow: number = 0;
  playerColumn: number = 0;
  playerTop: number = SQUARE_HEIGHT_PIXELS;
  playerLeft: number = 0;
  movePlayer = (direction: number) => {
    if (direction & this.mazeCollision[this.playerRow][this.playerColumn]) {
      console.error("Invalid move direction given: %d at tile (%d, %d) with flag %d", 
        direction, this.playerRow, this.playerColumn, this.mazeCollision[this.playerRow][this.playerColumn]);
      return;
    }

    if (direction & MOVE_UP) {
      this.playerRow -= 1;
    } else if (direction & MOVE_RIGHT) {
      this.playerColumn += 1;
    } else if (direction & MOVE_DOWN) {
      this.playerRow += 1
    } else if (direction & MOVE_LEFT) {
      this.playerColumn -= 1;
    } else {
      console.error("Nonsensical move direction given: %d", direction)
      return;
    }
    this.playerLeft = this.playerColumn * SQUARE_WIDTH_PIXELS;
    this.playerTop = (this.playerRow + 1) * SQUARE_HEIGHT_PIXELS;

    // Check the square we've landed on for a question / flag
    let currentSquare = this.maze[this.playerRow][this.playerColumn];
    if (currentSquare.hasObject) {
      this.modalSpawningEvent.emit(currentSquare.objectName);
    }
  }
  @Output() modalSpawningEvent = new EventEmitter<string>();
}
