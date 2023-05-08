import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.css']
})
export class ControlsComponent {
  @Output() moveEvent = new EventEmitter<number>();
  move(direction: number) {
    this.moveEvent.emit(direction);
  }
}
