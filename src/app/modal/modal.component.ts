import { Component, Input, Output, EventEmitter } from '@angular/core';
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
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter();
  question: Question = {id: '-1', text: '', audio: '', competency: '', options: []};
  answers: Answer[] = [];
  answerClasses: string[] = [];
  buttonClass: string = '';
  validIDs: number[] = Array(Questions.length).fill(0).map((x, i) => i);
  modalButtonText: string = 'Exit';
  modalButtonDisabled: string = 'disabled'
  chosenAnswerID: number = -1;
  audio: HTMLAudioElement = new Audio();
  playAudio = (filename: string) => {
    if (this.audio) {
      this.audio.pause();
    }
    this.audio = new Audio("../../assets/Assignment Assets/Audios/" + filename + ".mp3");
    this.audio.load();
    this.audio.play();
  }
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
    this.playQuestionAudio();
  }
  playQuestionAudio = () => {
    this.playAudio(this.question.audio.toLowerCase());
  }
  selectAnswer = (index: number) => {
    // Reset CSS on previously selected answer
    if (this.chosenAnswerID != -1) {
      this.answerClasses[this.chosenAnswerID] = '';
    }
    // Apply 'selected' CSS to chosen answer
    this.chosenAnswerID = index;
    this.answerClasses[index] = 'question-answer-selected';
    // Play the selection audio of chosen answer
    this.playAudio(this.answers[index].audio.toLowerCase());
    // Enable the 'Confirm' button
    this.modalButtonDisabled = '';
  }
  confirmAnswer = () => {
    let answerQuality = this.answers[this.chosenAnswerID].answer;
    if (answerQuality == 'BEST' || answerQuality == 'NEXTBEST') {
      if (answerQuality == 'BEST') {
        // Play 'best answer' audio
        this.playAudio("maze_best_active_m");
      } else {
        // Play 'next best answer' audio
        this.playAudio("maze_next_best_active_m");
      }
      // Update answer CSS
      this.answerClasses[this.chosenAnswerID] = 'question-answer-correct';
      // Wait a few seconds - audio plays and choice is highlighted green
      setTimeout(() => {
        // Close the modal
        this.closeModal.emit()
      }, 3000);

    } else if (answerQuality == 'WRONG') {
      // Play 'wrong answer' audio
      this.playAudio("maze_wrong_active_m");

      // Update CSS class of 'wrong' answer
      this.answerClasses[this.chosenAnswerID] = 'question-answer-wrong';
    } else {
      console.error('Question id %s has an option with invalid answer %s', this.question.id, answerQuality);
    }
  }
}
