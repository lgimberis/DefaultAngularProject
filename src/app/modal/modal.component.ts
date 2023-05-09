import { Component, Input } from '@angular/core';
import Questions from '../../assets/Assignment Assets/Questions.json';
import { Question } from '../question';
import { Answer } from '../answer';

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
  answers: Answer[] = [];
  validIDs: number[] = Array(Questions.length).fill(0).map((x, i) => i);
  chooseRandomQuestion = () => {
    if (this.validIDs.length == 0) {
      console.error("Too many question boxes placed - out of questions!")
      return;
    }
    let id: number = (this.validIDs.splice(Math.floor(Math.random() * this.validIDs.length), 1))[0];
    this.question = Questions[id];

    //Shuffle answers randomly (sort according to random values assigned to each index)
    this.answers = this.question.options
      .map(v => ({v, 'sort': Math.random()}))
      .sort((a, b) => (a.sort - b.sort))
      .map(({v}) => v);
    let audio = new Audio();
    audio.src = "../../assets/Assignment Assets/Audios/" + this.question.audio.toLowerCase() + ".mp3";
    audio.load();
    audio.play();
  }
}
