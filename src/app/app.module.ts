import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { MazeComponent } from './maze/maze.component';
import { ControlsComponent } from './controls/controls.component';
import { PlayerComponent } from './player/player.component';

@NgModule({
  declarations: [
    AppComponent,
    MazeComponent,
    ControlsComponent,
    PlayerComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
