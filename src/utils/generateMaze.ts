export const generateMaze = (level: number): number[][] => {
    const maxSize = 25;
    const baseSize = 5;
    const increment = Math.floor(level / 3) * 2;
    const innerSize = Math.min(baseSize + increment, maxSize);
    const maze = Array.from({ length: innerSize }, () => Array(innerSize).fill(1));
  
    // Shuffle directions
    const shuffle = (arr: any[]) => {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    };
  
    // Carve maze using recursive backtracking
    const carve = (x: number, y: number) => {
      const directions = shuffle([
        [0, -2], [2, 0], [0, 2], [-2, 0],
      ]);
      for (const [dx, dy] of directions) {
        const nx = x + dx;
        const ny = y + dy;
        if (
          nx >= 0 && nx < innerSize &&
          ny >= 0 && ny < innerSize &&
          maze[ny][nx] === 1
        ) {
          maze[y + dy / 2][x + dx / 2] = 0;
          maze[ny][nx] = 0;
          carve(nx, ny);
        }
      }
    };
  
    // Pick random odd starting point
    const startX = 0;
    const startY = 0;
    maze[startY][startX] = 0;
    carve(startX, startY);
  
    // Ensure goal is clear
    maze[innerSize - 1][innerSize - 1] = 0;
  
    // Add real loops by removing walls between 2 path cells that have 2-tile spacing
    const addLoops = (count: number) => {
      let added = 0;
      let attempts = 0;
      while (added < count && attempts < count * 10) {
        const x = Math.floor(Math.random() * (innerSize / 2)) * 2 + 1;
        const y = Math.floor(Math.random() * (innerSize / 2)) * 2 + 1;
  
        const directions: [number, number][] = shuffle([
          [0, -1], [1, 0], [0, 1], [-1, 0],
        ]);
  
        for (const [dx, dy] of directions) {
          const nx = x + dx;
          const ny = y + dy;
          if (
            nx > 0 && nx < innerSize - 1 &&
            ny > 0 && ny < innerSize - 1 &&
            maze[y][x] === 0 &&
            maze[ny][nx] === 0 &&
            maze[y + dy / 2]?.[x + dx / 2] === 1
          ) {
            maze[y + dy / 2][x + dx / 2] = 0;
            added++;
            break;
          }
        }
  
        attempts++;
      }
    };
  
    const loops = Math.min(innerSize, 5 + Math.floor(level / 2));
    addLoops(loops);
  
    // Add outer walls
    const fullSize = innerSize + 2;
    return Array.from({ length: fullSize }, (_, y) =>
      Array.from({ length: fullSize }, (_, x) =>
        (x === 0 || y === 0 || x === fullSize - 1 || y === fullSize - 1)
          ? 1
          : maze[y - 1][x - 1]
      )
    );
  };
  