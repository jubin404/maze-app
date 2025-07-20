import { useEffect, useRef } from "react";

const emojiIcons = {
  wall: "🧱",
  player: "⭐",
  goal: "🏠",
};

const colorPalettes: any = {
  normal: { wall: "#444", player: "#007bff", goal: "#28a745" },
  protanopia: { wall: "#444", player: "#0072B2", goal: "#E69F00" },
  deuteranopia: { wall: "#444", player: "#0072B2", goal: "#F0E442" },
  tritanopia: { wall: "#444", player: "#D55E00", goal: "#009E73" },
};

interface Props {
  maze: number[][];
  player: { x: number; y: number };
  useIcons: boolean;
  tileSize: number;
  highContrast: boolean;
  colorBlindMode: string;
}

export default function MazeCanvas({
  maze,
  player,
  useIcons,
  tileSize,
  highContrast,
  colorBlindMode,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const logicalWidth = maze[0].length * tileSize;
    const logicalHeight = maze.length * tileSize;

    canvas.width = logicalWidth * dpr;
    canvas.height = logicalHeight * dpr;
    canvas.style.width = `${logicalWidth}px`;
    canvas.style.height = `${logicalHeight}px`;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, logicalWidth, logicalHeight);

    const theme = highContrast
      ? { wall: "#BBBBBB", player: "#FFFFFF", goal: "#FF00FF" }
      : colorPalettes[colorBlindMode];

    for (let y = 0; y < maze.length; y++) {
      for (let x = 0; x < maze[0].length; x++) {
        if (maze[y][x] === 1) {
          if (useIcons) {
            ctx.font = `${tileSize * 0.8}px sans-serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(emojiIcons.wall, x * tileSize + tileSize / 2, y * tileSize + tileSize / 2);
          } else {
            ctx.fillStyle = theme.wall;
            ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
          }
        }
      }
    }

    const goalX = maze[0].length - 2;
    const goalY = maze.length - 2;

    if (useIcons) {
      ctx.fillText(emojiIcons.goal, goalX * tileSize + tileSize / 2, goalY * tileSize + tileSize / 2);
    } else {
      ctx.fillStyle = theme.goal;
      ctx.fillRect(goalX * tileSize, goalY * tileSize, tileSize, tileSize);
    }

    if (useIcons) {
      ctx.fillText(emojiIcons.player, player.x * tileSize + tileSize / 2, player.y * tileSize + tileSize / 2);
    } else {
      ctx.fillStyle = theme.player;
      ctx.beginPath();
      ctx.arc(player.x * tileSize + tileSize / 2, player.y * tileSize + tileSize / 2, tileSize / 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [maze, player, useIcons, tileSize, highContrast, colorBlindMode]);

  return <canvas ref={canvasRef} />;
}
