import React, { useState, useEffect } from 'react';
import { Mistake } from '../types';
import { getAnalysisAndSuggestions } from '../services/gameService';
import LightbulbIcon from './icons/LightbulbIcon';
import SpinnerIcon from './icons/SpinnerIcon';

interface AIGeneratedSuggestionsProps {
  mistakes: Mistake[];
  playerLevel: number;
}

const AIGeneratedSuggestions: React.FC<AIGeneratedSuggestionsProps> = ({ mistakes, playerLevel }) => {
  const [suggestions, setSuggestions] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getAnalysisAndSuggestions(mistakes, playerLevel);
        setSuggestions(result);
      } catch (err) {
        setError("Could not load suggestions.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [mistakes, playerLevel]);

  const formatSuggestions = (text: string) => {
    return text.split('•').map(s => s.trim()).filter(Boolean);
  };

  return (
    <div className="mb-8 text-left bg-black/30 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4 text-center flex items-center justify-center gap-2 text-cyan-300">
        <LightbulbIcon /> AI Coach's Tips
      </h2>
      {loading && (
        <div className="flex items-center justify-center gap-2 text-gray-400">
          <SpinnerIcon />
          <span>Analyzing your performance...</span>
        </div>
      )}
      {error && <p className="text-center text-rose-400">{error}</p>}
      {!loading && !error && (
        <ul className="space-y-2 text-white">
          {formatSuggestions(suggestions).map((suggestion, index) => (
            <li key={index} className="flex items-start">
              <span className="text-cyan-300 mr-2">♦</span>
              <span>{suggestion}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AIGeneratedSuggestions;
