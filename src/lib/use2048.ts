import { useState, useEffect, useCallback } from 'react';
import { BoardState, createInitialBoard, slideTiles, Direction } from './gameLogic';
import { useLocalStorage } from 'usehooks-ts';

export const use2048 = () => {
  const [board, setBoard] = useState<BoardState>(createInitialBoard());
  const [bestScore, setBestScore] = useLocalStorage('base-2048-best-score', 0);
  const [history, setHistory] = useState<BoardState[]>([]);

  // Update best score
  useEffect(() => {
    if (board.score > bestScore) {
      setBestScore(board.score);
    }
  }, [board.score, bestScore, setBestScore]);

  const move = useCallback((direction: Direction) => {
    if (board.gameOver) return;

    const nextBoard = slideTiles(board, direction);
    if (nextBoard !== board) {
      setHistory(prev => {
        const newHist = [...prev, board];
        return newHist.slice(-5); // Keep last 5 moves for undo
      });
      setBoard(nextBoard);
    }
  }, [board]);

  const undo = () => {
    if (history.length > 0) {
      setBoard(history[history.length - 1]);
      setHistory(prev => prev.slice(0, -1));
    }
  };

  const reset = () => {
    setBoard(createInitialBoard());
    setHistory([]);
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      console.log('e.key', e.key)
      switch (e.key) {
        case 'ArrowUp': e.preventDefault(); move('up'); break;
        case 'ArrowDown': e.preventDefault(); move('down'); break;
        case 'ArrowLeft': e.preventDefault(); move('left'); break;
        case 'ArrowRight': e.preventDefault(); move('right'); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [move]);

  // Touch swipe controls
  useEffect(() => {
    let touchStartX = 0;
    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      // e.preventDefault(); // Don't prevent default here to allow clicking buttons
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if(e.changedTouches.length === 0) return;
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      
      const dx = touchEndX - touchStartX;
      const dy = touchEndY - touchStartY;
      
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);

      // Min swipe distance 30px
      if (Math.max(absDx, absDy) > 30) {
        if (absDx > absDy) {
          dx > 0 ? move('right') : move('left');
        } else {
          dy > 0 ? move('down') : move('up');
        }
      }
    };

    // adding passive false so we can preventDefault scrolling on the board area itself ideally
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: false });
    
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [move]);

  return { board, bestScore, move, undo, reset, canUndo: history.length > 0 };
};
