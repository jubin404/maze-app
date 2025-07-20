import React from 'react';
import { Button } from './ui/button';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

interface AccessibilitySettings {
  highContrast: boolean;
  audioEnabled: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
}

interface GameControlsProps {
  onMove: (direction: 'up' | 'down' | 'left' | 'right') => void;
  accessibilitySettings: AccessibilitySettings;
  disabled?: boolean;
}

export function GameControls({ onMove, accessibilitySettings, disabled = false }: GameControlsProps) {
  const buttonClass = `w-16 h-16 ${accessibilitySettings.largeText ? 'w-20 h-20' : ''} ${accessibilitySettings.highContrast ? 'border-2 border-black' : ''}`;

  return (
    <div className="flex flex-col items-center space-y-2" role="group" aria-label="Movement controls">
      {/* Up button */}
      <Button
        onClick={() => onMove('up')}
        className={buttonClass}
        variant={accessibilitySettings.highContrast ? "outline" : "default"}
        disabled={disabled}
        aria-label="Move up"
        aria-keyshortcuts="ArrowUp w"
      >
        <ArrowUp className="w-6 h-6" />
      </Button>

      {/* Left, Center, Right row */}
      <div className="flex items-center space-x-2">
        <Button
          onClick={() => onMove('left')}
          className={buttonClass}
          variant={accessibilitySettings.highContrast ? "outline" : "default"}
          disabled={disabled}
          aria-label="Move left"
          aria-keyshortcuts="ArrowLeft a"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>

        {/* Spacer */}
        <div className={`w-16 h-16 ${accessibilitySettings.largeText ? 'w-20 h-20' : ''}`} />

        <Button
          onClick={() => onMove('right')}
          className={buttonClass}
          variant={accessibilitySettings.highContrast ? "outline" : "default"}
          disabled={disabled}
          aria-label="Move right"
          aria-keyshortcuts="ArrowRight d"
        >
          <ArrowRight className="w-6 h-6" />
        </Button>
      </div>

      {/* Down button */}
      <Button
        onClick={() => onMove('down')}
        className={buttonClass}
        variant={accessibilitySettings.highContrast ? "outline" : "default"}
        disabled={disabled}
        aria-label="Move down"
        aria-keyshortcuts="ArrowDown s"
      >
        <ArrowDown className="w-6 h-6" />
      </Button>

      {/* Instructions for screen readers */}
      <p className="text-xs text-muted-foreground text-center mt-2" aria-live="polite">
        {disabled ? 'Game completed!' : 'Use buttons or keyboard arrows (WASD) to move'}
      </p>
    </div>
  );
}