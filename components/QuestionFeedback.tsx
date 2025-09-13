import React from 'react';
import { Question } from '../types';

interface QuestionFeedbackProps {
  isCorrect: boolean;
  question: Question;
  userAnswer: string;
  onNext: () => void;
}

const QuestionFeedback: React.FC<QuestionFeedbackProps> = ({ isCorrect, question, userAnswer, onNext }) => {
  return (
    <div className="text-center animate-pop-in">
      {isCorrect ? (
        <>
          <h2 className="text-4xl font-bold text-emerald-400 mb-4">Correct!</h2>
          <p className="text-2xl text-white mb-6">{question.text} = <span className="font-bold">{question.answer}</span></p>
        </>
      ) : (
        <>
          <h2 className="text-4xl font-bold text-rose-500 mb-4">Not quite!</h2>
          <p className="text-xl text-white mb-2">The question was: <span className="font-bold">{question.text}</span></p>
          <p className="text-xl text-white mb-2">You answered: <span className="font-bold text-rose-400">{userAnswer === '' ? 'Not Attempted' : userAnswer}</span></p>
          <p className="text-xl text-white mb-6">Correct answer: <span className="font-bold text-emerald-400">{question.answer}</span></p>
        </>
      )}

      <button
        onClick={onNext}
        className="w-full mt-8 bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-4 rounded-lg transition-transform duration-200 ease-in-out transform hover:scale-105"
      >
        Next Question
      </button>
    </div>
  );
};

export default QuestionFeedback;