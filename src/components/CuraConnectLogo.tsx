import React from 'react';

interface LogoProps {
  className?: string;
}

export const CuraConnectLogo: React.FC<LogoProps> = ({ className = 'w-12 h-12' }) => (
  <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Left Hand - Yellow */}
    <path d="M 45 85 C 15 85 5 65 5 50 C 5 30 20 15 40 15 C 40 15 30 30 30 50 C 30 65 35 75 45 85 Z" fill="#FCD144" />
    <path d="M 15 35 C 25 25 40 25 40 25" stroke="#FCD144" strokeWidth="6" strokeLinecap="round" fill="none" />
    <path d="M 10 45 C 20 35 35 35 35 35" stroke="#FCD144" strokeWidth="6" strokeLinecap="round" fill="none" />
    <path d="M 7 55 C 17 45 30 45 30 45" stroke="#FCD144" strokeWidth="6" strokeLinecap="round" fill="none" />
    {/* Right Hand - Blue */}
    <path d="M 55 85 C 85 85 95 65 95 50 C 95 30 80 15 60 15 C 60 15 70 30 70 50 C 70 65 65 75 55 85 Z" fill="#005A95" />
    <path d="M 85 35 C 75 25 60 25 60 25" stroke="#005A95" strokeWidth="6" strokeLinecap="round" fill="none" />
    <path d="M 90 45 C 80 35 65 35 65 35" stroke="#005A95" strokeWidth="6" strokeLinecap="round" fill="none" />
    <path d="M 93 55 C 83 45 70 45 70 45" stroke="#005A95" strokeWidth="6" strokeLinecap="round" fill="none" />
  </svg>
);
