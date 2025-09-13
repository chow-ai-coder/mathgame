import React from 'react';

const RestartIcon: React.FC = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className="h-6 w-6" 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor" 
    strokeWidth={2}
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M4 4v5h5M20 20v-5h-5" 
    />
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M4 9a9 9 0 0114.13-5.13M20 15a9 9 0 01-14.13 5.13" 
    />
  </svg>
);

export default RestartIcon;
