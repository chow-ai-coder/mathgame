import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Player, Question, Operation, Mistake } from '../types';
import { generateQuestion, savePlayer, updateLeaderboard, generateRoundOperations, calculatePenalty } from '../services/gameService';
import { QUESTIONS_PER_ROUND, BASE_TIME_PER_QUESTION, BASE_SCORE_PER_CORRECT_ANSWER } from '../constants';
import TimerBar from './TimerBar';
import StarIcon from './icons/StarIcon';
import QuestionFeedback from './QuestionFeedback';

interface GameScreenProps {
  player: Player;
  onGameOver: (score: number, updatedPlayer: Player, mistakes: Mistake[], totalQuestions: number) => void;
  isNewPlayer: boolean;
  practiceOperation?: Operation;
  onEndPractice?: () => void;
}

const GameScreen: React.FC<GameScreenProps> = ({ player, onGameOver, isNewPlayer, practiceOperation, onEndPractice }) => {
  const [level, setLevel] = useState(player.level);
  const [score, setScore] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [currentOperation, setCurrentOperation] = useState<Operation>(Operation.Addition);
  const [userAnswer, setUserAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(BASE_TIME_PER_QUESTION);
  const [currentQuestionTime, setCurrentQuestionTime] = useState(BASE_TIME_PER_QUESTION);
  const [operationQueue, setOperationQueue] = useState<Operation[]>([]);
  const [mistakes, setMistakes] = useState<Mistake[]>([]);
  const [correctStreak, setCorrectStreak] = useState(0);

  const [view, setView] = useState<'question' | 'feedback'>('question');
  const [lastAnswerWasCorrect, setLastAnswerWasCorrect] = useState(false);

  const isPracticeMode = practiceOperation !== undefined;
  const inputRef = useRef<HTMLInputElement>(null);

  const startNewRound = useCallback(() => {
    setLevel(player.level);
    setScore(0);
    setQuestionNumber(1);
    setMistakes([]);
    setCorrectStreak(0);
    setView('question');
    if (!isPracticeMode) {
      setOperationQueue(generateRoundOperations(player.level));
    }
  }, [player.level, isPracticeMode]);

  useEffect(() => {
    if (!isPracticeMode) {
      startNewRound();
    } else {
      setCorrectStreak(0);
      setQuestionNumber(1);
    }
  }, [isPracticeMode, startNewRound]);

  // Main effect to fetch and set up a new question
  useEffect(() => {
    if (view === 'feedback') {
      return; // Do not fetch a new question while showing feedback
    }

    if (!isPracticeMode && questionNumber > QUESTIONS_PER_ROUND) {
      const updatedPlayer = { ...player, level };
      savePlayer(updatedPlayer);
      updateLeaderboard(player.name, score);
      onGameOver(score, updatedPlayer, mistakes, QUESTIONS_PER_ROUND);
      return;
    }

    const timeForLevel = BASE_TIME_PER_QUESTION + Math.floor(level / 4);
    setCurrentQuestionTime(timeForLevel);

    let questionData;
    const op = isPracticeMode ? practiceOperation : operationQueue[questionNumber - 1];
    if (op === undefined && !isPracticeMode) {
      return;
    }
    questionData = generateQuestion(level, op);
    
    if (questionData) {
      setCurrentQuestion(questionData.question);
      setCurrentOperation(questionData.operation);
    }
    
    setUserAnswer('');
    setTimeLeft(timeForLevel);
    const focusTimeout = setTimeout(() => inputRef.current?.focus(), 100);

    return () => clearTimeout(focusTimeout);
  }, [questionNumber, view, operationQueue, isPracticeMode, player, onGameOver, level, mistakes, score, practiceOperation]);

  // Timer countdown effect
  useEffect(() => {
    if (view === 'feedback' || isPracticeMode) {
      return;
    }
    const timerId = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timerId);
  }, [view, isPracticeMode]);

  // Effect to handle timeout
  useEffect(() => {
    if (!isPracticeMode && timeLeft <= 0 && view === 'question') {
      handleAnswerSubmission(false, 0, '');
    }
  }, [timeLeft, view, isPracticeMode]);

  const handleAnswerSubmission = (isCorrect: boolean, timeRemaining: number, answer: string) => {
    setLastAnswerWasCorrect(isCorrect);
    setView('feedback'); // Switch view immediately for instant feedback

    if (isCorrect) {
      setCorrectStreak(prev => prev + 1);
      if (!isPracticeMode) {
        const scoreGained = BASE_SCORE_PER_CORRECT_ANSWER + (level * 2) + Math.floor(timeRemaining * 1.5);
        setScore(prev => prev + scoreGained);
        let levelIncrease = 1;
        if (timeRemaining > currentQuestionTime * 0.75) {
          levelIncrease = 2;
        }
        setLevel(prev => prev + levelIncrease);
      }
    } else {
      setCorrectStreak(0);
      if (currentQuestion) {
        setMistakes(prev => [...prev, {
          questionText: currentQuestion.text,
          userAnswer: answer,
          correctAnswer: currentQuestion.answer,
          operation: currentOperation,
        }]);
      }
      if (!isPracticeMode) {
        const penalty = calculatePenalty(level);
        setScore(prev => Math.max(0, prev - penalty));
        setLevel(prev => Math.max(1, prev - 1));
      }
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userAnswer === '' || view === 'feedback') return;
    const isCorrect = parseInt(userAnswer, 10) === currentQuestion?.answer;
    handleAnswerSubmission(isCorrect, timeLeft, userAnswer);
  };
  
  const handleNextQuestion = () => {
    setQuestionNumber(prev => prev + 1);
    setView('question');
  };
  
  if (!currentQuestion) {
    return <div className="text-center text-2xl">Loading...</div>;
  }
  
  const operationSymbols: Record<number, string> = {
    [Operation.Addition]: '+',
    [Operation.Subtraction]: '-',
    [Operation.Multiplication]: '×',
    [Operation.Division]: '÷'
  }

  return (
    <div className="bg-gradient-glass border border-gray-700 rounded-2xl p-8 shadow-2xl animate-pop-in">
       {isPracticeMode ? (
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-cyan-300">Practice Mode: {operationSymbols[practiceOperation]}</h2>
          <div className="text-lg font-bold text-yellow-400 flex items-center gap-1">
            <StarIcon /> {correctStreak} Streak
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-center mb-6 text-cyan-300">
          <div className="flex-1 text-left"><span className="font-bold text-white">Level:</span> {level}</div>
          <div className="flex-1 text-center">
            {/* Restart button removed as per user request */}
          </div>
          <div className="flex-1 text-right"><span className="font-bold text-white">Score:</span> {score}</div>
        </div>
      )}
      
      {!isPracticeMode && view === 'question' && <TimerBar duration={currentQuestionTime} timeLeft={timeLeft} />}
      
      {view === 'question' ? (
        <div className="animate-pop-in">
          <div className="text-center my-8">
            {!isPracticeMode && (
              <div className="flex justify-between items-center text-lg text-cyan-300 mb-2">
                <p>Question {questionNumber}/{QUESTIONS_PER_ROUND}</p>
                <p>Time: {timeLeft}s</p>
              </div>
            )}
            <div className="text-6xl font-bold text-white tracking-widest bg-black/30 p-6 rounded-lg">
              {currentQuestion.text}
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              type="number"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Your Answer"
              className={`w-full text-center text-2xl bg-gray-900/50 border-2 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-pink-500 border-cyan-400 transition-all duration-300`}
              autoFocus
            />
            <div className="flex gap-4 mt-4">
              {isPracticeMode && onEndPractice && (
                <button
                  type="button"
                  onClick={onEndPractice}
                  className="w-1/3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-4 rounded-lg transition-transform duration-200"
                >
                  End
                </button>
              )}
              <button
                type="submit"
                className="flex-grow bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-4 rounded-lg transition-transform duration-200 ease-in-out transform hover:scale-105 disabled:bg-gray-600 disabled:cursor-not-allowed"
                disabled={userAnswer === ''}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      ) : (
        <QuestionFeedback
          isCorrect={lastAnswerWasCorrect}
          question={currentQuestion}
          userAnswer={userAnswer}
          onNext={handleNextQuestion}
        />
      )}
    </div>
  );
};

export default GameScreen;