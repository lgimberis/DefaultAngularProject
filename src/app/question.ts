import { Answer } from './answer';

export interface Question {
    id: string;
    text: string;
    audio: string;
    competency: string;
    options: Answer[];
}
