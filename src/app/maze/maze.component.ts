import { Component } from '@angular/core';
import Mazes from '../../assets/Mazes.json';

function parseMaze(mazeCollision: number[][]) {
  let mazeSquares: string[][] = Array(mazeCollision.length);
  for (let i = 0; i < mazeSquares.length; i++) {
    mazeSquares[i] = Array(mazeCollision[0].length).fill("");
  }
  const classValues = [
    [8, "maze-square-left"],
    [4, "maze-square-bottom"],
    [2, "maze-square-right"],
    [1, "maze-square-top"]
  ];
  function complainAboutSquare(r: Number, c: Number, s: string) {
    // Helper function to report errors with maze encoding
    console.error("Maze square (%d, %d) %s", r, c, s);
  }
  for (const [r, row] of mazeCollision.entries()) {
    for (const [c, squareValue] of row.entries()) {
      let remainder = squareValue;
      if (squareValue < 0 || squareValue > 15) {
        complainAboutSquare(r, c, "has an invalid collision value");
      }
      if (r == 0 && !(squareValue & 1)) {
        complainAboutSquare(r, c, "does not have collision on its top");
      } else if (r == mazeCollision.length - 1 && !(squareValue & 4)) {
        complainAboutSquare(r, c, "does not have collision on its bottom");
      }
      if (c == 0 && !(squareValue & 8)) {
        complainAboutSquare(r, c, "does not have collision on its left");
      } else if (c == row.length - 1 && !(squareValue & 2)) {
        complainAboutSquare(r, c, "does not have collision on its right");
      }
      for (const [value, className] of classValues) {
        if (remainder & Number(value)) {
          mazeSquares[r][c] += " " + String(className);
        }
      }

    }
  }
  return mazeSquares;
}

@Component({
  selector: 'app-maze',
  templateUrl: './maze.component.html',
  styleUrls: ['./maze.component.css']
})
export class MazeComponent {
  numRows: number = 10;
  numColumns: number = 10;
  rows: number[] = Array(this.numRows).fill(0);
  mazeCollision: number[][] = Mazes["maze-1"];
  maze: string[][] = parseMaze(this.mazeCollision);
}
