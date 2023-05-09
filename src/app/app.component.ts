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
  showModal: boolean = false;
  isVictoryModal: boolean = false;
  receiveMoveEvent($event: number) {
    if (this.child) {
      this.child.movePlayer($event);
    }
  }
  receiveModalEvent($event: string) {
    this.showModal = true;
    this.isVictoryModal = Boolean($event == 'Flag');
  }
}
