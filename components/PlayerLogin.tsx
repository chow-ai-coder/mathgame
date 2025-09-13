
import React, { useState } from 'react';
import { Player } from '../types';
import { getPlayer } from '../services/gameService';
import { NEW_PLAYER_STARTING_LEVEL } from '../constants';

interface PlayerLoginProps {
  onPlayerSelect: (player: Player, isNew: boolean) => void;
  onGoToPractice: () => void;
  existingPlayers: Player[];
}

const PlayerLogin: React.FC<PlayerLoginProps> = ({ onPlayerSelect, onGoToPractice, existingPlayers }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      const existingPlayer = getPlayer(name.trim());
      const isNew = !existingPlayer;
      const player = existingPlayer || { name: name.trim(), level: NEW_PLAYER_STARTING_LEVEL };
      onPlayerSelect(player, isNew);
    }
  };

  const handleExistingPlayerClick = (player: Player) => {
    onPlayerSelect(player, false);
  };

  return (
    <div className="bg-gradient-glass border border-gray-700 rounded-2xl p-8 shadow-2xl animate-pop-in text-center">
      <h1 className="text-4xl font-bold mb-2 text-white">Math Master</h1>
      <p className="text-cyan-300 mb-8">Enter your name for a quiz, or jump into practice!</p>
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your Name"
          className="w-full bg-gray-900/50 border-2 border-cyan-400 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-300"
          autoFocus
        />
        <div className="flex gap-4 mt-4">
          <button
            type="button"
            onClick={onGoToPractice}
            className="w-1/3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-4 rounded-lg transition-transform duration-200"
          >
            Practice
          </button>
          <button
            type="submit"
            disabled={!name.trim()}
            className="flex-grow bg-pink-600 hover:bg-pink-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-transform duration-200 ease-in-out transform hover:scale-105"
          >
            Start Quiz
          </button>
        </div>
      </form>
      
      {existingPlayers.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg text-cyan-300 mb-4">Or choose a player for a quiz:</h2>
          <div className="flex flex-wrap gap-3 justify-center">
            {existingPlayers.map(p => (
              <button
                key={p.name}
                onClick={() => handleExistingPlayerClick(p)}
                className="bg-cyan-600/50 hover:bg-cyan-600 text-white font-semibold py-2 px-4 rounded-full transition-all duration-200 ease-in-out transform hover:scale-110"
              >
                {p.name} (Lvl {p.level})
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerLogin;