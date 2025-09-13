import { Player, LeaderboardEntry, Question, Operation, Mistake } from '../types';
import { QUESTIONS_PER_ROUND, BASE_SCORE_PER_CORRECT_ANSWER } from '../constants';

const PLAYERS_KEY = 'mathMaster_players';
const LEADERBOARD_KEY = 'mathMaster_leaderboard';

// --- Player Data ---
export const getPlayers = (): Player[] => {
  try {
    const data = localStorage.getItem(PLAYERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to parse players from localStorage", error);
    localStorage.removeItem(PLAYBOARD_KEY); // Clear corrupted data
    return [];
  }
};

export const getPlayer = (name: string): Player | undefined => {
  const players = getPlayers();
  return players.find(p => p.name.toLowerCase() === name.toLowerCase());
};

export const savePlayer = (player: Player): void => {
  let players = getPlayers();
  const existingPlayerIndex = players.findIndex(p => p.name.toLowerCase() === player.name.toLowerCase());
  if (existingPlayerIndex > -1) {
    players[existingPlayerIndex] = player;
  } else {
    players.push(player);
  }
  localStorage.setItem(PLAYERS_KEY, JSON.stringify(players));
};

// --- Leaderboard Data ---
export const getLeaderboard = (): LeaderboardEntry[] => {
  try {
    const data = localStorage.getItem(LEADERBOARD_KEY);
    const leaderboard = data ? JSON.parse(data) : [];
    return leaderboard.sort((a: LeaderboardEntry, b: LeaderboardEntry) => b.score - a.score);
  } catch (error) {
    console.error("Failed to parse leaderboard from localStorage", error);
    localStorage.removeItem(LEADERBOARD_KEY); // Clear corrupted data
    return [];
  }
};

export const updateLeaderboard = (name: string, score: number): void => {
  let leaderboard = getLeaderboard();
  const playerEntryIndex = leaderboard.findIndex(entry => entry.name.toLowerCase() === name.toLowerCase());

  if (playerEntryIndex > -1) {
    if (score > leaderboard[playerEntryIndex].score) {
      leaderboard[playerEntryIndex].score = score;
    }
  } else {
    leaderboard.push({ name, score });
  }
  
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(leaderboard));
};

// --- Game Logic ---

const getAvailableOperationsForLevel = (level: number): Operation[] => {
    return [
        Operation.Addition,
        Operation.Subtraction,
        Operation.Multiplication,
        Operation.Division,
    ];
};

export const generateRoundOperations = (level: number): Operation[] => {
    const availableOperations = getAvailableOperationsForLevel(level);
    const totalQuestions = QUESTIONS_PER_ROUND;

    if (availableOperations.length === 0) return [];

    // 1. Create a pool of guaranteed questions.
    // Every available operation type gets 2 questions guaranteed.
    const guaranteedQuestions: Operation[] = [];
    for (const op of availableOperations) {
        guaranteedQuestions.push(op, op);
    }

    // 2. Create a pool of remaining questions, filled randomly.
    const remainingQuestionCount = Math.max(0, totalQuestions - guaranteedQuestions.length);
    const remainingQuestions: Operation[] = [];
    for (let i = 0; i < remainingQuestionCount; i++) {
        const randomOpIndex = Math.floor(Math.random() * availableOperations.length);
        remainingQuestions.push(availableOperations[randomOpIndex]);
    }

    // 3. Combine and shuffle the pools.
    const roundOps = [...guaranteedQuestions, ...remainingQuestions];

    // Fisher-Yates shuffle
    for (let i = roundOps.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [roundOps[i], roundOps[j]] = [roundOps[j], roundOps[i]];
    }

    return roundOps;
};

const getRandomInt = (min: number, max: number): number => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const generateQuestion = (level: number, forceOperation?: Operation): { question: Question; operation: Operation } => {
    const availableOperations = getAvailableOperationsForLevel(level);
    let operation: Operation;

    if (forceOperation !== undefined && availableOperations.includes(forceOperation)) {
        operation = forceOperation;
    } else {
        operation = availableOperations[Math.floor(Math.random() * availableOperations.length)];
    }

    let num1: number, num2: number, answer: number, text: string;

    switch (operation) {
        case Operation.Addition:
            num1 = getRandomInt(10 + level, 20 + level * 5);
            num2 = getRandomInt(10 + level, 20 + level * 3);
            answer = num1 + num2;
            text = `${num1} + ${num2}`;
            break;
        case Operation.Subtraction:
            num1 = getRandomInt(20 + level * 2, 50 + level * 5);
            num2 = getRandomInt(10, num1 - 10);
            answer = num1 - num2;
            text = `${num1} - ${num2}`;
            break;
        case Operation.Multiplication:
            num1 = getRandomInt(11 + level, 50 + level * 4);
            num2 = getRandomInt(3, 9);
            if (Math.random() > 0.5) [num1, num2] = [num2, num1];
            answer = num1 * num2;
            text = `${num1} × ${num2}`;
            break;
        case Operation.Division:
            num2 = getRandomInt(2, 9); // Divisor
            const result = getRandomInt(5 + level, 15 + level * 2);
            answer = result;
            num1 = num2 * answer; // Dividend
            text = `${num1} ÷ ${num2}`;
            break;
        default: // Fallback
            num1 = getRandomInt(10, 20);
            num2 = getRandomInt(1, 10);
            answer = num1 + num2;
            operation = Operation.Addition;
    }

    return { question: { text, answer }, operation };
};

export const calculatePenalty = (level: number): number => {
    // Deduct half the base score, plus a small amount based on level
    return Math.floor(BASE_SCORE_PER_CORRECT_ANSWER / 2 + level / 2);
};


// --- AI Features ---
export const getAnalysisAndSuggestions = async (mistakes: Mistake[], playerLevel: number): Promise<string> => {
  if (mistakes.length === 0) {
    return "You didn't make any mistakes! Amazing job!";
  }

  try {
    const response = await fetch('/api/suggestions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ mistakes, playerLevel }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data.suggestions;
  } catch (error) {
    console.error("Error fetching AI suggestions:", error);
    return "Sorry, I couldn't generate suggestions at this time. Keep practicing, you're doing great!";
  }
};
