import React, { useState, useEffect, useCallback } from 'react';
import { Button } from './ui/button';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Home, RotateCcw } from 'lucide-react';
import { MazeGrid } from './MazeGrid';
import { GameControls } from './GameControls';

interface AccessibilitySettings {
  highContrast: boolean;
  audioEnabled: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
}

interface MazeGameProps {
  accessibilitySettings: AccessibilitySettings;
  onBack: () => void;
}

type CellType = 'wall' | 'path' | 'player' | 'goal';

const MAZE_SIZE = 7;

// Simple maze layout (0 = path, 1 = wall, 2 = player start, 3 = goal)
const INITIAL_MAZE = [
  [1, 1, 1, 1, 1, 1, 1],
  [1, 2, 0, 1, 0, 0, 1],
  [1, 1, 0, 1, 0, 1, 1],
  [1, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 1, 3, 1],
  [1, 1, 1, 1, 1, 1, 1]
];

export function MazeGame({ accessibilitySettings, onBack }: MazeGameProps) {
  const [playerPosition, setPlayerPosition] = useState({ x: 1, y: 1 });
  const [maze, setMaze] = useState(INITIAL_MAZE);
  const [gameWon, setGameWon] = useState(false);
  const [moves, setMoves] = useState(0);

  const playSound = useCallback((type: 'move' | 'wall' | 'win') => {
    if (!accessibilitySettings.audioEnabled) return;
    
    // Create simple audio feedback using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    switch (type) {
      case 'move':
        oscillator.frequency.value = 440; // A note
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        break;
      case 'wall':
        oscillator.frequency.value = 200; // Lower tone for blocked
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        break;
      case 'win':
        oscillator.frequency.value = 660; // Higher celebratory tone
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        break;
    }
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.1);
  }, [accessibilitySettings.audioEnabled]);

  const announceToScreenReader = useCallback((message: string) => {
    if (!accessibilitySettings.screenReader) return;
    
    // Create a live region for screen reader announcements
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    setTimeout(() => document.body.removeChild(announcement), 1000);
  }, [accessibilitySettings.screenReader]);

  const movePlayer = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    if (gameWon) return;

    const newPosition = { ...playerPosition };
    
    switch (direction) {
      case 'up':
        newPosition.y -= 1;
        break;
      case 'down':
        newPosition.y += 1;
        break;
      case 'left':
        newPosition.x -= 1;
        break;
      case 'right':
        newPosition.x += 1;
        break;
    }

    // Check if the new position is valid (not a wall and within bounds)
    if (
      newPosition.x >= 0 && 
      newPosition.x < MAZE_SIZE && 
      newPosition.y >= 0 && 
      newPosition.y < MAZE_SIZE &&
      maze[newPosition.y][newPosition.x] !== 1
    ) {
      setPlayerPosition(newPosition);
      setMoves(prev => prev + 1);
      playSound('move');
      
      // Check if player reached the goal
      if (maze[newPosition.y][newPosition.x] === 3) {
        setGameWon(true);
        playSound('win');
        announceToScreenReader('Congratulations! You found the way home! You won the game!');
      } else {
        announceToScreenReader(`Moved ${direction}. Position ${newPosition.x + 1}, ${newPosition.y + 1}.`);
      }
    } else {
      playSound('wall');
      announceToScreenReader(`Cannot move ${direction}. There is a wall.`);
    }
  }, [playerPosition, maze, gameWon, playSound, announceToScreenReader]);

  const resetGame = () => {
    setPlayerPosition({ x: 1, y: 1 });
    setGameWon(false);
    setMoves(0);
    announceToScreenReader('Game reset. You are back at the starting position.');
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          event.preventDefault();
          movePlayer('up');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          event.preventDefault();
          movePlayer('down');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          event.preventDefault();
          movePlayer('left');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          event.preventDefault();
          movePlayer('right');
          break;
        case 'r':
        case 'R':
          event.preventDefault();
          resetGame();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [movePlayer]);

  return (
    <div className="flex flex-col h-full p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          onClick={onBack}
          variant="outline"
          size="sm"
          aria-label="Go back to main menu"
        >
          <Home className="w-4 h-4" />
        </Button>
        
        <div className="text-center">
          <h2 className="font-semibold">Maze Adventure</h2>
          <p className="text-sm text-muted-foreground">Moves: {moves}</p>
        </div>
        
        <Button
          onClick={resetGame}
          variant="outline"
          size="sm"
          aria-label="Reset game to start over"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      {/* Game Status */}
      {gameWon && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded text-center" role="alert">
          🎉 Congratulations! You found your way home in {moves} moves!
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded p-3">
        <p className="text-sm text-blue-800">
          Help the ⭐ find its way to the 🏠 home! Use the arrow buttons or keyboard arrows (W,A,S,D) to move.
        </p>
      </div>

      {/* Maze Grid */}
      <div className="flex-1 flex items-center justify-center">
        <MazeGrid 
          maze={maze} 
          playerPosition={playerPosition} 
          accessibilitySettings={accessibilitySettings}
        />
      </div>

      {/* Game Controls */}
      <GameControls 
        onMove={movePlayer} 
        accessibilitySettings={accessibilitySettings}
        disabled={gameWon}
      />
    </div>
  );
}