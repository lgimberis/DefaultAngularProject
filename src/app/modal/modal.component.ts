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
    if(this.isVictoryModal) {
      this.modalButtonText = 'Exit';
    } else {
      this.modalButtonText = 'Confirm';
      this.chooseRandomQuestion();
    }
  } 
  question: Question = {id: '-1', text: '', audio: '', competency: '', options: []};
  answers: Answer[] = [];
  answerClasses: string[] = [];
  buttonClass: string = '';
  validIDs: number[] = Array(Questions.length).fill(0).map((x, i) => i);
  modalButtonText: string = 'Exit';
  modalButtonDisabled: string = 'disabled'
  chooseRandomQuestion = () => {
    if (this.validIDs.length == 0) {
      console.error("Too many question boxes placed - out of questions!")
      return;
    }
    let id: number = (this.validIDs.splice(Math.floor(Math.random() * this.validIDs.length), 1))[0];
    this.question = Questions[id];

    // Shuffle answers randomly (sort according to random values assigned to each index)
    this.answers = this.question.options
      .map(v => ({v, 'sort': Math.random()}))
      .sort((a, b) => (a.sort - b.sort))
      .map(({v}) => v);

    this.answerClasses = Array(this.answers.length).fill('');
    // Play the question audio
    let audio = new Audio("../../assets/Assignment Assets/Audios/" + this.question.audio.toLowerCase() + ".mp3");
    audio.load();
    audio.play();
  }
  selectAnswer = (index: number) => {
    // Apply 'selected' CSS to chosen answer
    for(let i = 0; i < this.answerClasses.length; i++) {
      if (i == index) {
        this.answerClasses[i] = 'question-answer-selected';
      } else {
        this.answerClasses[i] = '';
      }
    }
    // Play the selection audio of chosen answer
    let audio = new Audio("../../assets/Assignment Assets/Audios/" + this.answers[index].audio.toLowerCase() + ".mp3");
    audio.load();
    audio.play();
    // Enable the 'Confirm' button
    this.modalButtonDisabled = '';
  }
  confirmAnswer = () => {

  }
}
