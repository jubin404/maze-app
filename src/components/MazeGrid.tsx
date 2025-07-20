import React from 'react';

interface AccessibilitySettings {
  highContrast: boolean;
  audioEnabled: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
}

interface MazeGridProps {
  maze: number[][];
  playerPosition: { x: number; y: number };
  accessibilitySettings: AccessibilitySettings;
}

export function MazeGrid({ maze, playerPosition, accessibilitySettings }: MazeGridProps) {
  const getCellContent = (row: number, col: number) => {
    // Player position takes priority
    if (playerPosition.x === col && playerPosition.y === row) {
      return { emoji: '⭐', pattern: 'player', ariaLabel: 'Your current position' };
    }
    
    // Then check maze cell type
    switch (maze[row][col]) {
      case 0: // Path
        return { emoji: '', pattern: 'path', ariaLabel: 'Open path' };
      case 1: // Wall
        return { emoji: '🧱', pattern: 'wall', ariaLabel: 'Wall - blocked' };
      case 2: // Start (but player has moved)
        return { emoji: '', pattern: 'path', ariaLabel: 'Starting position' };
      case 3: // Goal
        return { emoji: '🏠', pattern: 'goal', ariaLabel: 'Goal - home' };
      default:
        return { emoji: '', pattern: 'path', ariaLabel: 'Open path' };
    }
  };

  const getCellStyle = (pattern: string) => {
    const baseStyle = "w-10 h-10 border border-gray-300 flex items-center justify-center text-lg transition-all duration-200";
    
    if (accessibilitySettings.highContrast) {
      switch (pattern) {
        case 'wall':
          return `${baseStyle} bg-black text-white border-white`;
        case 'path':
          return `${baseStyle} bg-white text-black border-black`;
        case 'player':
          return `${baseStyle} bg-yellow-300 text-black border-black border-2`;
        case 'goal':
          return `${baseStyle} bg-green-300 text-black border-black`;
        default:
          return `${baseStyle} bg-white text-black border-black`;
      }
    } else {
      switch (pattern) {
        case 'wall':
          return `${baseStyle} bg-gray-700 text-white`;
        case 'path':
          return `${baseStyle} bg-gray-100`;
        case 'player':
          return `${baseStyle} bg-yellow-200 border-yellow-400 border-2 shadow-lg ${!accessibilitySettings.reducedMotion ? 'animate-pulse' : ''}`;
        case 'goal':
          return `${baseStyle} bg-green-200 border-green-400`;
        default:
          return `${baseStyle} bg-gray-100`;
      }
    }
  };

  return (
    <div 
      className="grid grid-cols-7 gap-1 p-4 bg-white rounded-lg shadow-md"
      role="grid"
      aria-label="Maze game grid. Navigate using arrow keys or control buttons."
    >
      {maze.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const cellInfo = getCellContent(rowIndex, colIndex);
          const isCurrentPosition = playerPosition.x === colIndex && playerPosition.y === rowIndex;
          
          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={getCellStyle(cellInfo.pattern)}
              role="gridcell"
              aria-label={isCurrentPosition ? `${cellInfo.ariaLabel} - you are here` : cellInfo.ariaLabel}
              aria-current={isCurrentPosition ? 'location' : undefined}
            >
              <span role="img" aria-hidden="true">
                {cellInfo.emoji}
              </span>
            </div>
          );
        })
      )}
    </div>
  );
}