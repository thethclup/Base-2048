import { use2048 } from './lib/use2048';
import { Board } from './components/Board';
import { GameHeader } from './components/GameHeader';
import { Web3Provider } from './providers/Web3Provider';
import { Web3Connect } from './components/Web3Utils';
import { motion, AnimatePresence } from 'motion/react';
import { Github, Trophy, Twitter, Sun } from 'lucide-react';
import { useAccount, useSendTransaction } from 'wagmi';
import { parseEther, stringToHex } from 'viem';
import { ERC8021 } from './lib/erc8021';
import { useState } from 'react';

function GameContent() {
  const { board, bestScore, move, undo, reset, canUndo } = use2048();
  const { isConnected } = useAccount();
  const { sendTransaction, isPending } = useSendTransaction();
  const [txStatus, setTxStatus] = useState<string | null>(null);

  const sendGMTransaction = () => {
    if (!isConnected) return;
    ERC8021.trackAttribution();
    
    sendTransaction({
      to: '0xc35B9997B63B1CE14f8F513f7eddD9a7ABbB33d7',
      value: parseEther('0'),
      data: stringToHex('GM')
    }, {
      onSuccess: () => {
        setTxStatus('GM transaction submitted!');
        setTimeout(() => setTxStatus(null), 3000);
      },
      onError: (e) => {
        setTxStatus(`Error: ${e.message.slice(0, 20)}...`);
        setTimeout(() => setTxStatus(null), 3000);
      }
    });
  };

  return (
    <div className="min-h-screen pb-12 pt-6 px-4 flex flex-col items-center">
      <div className="w-full max-w-[400px] flex justify-between items-center mb-10">
        <div className="flex gap-4">
          <a href="#" className="p-2 bg-[var(--card)] rounded-full hover:bg-[var(--border)] transition">
            <Trophy size={20} className="text-[#edc22e]" />
          </a>
          <a href="#" className="p-2 bg-[var(--card)] rounded-full hover:bg-[var(--border)] transition">
            <Twitter size={20} className="text-[#1da1f2]" />
          </a>
        </div>
        <Web3Connect />
      </div>

      <GameHeader 
        score={board.score} 
        bestScore={bestScore} 
        onUndo={undo} 
        canUndo={canUndo} 
        onReset={reset} 
      />

      <div className="relative mb-8 mt-4">
        <Board tiles={board.tiles} />
        
        <AnimatePresence>
          {board.gameOver && !board.won && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-black/70 flex flex-col items-center justify-center rounded-xl backdrop-blur-sm"
            >
              <h2 className="text-4xl font-black text-white mb-2">Game Over!</h2>
              <p className="text-gray-300 mb-6 font-mono text-sm">Score: {board.score}</p>
              <button 
                onClick={reset}
                className="px-6 py-3 bg-[var(--color-base-blue)] text-white rounded-full font-bold shadow-lg glow-base"
              >
                Try Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="w-full max-w-[400px] pt-8 border-t border-[var(--border)] flex flex-col items-center gap-6">
        <p className="text-center text-sm font-mono text-gray-400">
          Built for <span className="text-[var(--color-base-blue)] font-bold">Base</span> Mainnet.
        </p>
        
        {isConnected && (
          <div className="flex flex-col items-center">
            <button 
              onClick={sendGMTransaction}
              disabled={isPending}
              className="px-3 py-2 rounded-lg bg-[#E8A020]/20 hover:bg-[#E8A020]/30 border border-[#E8A020]/40 text-[#E8A020] transition-colors flex items-center gap-2 font-['Cinzel'] text-xs font-bold"
            >
              <Sun size={16} />
              {isPending ? 'Sending...' : 'Say GM'}
            </button>
            {txStatus && <span className="text-xs text-gray-400 mt-2">{txStatus}</span>}
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Web3Provider>
      <GameContent />
    </Web3Provider>
  );
}

