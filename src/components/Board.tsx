import { TileData } from '../lib/gameLogic';
import { Tile } from './Tile';

interface BoardProps {
  tiles: TileData[];
}

export const Board = ({ tiles }: BoardProps) => {
  // Create the empty background grid
  const gridCells = Array.from({ length: 16 }, (_, i) => i);

  return (
    <div className="relative w-full max-w-[400px] aspect-square bg-[var(--color-grid-bg)] rounded-xl p-1.5 shadow-2xl mx-auto touch-none overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 p-1.5 grid grid-cols-4 grid-rows-4 gap-3 z-0">
        {gridCells.map((i) => (
          <div key={`cell-${i}`} className="bg-[var(--color-grid-cell)] rounded-lg w-full h-full" />
        ))}
      </div>

      {/* Tiles layer */}
      <div className="absolute inset-0 z-10 p-0 pointer-events-none">
        {tiles.map((tile) => (
          <Tile key={tile.id} tile={tile} />
        ))}
      </div>
    </div>
  );
};
