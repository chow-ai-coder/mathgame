import React, { useEffect, useMemo, useState } from 'react';
import { Player, LeaderboardEntry, Mistake, Operation } from '../types';
import { getLeaderboard } from '../services/gameService';
import TrophyIcon from './icons/TrophyIcon';
import StarIcon from './icons/StarIcon';
import AIGeneratedSuggestions from './AIGeneratedSuggestions';

interface GameOverScreenProps {
  score: number;
  player: Player;
  mistakes: Mistake[];
  onPlayAgain: () => void;
  onSwitchPlayer: () => void;
  onStartPractice: (operation: Operation) => void;
  totalQuestions: number;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ score, player, mistakes, onPlayAgain, onSwitchPlayer, onStartPractice, totalQuestions }) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    setLeaderboard(getLeaderboard());
  }, []);

  const practiceTopics = useMemo(() => {
    const operations = new Set(mistakes.map(m => m.operation));
    return Array.from(operations);
  }, [mistakes]);

  const operationSymbols: Record<number, string> = {
    [Operation.Addition]: 'Addition +',
    [Operation.Subtraction]: 'Subtraction -',
    [Operation.Multiplication]: 'Multiplication ×',
    [Operation.Division]: 'Division ÷'
  };

  const correctAnswers = totalQuestions - mistakes.length;

  return (
    <div className="bg-gradient-glass border border-gray-700 rounded-2xl p-8 shadow-2xl animate-pop-in max-h-[90vh] overflow-y-auto">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-2">Game Over!</h1>
        <p className="text-cyan-300 text-lg mb-6">Well done, {player.name}!</p>

        <div className="bg-black/30 rounded-lg p-6 mb-8">
          <p className="text-cyan-200">Your Score</p>
          <p className="text-6xl font-bold text-white my-2">{score}</p>
          <p className="text-lg text-white mb-2">
            You answered <span className="font-bold text-emerald-400">{correctAnswers}/{totalQuestions}</span> questions correctly.
          </p>
          <div className="flex items-center justify-center gap-2 text-yellow-400">
             <StarIcon />
             <span>New Level: {player.level}</span>
          </div>
        </div>

        <AIGeneratedSuggestions mistakes={mistakes} playerLevel={player.level} />

        {practiceTopics.length > 0 && (
          <div className="mb-8 text-left">
            <h2 className="text-2xl font-semibold mb-4 text-center">Practice Zone</h2>
            <p className="text-center text-cyan-300 mb-4">Master the skills you found tricky.</p>
            <div className="flex flex-col space-y-3">
              {practiceTopics.map(op => (
                <button
                  key={op}
                  onClick={() => onStartPractice(op)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-transform duration-200 ease-in-out transform hover:scale-105"
                >
                  Practice {operationSymbols[op]}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-center flex items-center justify-center gap-2"><TrophyIcon /> Leaderboard</h2>
          <ul className="space-y-2 max-h-48 overflow-y-auto pr-2">
            {leaderboard.slice(0, 10).map((entry, index) => (
              <li
                key={index}
                className={`flex justify-between items-center p-3 rounded-lg animate-slide-down ${
                  entry.name === player.name ? 'bg-pink-600/50' : 'bg-gray-800/50'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <span className="font-semibold text-white">
                  {index + 1}. {entry.name}
                </span>
                <span className="font-bold text-cyan-300">{entry.score}</span>
              </li>
            ))}
             {leaderboard.length === 0 && <p className="text-gray-400">No scores yet. Be the first!</p>}
          </ul>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={onPlayAgain}
            className="flex-1 bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-4 rounded-lg transition-transform duration-200 ease-in-out transform hover:scale-105"
          >
            Play Again
          </button>
          <button
            onClick={onSwitchPlayer}
            className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-4 rounded-lg transition-transform duration-200 ease-in-out transform hover:scale-105"
          >
            Switch Player
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameOverScreen;
