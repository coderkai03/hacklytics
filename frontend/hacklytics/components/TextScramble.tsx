'use client';
import { useEffect, useState } from 'react';

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

interface TextScrambleProps {
  text: string;
}

export default function TextScramble({ text }: TextScrambleProps) {
  const [displayText, setDisplayText] = useState('');
  
  useEffect(() => {
    let iteration = 0;
    let interval: NodeJS.Timeout;
    
    const scramble = () => {
      if (iteration >= text.length * 3) {
        setDisplayText(text);
        clearInterval(interval);
        return;
      }

      const scrambled = text
        .split('')
        .map((char, index) => {
          if (index < iteration / 3) {
            return text[index];
          }
          if (char === ' ') return ' ';
          return characters[Math.floor(Math.random() * characters.length)];
        })
        .join('');

      setDisplayText(scrambled);
      iteration += 1;
    };

    interval = setInterval(scramble, 30);
    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayText}</span>;
} 