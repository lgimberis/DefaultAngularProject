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
  for (const [r, row] of mazeCollision.entries()) {
    for (const [c, squareValue] of row.entries()) {
      let remainder = squareValue;
      for (const [value, className] of classValues) {
        if (remainder >= Number(value)) {
          remainder -= Number(value); 
          mazeSquares[r][c] += " " + String(className);
        }
      }
      if (remainder != 0) {
        console.error("Maze square (%d, %d) has an invalid collision value", r, c);
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
