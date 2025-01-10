import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Coffee, Star, Zap } from 'lucide-react';
import MatrixRain from './MatrixRain';
import CyberBackground from './CyberBackground';

const TerminalInterface = () => {
  const [commands, setCommands] = useState(['Welcome to WOW Terminal! Type "help" to begin. Type "theme" to change theme. X: @wowterminal. CA: ']);
  const [currentCommand, setCurrentCommand] = useState('');
  const [theme, setTheme] = useState('matrix');
  const [gameActive, setGameActive] = useState(false);
  const [gameNumber, setGameNumber] = useState(null);
  const [gameTries, setGameTries] = useState(0);
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [showAchievement, setShowAchievement] = useState(false);
  const [achievementText, setAchievementText] = useState('');
  const inputRef = useRef(null);
  const terminalRef = useRef(null);

  const themes = {
    matrix: {
      bg: 'bg-black',
      text: 'text-green-400',
      accent: 'text-green-300',
      terminal: 'bg-black/80 border border-green-500/30',
      input: 'border-b border-green-500/50'
    },
    cyber: {
      bg: 'bg-gradient-to-br from-blue-900 via-indigo-900 to-black',
      text: 'text-cyan-400',
      accent: 'text-pink-500',
      terminal: 'bg-black/50 border border-cyan-500/30',
      input: 'border-b border-cyan-500/50'
    },
    wow: {
      bg: 'bg-transparent',
      text: 'text-purple-400',
      accent: 'text-pink-500',
      terminal: 'bg-black/50 border border-purple-500/30',
      input: 'border-b border-purple-500/50'
    }
  };

  const addXp = (amount) => {
    setXp(prev => {
      const newXp = prev + amount;
      if (newXp >= level * 100) {
        setLevel(l => l + 1);
        showAchievementPopup('LEVEL UP! 🌟', 100);
      }
      return newXp;
    });
  };

  const showAchievementPopup = (text, xpAmount) => {
    setAchievementText(`${text} +${xpAmount}XP`);
    setShowAchievement(true);
    setTimeout(() => setShowAchievement(false), 3000);
  };

  const handleCommand = (cmd) => {
    const command = cmd.toLowerCase().trim();
    if (!command) return;

    if (!gameActive) addXp(5);

    switch (command) {
      case 'help':
        return `Available Commands:

1. help   - Show all available commands
2. guess  - Start the number guessing game
3. theme  - Change terminal theme (matrix/cyber/wow)
4. clear  - Clear terminal screen
5. about  - Show terminal information
6. stats  - Show your level and XP progress

Type a command to begin!`;

      case 'theme':
        const nextTheme = { matrix: 'cyber', cyber: 'wow', wow: 'matrix' }[theme];
        setTheme(nextTheme);
        addXp(10);
        return `Theme changed to ${nextTheme}!`;

      case 'clear':
        setCommands([]);
        return '';

      case 'about':
        return `WOW Terminal v2.8.0
Current Level: ${level}
XP: ${xp}/${level * 100}
Theme: ${theme}

Type "help" for commands!`;

      case 'stats':
        return `🏆 Level: ${level} | XP: ${xp}/${level * 100}
Progress: [${'='.repeat(Math.floor((xp % (level * 100)) / (level * 10)))}${'.'.repeat(10 - Math.floor((xp % (level * 100)) / (level * 10)))}]`;

      case 'guess':
        if (gameActive) return 'Game already in progress!';
        setGameActive(true);
        setGameNumber(Math.floor(Math.random() * 100) + 1);
        setGameTries(0);
        addXp(15);
        return '🎲 Guess a number between 1 and 100!';

      default:
        if (gameActive) {
          const guess = parseInt(command);
          if (isNaN(guess)) return 'Please enter a valid number.';
          
          setGameTries(prev => prev + 1);
          if (guess === gameNumber) {
            setGameActive(false);
            const baseXp = 50;
            const bonusXp = Math.max(0, 50 - gameTries * 2);
            addXp(baseXp + bonusXp);
            return `🎉 Correct! You won in ${gameTries + 1} tries! (+${baseXp + bonusXp}XP)`;
          }
          return guess < gameNumber ? 'Higher! 👆' : 'Lower! 👇';
        }
        return 'Unknown command. Type "help" for commands.';
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && currentCommand.trim()) {
      const output = handleCommand(currentCommand);
      setCommands(prev => [...prev, `> ${currentCommand}`, output].filter(Boolean));
      setCurrentCommand('');
    }
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
    inputRef.current?.focus();
  }, [commands]);

  return (
    <div className={`min-h-screen ${themes[theme].bg} p-4 font-mono text-sm relative`}>
      {theme === 'matrix' && <MatrixRain />}
      {theme === 'cyber' && <CyberBackground />}
      {theme === 'wow' && (
        <div className="fixed inset-0">
          <video autoPlay loop muted playsInline className="w-full h-full object-cover">
            <source src="/wow.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/50" />
        </div>
      )}

      <div className="relative z-10 space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center bg-black/30 p-3 rounded-lg">
          <div className="flex items-center gap-2">
            <Terminal className={themes[theme].text} />
            <span className={`font-bold ${themes[theme].text}`}>WOW TERMINAL</span>
          </div>
          <div className="flex gap-4">
            <div className={`${themes[theme].text} flex items-center gap-1`}>
              <Star size={16} /> Level {level}
            </div>
            <div className={`${themes[theme].text} flex items-center gap-1`}>
              <Zap size={16} /> {xp}XP
            </div>
          </div>
        </div>

        {/* ASCII Art */}
        <div className={`my-4 ${themes[theme].accent}`}>
          <pre className="text-xs leading-none">
{` __      __  _____   __      __                                                                     ___                    
/\\ \\  __/\\ \\/\\  __\`\\/\\ \\  __/\\ \\                                                                  /'___\\                   
\\ \\ \\/\\ \\ \\ \\ \\ \\/\\ \\ \\ \\/\\ \\ \\ \\                           _____   __  __    ___ ___   _____    /\\ \\__/  __  __    ___    
 \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\                         /\\ '__\`\\/\\ \\/\\ \\ /' __\` __\`\\/\\ '__\`\\  \\ \\ ,__\\/\\ \\/\\ \\ /' _ \`\\  
  \\ \\ \\_/ \\_\\ \\ \\ \\_\\ \\ \\ \\_/ \\_\\ \\                        \\ \\ \\L\\ \\ \\ \\_\\ \\/\\ \\/\\ \\/\\ \\ \\ \\L\\ \\__\\ \\ \\_/\\ \\ \\_\\ \\/\\ \\/\\ \\ 
   \\ \`\\___x___/\\ \\_____\\ \`\\___x___/                         \\ \\ ,__/\\ \\____/\\ \\_\\ \\_\\ \\_\\ \\ ,__/\\_\\\\ \\_\\  \\ \\____/\\ \\_\\ \\_\\
    '\\/__//__/  \\/_____/'\\/__//__/                           \\ \\ \\/  \\/___/  \\/_/\\/_/\\/_/\\ \\ \\/\\/_/ \\/_/   \\/___/  \\/_/\\/_/
                                                              \\ \\_\\                       \\ \\_\\                            
                                                               \\/_/                        \\/_/                            `}</pre>
        </div>

        {/* Terminal Window */}
        <div 
          ref={terminalRef}
          className={`${themes[theme].terminal} rounded-lg p-4 h-[60vh] overflow-y-auto`}
        >
          {commands.map((cmd, i) => (
            <div 
              key={i} 
              className={cmd.startsWith('>') ? 'text-white' : themes[theme].text}
            >
              {cmd}
            </div>
          ))}
        </div>

        {/* Input */}
        <div className={`flex items-center ${themes[theme].terminal} rounded-lg p-2`}>
          <span className={themes[theme].text}>{'>'}</span>
          <input
            ref={inputRef}
            type="text"
            value={currentCommand}
            onChange={(e) => setCurrentCommand(e.target.value)}
            onKeyPress={handleKeyPress}
            className="bg-transparent text-white outline-none flex-1 ml-2"
            autoFocus
          />
        </div>
      </div>

      {/* Theme Toggle Button */}
      <button
        onClick={() => handleCommand('theme')}
        className={`fixed bottom-4 right-4 ${themes[theme].terminal} p-2 rounded-full`}
      >
        <Coffee className={themes[theme].text} />
      </button>

      {/* Achievement Popup */}
      {showAchievement && (
        <div className="fixed top-4 right-4 bg-yellow-500 text-black px-4 py-2 rounded-lg flex items-center gap-2">
          <Star />
          {achievementText}
        </div>
      )}
    </div>
  );
};

export default TerminalInterface;
