import { motion } from 'motion/react';
import { TileData } from '../lib/gameLogic';

// Determine color variables based on value
export const getTileColorClass = (value: number) => {
  if (value > 2048) return 'bg-[#ff3366] text-white shadow-[0_0_20px_rgba(255,51,102,0.4)]';
  
  const colors: Record<number, string> = {
    2: 'bg-[var(--color-tile-2)] text-gray-300 border border-[var(--border)]',
    4: 'bg-[var(--color-tile-4)] text-gray-200 border border-[var(--border)]',
    8: 'bg-[var(--color-tile-8)] text-white shadow-[0_0_10px_rgba(242,177,121,0.2)]',
    16: 'bg-[#8B5CF6] text-white shadow-[0_0_15px_rgba(139,92,246,0.4)]', // Cyber Purple
    32: 'bg-[#06B6D4] text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]', // Cyber Cyan
    64: 'bg-[#0052ff] text-white shadow-[0_0_20px_rgba(0,82,255,0.5)]', // Base Blue
    128: 'bg-[#edcf72] text-white shadow-[0_0_25px_rgba(237,207,114,0.6)] text-[2rem]',
    256: 'bg-[#edcc61] text-white shadow-[0_0_25px_rgba(237,204,97,0.7)] text-[2rem]',
    512: 'bg-[#edc850] text-white shadow-[0_0_30px_rgba(237,204,97,0.8)] text-[2rem]',
    1024: 'bg-[#edc53f] text-white shadow-[0_0_35px_rgba(237,197,63,0.9)] text-[1.5rem]',
    2048: 'bg-[#edc22e] text-white shadow-[0_0_40px_rgba(237,194,46,1)] text-[1.5rem] ring-4 ring-[#edc22e]/50 text-black', // Made text black for 2048 contrast
  };
  
  return colors[value] || 'bg-gray-800 text-white';
};

interface TileProps {
  tile: TileData;
  key?: string | number;
}

export const Tile = ({ tile }: TileProps) => {
  // Calculate top, left in %
  const top = `${tile.position[0] * 25}%`;
  const left = `${tile.position[1] * 25}%`;
  
  const tileLabels: Record<number, string> = {
    2: "$DEGEN",
    4: "$BRETT",
    8: "$TOBY",
    16: "$TOSHI",
    32: "AERO",
    64: "WETH",
    128: "BRIDGE",
    256: "BUILD",
    512: "BASE",
    1024: "JESSE",
    2048: "ONCHAIN"
  };

  const label = tileLabels[tile.value] || "";

  return (
    <motion.div
      layout
      initial={tile.isNew ? { scale: 0, opacity: 0 } : false}
      animate={{ 
        scale: tile.isMerged ? [1.2, 1] : 1, 
        opacity: 1, 
        top, 
        left 
      }}
      transition={{ 
        type: 'spring', 
        stiffness: 400, 
        damping: 30,
        scale: { duration: 0.15 } 
      }}
      className={`absolute w-1/4 h-1/4 p-1.5`}
    >
      <div className={`w-full h-full rounded-lg flex flex-col items-center justify-center font-bold transition-colors duration-200 ${getTileColorClass(tile.value)}`}>
        <span className="text-2xl leading-none md:text-3xl">{tile.value}</span>
        {label && <span className="text-[0.5rem] mt-0.5 opacity-80 md:text-xs">{label}</span>}
      </div>
    </motion.div>
  );
};
