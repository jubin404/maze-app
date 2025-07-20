import { useEffect, useState } from "react";
import "./App.css";

import MazeCanvas from "./components/MazeCanvas";
import SettingsPanel from "./components/SettingsPanel";
import SubtitleOverlay from "./components/SubtitleOverlay";
import LevelCompleteMessage from "./components/LevelCompleteMessage";
import { generateMaze } from "./utils/generateMaze";

function App() {
  const [level, setLevel] = useState(1);
  const [maze, setMaze] = useState<number[][]>(generateMaze(1));
  const [player, setPlayer] = useState({
    x: generateMaze(1)[0].length - 2,
    y: generateMaze(1).length - 2,
  });

  const [showMessage, setShowMessage] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [useIcons, setUseIcons] = useState(true);
  const [highContrast, setHighContrast] = useState(false);
  const [colorBlindMode, setColorBlindMode] = useState("normal");
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(false);
  const [subtitle, setSubtitle] = useState("");
  const [tileSize, setTileSize] = useState(50);
  const [showSplash, setShowSplash] = useState(true);

  const synth = window.speechSynthesis;

  useEffect(() => {
    const updateTileSize = () => {
      const maxWidth = window.innerWidth * 0.7;
      const maxHeight = window.innerHeight * 0.7;
      const cols = maze[0].length;
      const rows = maze.length;
      const newTileSize = Math.floor(Math.min(maxWidth / cols, maxHeight / rows));
      setTileSize(newTileSize);
    };
    updateTileSize();
    window.addEventListener("resize", updateTileSize);
    return () => window.removeEventListener("resize", updateTileSize);
  }, [maze]);

  useEffect(() => {
    const speak = (text: string) => {
      if (ttsEnabled) {
        synth.cancel();
        const utter = new SpeechSynthesisUtterance(text);
        synth.speak(utter);
      }
      setSubtitle(text);
      setTimeout(() => setSubtitle(""), 2000);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      let { x, y } = player;
      let newX = x;
      let newY = y;

      if (e.key === "ArrowUp") newY--;
      else if (e.key === "ArrowDown") newY++;
      else if (e.key === "ArrowLeft") newX--;
      else if (e.key === "ArrowRight") newX++;

      if (
        newX >= 0 &&
        newY >= 0 &&
        newY < maze.length &&
        newX < maze[0].length
      ) {
        if (maze[newY][newX] === 0) {
          setPlayer({ x: newX, y: newY });
          speak("Step");

          const goalX = 1;
          const goalY = 1;

          if (Math.abs(newX - goalX) + Math.abs(newY - goalY) === 1) {
            speak("Almost there");
          }

          if (newX === goalX && newY === goalY) {
            setShowMessage(true);
            speak("Finished");

            const nextLevel = level + 1;
            const newMaze = generateMaze(nextLevel);

            setTimeout(() => {
              setLevel(nextLevel);
              setMaze(newMaze);
              setPlayer({
                x: newMaze[0].length - 2,
                y: newMaze.length - 2,
              });
              setShowMessage(false);
            }, 1500);
          }
        } else {
          speak("Wall");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [player, maze, level, ttsEnabled]);

  return (
    <>
      {showSplash ? (
        <div className="splash-screen">
          <h1 className="game-title">
            🧩 MazeVerse<br />
          </h1>
          <p>Help the star find its way home through the maze!</p>
          <button className="play-button" onClick={() => setShowSplash(false)}>
            🎮 Play Game
          </button>
        </div>
      ) : (
        <>
          <div className="canvas-container">
            <div className="level-display"><h2>Level {level}</h2></div>
            <MazeCanvas
              maze={maze}
              player={player}
              useIcons={useIcons}
              tileSize={tileSize}
              highContrast={highContrast}
              colorBlindMode={colorBlindMode}
            />
          </div>

          {subtitlesEnabled && <SubtitleOverlay subtitle={subtitle} />}
          {showMessage && <LevelCompleteMessage level={level} />}

          <button id="settings-btn" onClick={() => setShowSettings(!showSettings)}>
            ⚙️
          </button>

          {showSettings && (
            <SettingsPanel
              useIcons={useIcons}
              setUseIcons={setUseIcons}
              highContrast={highContrast}
              setHighContrast={setHighContrast}
              colorBlindMode={colorBlindMode}
              setColorBlindMode={setColorBlindMode}
              subtitlesEnabled={subtitlesEnabled}
              setSubtitlesEnabled={setSubtitlesEnabled}
              ttsEnabled={ttsEnabled}
              setTtsEnabled={setTtsEnabled}
            />
          )}
        </>
      )}
    </>
  );
}

export default App;
