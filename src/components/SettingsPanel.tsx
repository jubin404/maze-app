interface Props {
    useIcons: boolean;
    setUseIcons: (v: boolean) => void;
    highContrast: boolean;
    setHighContrast: (v: boolean) => void;
    colorBlindMode: string;
    setColorBlindMode: (v: string) => void;
    subtitlesEnabled: boolean;
    setSubtitlesEnabled: (v: boolean) => void;
    ttsEnabled: boolean;
    setTtsEnabled: (v: boolean) => void;
}

export default function SettingsPanel({
    useIcons, setUseIcons,
    highContrast, setHighContrast,
    colorBlindMode, setColorBlindMode,
    subtitlesEnabled, setSubtitlesEnabled,
    ttsEnabled, setTtsEnabled,
}: Props) {
    const isColorSettingsDisabled = useIcons;

    return (
        <div id="settings" aria-label="Game Accessibility Settings" role="region">
            <fieldset>
                <legend>Accessibility Options</legend>

                <div>
                    <input
                        type="checkbox"
                        id="subtitles"
                        checked={subtitlesEnabled}
                        onChange={() => setSubtitlesEnabled(!subtitlesEnabled)}
                    />
                    <label htmlFor="subtitles">Subtitles</label>
                </div>

                <div>
                    <input
                        type="checkbox"
                        id="tts"
                        checked={ttsEnabled}
                        onChange={() => setTtsEnabled(!ttsEnabled)}
                    />
                    <label htmlFor="tts">Voice Assistance</label>
                </div>

                <div>
                    <input
                        type="checkbox"
                        id="icons"
                        checked={useIcons}
                        onChange={() => {
                            setUseIcons(!useIcons);
                            if (useIcons) setColorBlindMode("normal");
                        }}
                    />
                    <label htmlFor="icons">Icon Mode</label>
                    <span>(Disable Icon mode to use high-contrast and colorblind modes)</span>
                </div>

                <div>
                    <input
                        type="checkbox"
                        id="contrast"
                        checked={highContrast}
                        onChange={() => setHighContrast(!highContrast)}
                        disabled={useIcons}
                        aria-describedby={useIcons ? "contrastInfo" : undefined}
                    />
                    <label htmlFor="contrast">High Contrast Mode</label>
                    {useIcons && (
                        <div id="contrastInfo" className="sr-only">
                            Disable Icon Mode to enable High Contrast Mode
                        </div>
                    )}
                </div>

                <div>
                    <label htmlFor="colorBlindMode">Colorblind Mode:</label>
                    <select
                        id="colorBlindMode"
                        value={colorBlindMode}
                        onChange={(e) => setColorBlindMode(e.target.value)}
                        disabled={useIcons}
                        aria-describedby={useIcons ? "cbInfo" : undefined}
                    >
                        <option value="normal">None</option>
                        <option value="protanopia">Protanopia</option>
                        <option value="deuteranopia">Deuteranopia</option>
                        <option value="tritanopia">Tritanopia</option>
                    </select>
                    {useIcons && (
                        <div id="cbInfo" className="sr-only">
                            Disable Icon Mode to enable Colorblind Settings
                        </div>
                    )}
                </div>
            </fieldset>
        </div>
    );
}

