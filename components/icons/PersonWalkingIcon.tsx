import React from 'react';

const PersonWalkingIcon: React.FC = () => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-10 w-10" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
    >
        <circle cx="12" cy="5" r="3"></circle>
        <line x1="12" y1="8" x2="12" y2="16"></line>
        <line x1="12" y1="16" x2="9" y2="21"></line>
        <line x1="12" y1="16" x2="15" y2="21"></line>
        <line x1="12" y1="11" x2="7" y2="9"></line>
        <line x1="12" y1="11" x2="17" y2="9"></line>
    </svg>
);

export default PersonWalkingIcon;
