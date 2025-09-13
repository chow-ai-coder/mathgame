import React from 'react';
import { Operation } from '../types';

interface PracticeSelectionProps {
  onSelectPractice: (operation: Operation) => void;
  onBack: () => void;
}

const PracticeSelection: React.FC<PracticeSelectionProps> = ({ onSelectPractice, onBack }) => {
  const operationButtons = [
    { label: 'Addition', operation: Operation.Addition, color: 'bg-emerald-600 hover:bg-emerald-700' },
    { label: 'Subtraction', operation: Operation.Subtraction, color: 'bg-rose-600 hover:bg-rose-700' },
    { label: 'Multiplication', operation: Operation.Multiplication, color: 'bg-amber-600 hover:bg-amber-700' },
    { label: 'Division', operation: Operation.Division, color: 'bg-sky-600 hover:bg-sky-700' },
  ];

  return (
    <div className="bg-gradient-glass border border-gray-700 rounded-2xl p-8 shadow-2xl animate-pop-in text-center">
      <h1 className="text-4xl font-bold mb-2 text-white">Practice Zone</h1>
      <p className="text-cyan-300 mb-8">Choose a skill to master.</p>
      
      <div className="flex flex-col space-y-4">
        {operationButtons.map(({ label, operation, color }) => (
          <button
            key={operation}
            onClick={() => onSelectPractice(operation)}
            className={`w-full ${color} text-white font-bold py-3 px-4 rounded-lg transition-transform duration-200 ease-in-out transform hover:scale-105`}
          >
            {label}
          </button>
        ))}
      </div>
      
      <button
        onClick={onBack}
        className="w-full mt-8 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg transition-transform duration-200"
      >
        Back
      </button>
    </div>
  );
};

export default PracticeSelection;
