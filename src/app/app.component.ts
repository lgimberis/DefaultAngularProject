import { Component, ViewChild } from '@angular/core';
import { MazeComponent } from './maze/maze.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'DefaultAngularProject';
  @ViewChild(MazeComponent) child:MazeComponent | null = null;
  receiveMoveEvent($event: number) {
    if (this.child) {
      this.child.movePlayer($event);
    }
  }
}
