import React, { useState } from 'react';
import { MazeGame } from './components/MazeGame';
import { AccessibilitySettings } from './components/AccessibilitySettings';
import { Button } from './components/ui/button';
import { Settings, Home } from 'lucide-react';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'menu' | 'game' | 'settings'>('menu');
  const [accessibilitySettings, setAccessibilitySettings] = useState({
    highContrast: false,
    audioEnabled: true,
    largeText: false,
    reducedMotion: false,
    screenReader: false
  });

  const renderScreen = () => {
    switch (currentScreen) {
      case 'game':
        return <MazeGame accessibilitySettings={accessibilitySettings} onBack={() => setCurrentScreen('menu')} />;
      case 'settings':
        return (
          <AccessibilitySettings
            settings={accessibilitySettings}
            onSettingsChange={setAccessibilitySettings}
            onBack={() => setCurrentScreen('menu')}
          />
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full p-6 space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-4xl text-primary">🧩 Maze Adventure</h1>
              <p className="text-muted-foreground max-w-sm">
                Help the star find its way home through the maze!
              </p>
            </div>

            <div className="w-full max-w-sm space-y-4">
              <Button
                onClick={() => setCurrentScreen('game')}
                className="w-full h-16 text-lg"
                aria-label="Start playing the maze game"
              >
                🎮 Play Game
              </Button>

              <Button
                onClick={() => setCurrentScreen('settings')}
                variant="outline"
                className="w-full h-16 text-lg"
                aria-label="Open accessibility settings"
              >
                <Settings className="w-6 h-6 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`min-h-screen bg-background ${accessibilitySettings.highContrast ? 'contrast-150' : ''} ${accessibilitySettings.largeText ? 'text-lg' : ''}`}>
      <div className="max-w-md mx-auto h-screen flex flex-col">
        {renderScreen()}
      </div>
    </div>
  );
}
