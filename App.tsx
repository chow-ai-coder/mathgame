
import React, { useState, useCallback } from 'react';
import PlayerLogin from './components/PlayerLogin';
import GameScreen from './components/GameScreen';
import GameOverScreen from './components/GameOverScreen';
import PracticeSelection from './components/PracticeSelection';
import { Player, Operation, Mistake } from './types';
import { getPlayers } from './services/gameService';

type GameState = 'login' | 'playing' | 'gameOver' | 'practice' | 'practiceSelection';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('login');
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [lastScore, setLastScore] = useState<number>(0);
  const [allPlayers, setAllPlayers] = useState<Player[]>(getPlayers());
  const [isNewPlayer, setIsNewPlayer] = useState(false);
  const [lastMistakes, setLastMistakes] = useState<Mistake[]>([]);
  const [lastTotalQuestions, setLastTotalQuestions] = useState<number>(0);
  const [practiceOperation, setPracticeOperation] = useState<Operation | null>(null);

  const handlePlayerSelect = useCallback((player: Player, isNew: boolean) => {
    setCurrentPlayer(player);
    setIsNewPlayer(isNew);
    setGameState('playing');
    if (isNew) {
      setAllPlayers(prev => [...prev, player]);
    }
  }, []);

  const handleGameOver = useCallback((score: number, updatedPlayer: Player, mistakes: Mistake[], totalQuestions: number) => {
    setLastScore(score);
    setCurrentPlayer(updatedPlayer);
    setLastMistakes(mistakes);
    setLastTotalQuestions(totalQuestions);
    setGameState('gameOver');
    setAllPlayers(prev => prev.map(p => p.name === updatedPlayer.name ? updatedPlayer : p));
  }, []);

  const handlePlayAgain = useCallback(() => {
    if (isNewPlayer) setIsNewPlayer(false);
    setGameState('playing');
  }, [isNewPlayer]);

  const handleSwitchPlayer = useCallback(() => {
    setCurrentPlayer(null);
    setGameState('login');
  }, []);

  const handleGoToPracticeSelection = useCallback(() => {
    setGameState('practiceSelection');
  }, []);

  const handleStartPractice = useCallback((operation: Operation) => {
    // A player profile is needed for level-scaling in practice,
    // so we'll use a guest profile if none is selected.
    if (!currentPlayer) {
      setCurrentPlayer({ name: 'Guest', level: 1 });
    }
    setPracticeOperation(operation);
    setGameState('practice');
  }, [currentPlayer]);

  const handleEndPractice = useCallback(() => {
    setPracticeOperation(null);
    setGameState('practiceSelection'); // Return to the practice selection screen
  }, []);

  const renderScreen = () => {
    switch (gameState) {
      case 'login':
        return <PlayerLogin onPlayerSelect={handlePlayerSelect} onGoToPractice={handleGoToPracticeSelection} existingPlayers={allPlayers} />;
      case 'practiceSelection':
        return <PracticeSelection onSelectPractice={handleStartPractice} onBack={handleSwitchPlayer} />;
      case 'playing':
      case 'practice':
        if (!currentPlayer) {
          setGameState('login');
          return null;
        }
        return (
          <GameScreen
            player={currentPlayer}
            onGameOver={handleGameOver}
            isNewPlayer={isNewPlayer}
            practiceOperation={gameState === 'practice' ? practiceOperation : undefined}
            onEndPractice={handleEndPractice}
          />
        );
      case 'gameOver':
        if (!currentPlayer) {
          setGameState('login');
          return null;
        }
        return (
          <GameOverScreen
            score={lastScore}
            player={currentPlayer}
            mistakes={lastMistakes}
            onPlayAgain={handlePlayAgain}
            onSwitchPlayer={handleSwitchPlayer}
            onStartPractice={handleStartPractice}
            totalQuestions={lastTotalQuestions}
          />
        );
      default:
        return <PlayerLogin onPlayerSelect={handlePlayerSelect} onGoToPractice={handleGoToPracticeSelection} existingPlayers={allPlayers}/>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-main flex items-center justify-center p-4 relative">
      <div className="w-full max-w-md mx-auto">
        {renderScreen()}
      </div>
    </div>
  );
};

export default App;