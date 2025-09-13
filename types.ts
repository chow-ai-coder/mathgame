export interface Player {
  name: string;
  level: number;
}

export interface LeaderboardEntry {
  name: string;
  score: number;
}

export interface Question {
  text: string;
  answer: number;
}

export interface Mistake {
  questionText: string;
  userAnswer: string;
  correctAnswer: number;
  operation: Operation;
}

export enum Operation {
  Addition,
  Subtraction,
  Multiplication,
  Division,
}
