import { Component, Input } from '@angular/core';
import Questions from '../../assets/Assignment Assets/Questions.json';
import { Question } from '../question';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {
  isVictoryModal: boolean = true;
  @Input() set updateModal(v: boolean) {
    this.isVictoryModal = v;
    this.chooseRandomQuestion();
  } 
  question: Question = {id: '-1', text: '', audio: '', competency: '', options: []};
  validIDs: number[] = Array(Questions.length).fill(0).map((x, i) => i);
  chooseRandomQuestion = () => {
    if (this.validIDs.length == 0) {
      console.error("Too many question boxes placed - out of questions!")
      return;
    }
    let id: number = (this.validIDs.splice(Math.floor(Math.random() * this.validIDs.length), 1))[0];
    this.question = Questions[id];
    console.log(this.question);
  }
}
