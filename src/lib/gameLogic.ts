import { v4 as uuidv4 } from 'uuid';

export type TileData = {
  id: string;
  value: number;
  position: [number, number]; // [row, col]
  mergedInto?: string;
  isNew?: boolean;
  isMerged?: boolean;
};

export type BoardState = {
  tiles: TileData[];
  score: number;
  gameOver: boolean;
  won: boolean;
};

export const GRID_SIZE = 4;

export const createInitialBoard = (): BoardState => {
  let board: BoardState = { tiles: [], score: 0, gameOver: false, won: false };
  board = addRandomTile(board);
  board = addRandomTile(board);
  return board;
};

const getEmptyPositions = (tiles: TileData[]): [number, number][] => {
  const empty: [number, number][] = [];
  const activeTiles = tiles.filter((t) => !t.mergedInto);
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (!activeTiles.some((t) => t.position[0] === r && t.position[1] === c)) {
        empty.push([r, c]);
      }
    }
  }
  return empty;
};

const addRandomTile = (board: BoardState): BoardState => {
  const emptyPositions = getEmptyPositions(board.tiles);
  if (emptyPositions.length === 0) return board;

  const randomPos = emptyPositions[Math.floor(Math.random() * emptyPositions.length)];
  const value = Math.random() < 0.9 ? 2 : 4;

  const newTile: TileData = {
    id: uuidv4(),
    value,
    position: randomPos,
    isNew: true,
  };

  return { ...board, tiles: [...board.tiles, newTile] };
};

export type Direction = 'up' | 'down' | 'left' | 'right';

export const slideTiles = (board: BoardState, direction: Direction): BoardState => {
  // First clear out merged tiles and reset isNew flag from previous turns
  let currentTiles = board.tiles.filter((t) => !t.mergedInto).map(t => ({ ...t, isNew: false, isMerged: false }));
  
  let changed = false;
  let newScore = board.score;

  // We rotate the grid conceptually depending on direction, process as rows going left, then rotate back conceptually
  // To avoid actual matrix rotation, we can build a 2D grid
  const grid: (TileData | null)[][] = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(null));
  
  for (const tile of currentTiles) {
    grid[tile.position[0]][tile.position[1]] = tile;
  }

  const slideRow = (row: (TileData | null)[]): { newRow: (TileData | null)[], score: number, moved: boolean } => {
    let score = 0;
    let moved = false;
    
    // Filter out nulls
    const tiles = row.filter((t) => t !== null) as TileData[];
    const result: (TileData | null)[] = [];
    
    let i = 0;
    while (i < tiles.length) {
      if (i + 1 < tiles.length && tiles[i].value === tiles[i + 1].value) {
        // Merge!
        const mergedValue = tiles[i].value * 2;
        score += mergedValue;
        
        const targetTile = tiles[i];
        const sourceTile = tiles[i+1];
        
        // We mutate the original tiles in currentTiles array indirectly by updating their state
        // The source tile moves to the target position and gets marked as mergedInto
        sourceTile.mergedInto = targetTile.id;
        sourceTile.position = [...targetTile.position] as [number, number]; // Temporary position update for animation
        
        // Create the new merged tile
        result.push({
          id: uuidv4(),
          value: mergedValue,
          position: [0, 0], // will be updated when re-mapped to grid
          isNew: false,
          isMerged: true, // We could use this for pop animation
        });
        
        targetTile.mergedInto = result[result.length - 1]!.id;

        i += 2;
        moved = true; // Even if it stays in place, it merged
      } else {
        result.push({ ...tiles[i] });
        i++;
      }
    }
    
    // Check if items actually shifted
    if (!moved && tiles.length > 0) {
       for(let k=0; k<tiles.length; k++) {
           if(result[k] && result[k]!.id !== row[k]?.id) moved = true;
       }
    } else if (tiles.length > 0 && result.length !== row.length) {
       // if lengths after filtering don't match, things shifted
       // though we filtered nulls out initially. If it wasn't strictly packed, it moved
    }

    while (result.length < GRID_SIZE) {
      result.push(null);
    }
    
    // Verify shift movement explicitly since above check is naive
    for(let j=0; j<GRID_SIZE; j++) {
        if(row[j]?.id !== result[j]?.id) moved = true;
    }

    return { newRow: result, score, moved };
  };

  const newGrid: (TileData | null)[][] = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(null));

  for (let attempt = 0; attempt < GRID_SIZE; attempt++) {
    let row: (TileData | null)[] = [];
    
    // Extract row/col based on direction
    for (let j = 0; j < GRID_SIZE; j++) {
      if (direction === 'left') row.push(grid[attempt][j]);
      if (direction === 'right') row.push(grid[attempt][GRID_SIZE - 1 - j]);
      if (direction === 'up') row.push(grid[j][attempt]);
      if (direction === 'down') row.push(grid[GRID_SIZE - 1 - j][attempt]);
    }

    const { newRow, score, moved } = slideRow(row);
    if (moved) changed = true;
    newScore += score;

    // Put back into newGrid
    for (let j = 0; j < GRID_SIZE; j++) {
      const tile = newRow[j];
      if (tile) {
        if (direction === 'left') tile.position = [attempt, j];
        if (direction === 'right') tile.position = [attempt, GRID_SIZE - 1 - j];
        if (direction === 'up') tile.position = [j, attempt];
        if (direction === 'down') tile.position = [GRID_SIZE - 1 - j, attempt];
        
        // Also update the hidden merged tiles to move to the final target location
        currentTiles.forEach(oldTile => {
            if (oldTile.mergedInto === tile.id) {
                oldTile.position = tile.position;
            }
        });
      }
      
      if (direction === 'left') newGrid[attempt][j] = tile;
      if (direction === 'right') newGrid[attempt][GRID_SIZE - 1 - j] = tile;
      if (direction === 'up') newGrid[j][attempt] = tile;
      if (direction === 'down') newGrid[GRID_SIZE - 1 - j][attempt] = tile;
    }
  }

  if (!changed) return board;

  // Filter currentTiles that were merged away but we want to keep them for 1 render cycle for animation
  const nextTiles = [
    ...currentTiles,
    ...(newGrid.flat().filter(Boolean) as TileData[]).filter(t => !currentTiles.some(c => c.id === t.id))
  ];

  let nextBoard = { ...board, tiles: nextTiles, score: newScore };
  nextBoard = addRandomTile(nextBoard);

  if (checkGameOver(nextBoard.tiles)) {
    nextBoard.gameOver = true;
  }

  return nextBoard;
};

const checkGameOver = (tiles: TileData[]): boolean => {
  const empty = getEmptyPositions(tiles);
  if (empty.length > 0) return false;

  const activeTiles = tiles.filter(t => !t.mergedInto);
  const grid: (number | null)[][] = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(null));
  activeTiles.forEach(t => grid[t.position[0]][t.position[1]] = t.value);

  // Check adjacencies
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      const val = grid[r][c];
      if (!val) return false;
      if (c < GRID_SIZE - 1 && val === grid[r][c + 1]) return false;
      if (r < GRID_SIZE - 1 && val === grid[r + 1][c]) return false;
    }
  }

  return true;
};
