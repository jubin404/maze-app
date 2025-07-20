import React from 'react';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { ArrowLeft, Eye, Volume2, Type, Zap, Monitor } from 'lucide-react';

interface AccessibilitySettings {
  highContrast: boolean;
  audioEnabled: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
}

interface AccessibilitySettingsProps {
  settings: AccessibilitySettings;
  onSettingsChange: (settings: AccessibilitySettings) => void;
  onBack: () => void;
}

export function AccessibilitySettings({ settings, onSettingsChange, onBack }: AccessibilitySettingsProps) {
  const updateSetting = (key: keyof AccessibilitySettings, value: boolean) => {
    onSettingsChange({
      ...settings,
      [key]: value
    });
  };

  const settingsGroups = [
    {
      title: 'Visual Settings',
      icon: <Eye className="w-5 h-5" />,
      description: 'Options for better visibility',
      settings: [
        {
          key: 'highContrast' as keyof AccessibilitySettings,
          label: 'High Contrast',
          description: 'Stronger colors for better visibility',
          helpText: 'Great for users with color blindness or low vision'
        },
        {
          key: 'largeText' as keyof AccessibilitySettings,
          label: 'Large Text & Buttons',
          description: 'Bigger text and touch targets',
          helpText: 'Easier to read and tap on mobile devices'
        },
        {
          key: 'reducedMotion' as keyof AccessibilitySettings,
          label: 'Reduce Motion',
          description: 'Less animations and movement',
          helpText: 'Helps users sensitive to motion'
        }
      ]
    },
    {
      title: 'Audio Settings',
      icon: <Volume2 className="w-5 h-5" />,
      description: 'Sound and audio feedback',
      settings: [
        {
          key: 'audioEnabled' as keyof AccessibilitySettings,
          label: 'Audio Feedback',
          description: 'Sound effects for game actions',
          helpText: 'Provides audio cues for moves and obstacles'
        }
      ]
    },
    {
      title: 'Screen Reader',
      icon: <Monitor className="w-5 h-5" />,
      description: 'Support for assistive technology',
      settings: [
        {
          key: 'screenReader' as keyof AccessibilitySettings,
          label: 'Screen Reader Support',
          description: 'Enhanced announcements',
          helpText: 'Provides detailed spoken descriptions of game state'
        }
      ]
    }
  ];

  return (
    <div className="flex flex-col h-full p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          onClick={onBack}
          variant="outline"
          size="sm"
          aria-label="Go back to main menu"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1>Accessibility Settings</h1>
      </div>

      {/* Intro */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>♿</span>
            <span>Make the game work for you!</span>
          </CardTitle>
          <CardDescription>
            These settings help make the maze game easier to play for everyone.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Settings Groups */}
      <div className="flex-1 space-y-4 overflow-y-auto">
        {settingsGroups.map((group, groupIndex) => (
          <Card key={groupIndex}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                {group.icon}
                <span>{group.title}</span>
              </CardTitle>
              <CardDescription>{group.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {group.settings.map((setting, settingIndex) => (
                <div key={settingIndex} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor={setting.key} className="font-medium">
                        {setting.label}
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {setting.description}
                      </p>
                    </div>
                    <Switch
                      id={setting.key}
                      checked={settings[setting.key]}
                      onCheckedChange={(checked) => updateSetting(setting.key, checked)}
                      aria-describedby={`${setting.key}-help`}
                    />
                  </div>
                  <p 
                    id={`${setting.key}-help`}
                    className="text-xs text-muted-foreground bg-muted p-2 rounded"
                  >
                    💡 {setting.helpText}
                  </p>
                  {settingIndex < group.settings.length - 1 && <Separator />}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex space-x-2">
            <Button
              onClick={() => onSettingsChange({
                highContrast: true,
                audioEnabled: true,
                largeText: true,
                reducedMotion: true,
                screenReader: true
              })}
              variant="outline"
              className="flex-1"
            >
              Enable All
            </Button>
            <Button
              onClick={() => onSettingsChange({
                highContrast: false,
                audioEnabled: true,
                largeText: false,
                reducedMotion: false,
                screenReader: false
              })}
              variant="outline"
              className="flex-1"
            >
              Reset to Default
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}