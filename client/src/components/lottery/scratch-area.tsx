import { useState, useRef, useCallback } from 'react';
import { ScratchSymbol } from '@/types/lottery';

interface ScratchAreaProps {
  symbol: ScratchSymbol;
  onReveal: (symbolId: string) => void;
  disabled?: boolean;
}

export default function ScratchArea({ symbol, onReveal, disabled = false }: ScratchAreaProps) {
  const [isScratching, setIsScratching] = useState(false);
  const areaRef = useRef<HTMLDivElement>(null);
  
  const handleStart = useCallback(() => {
    if (disabled || symbol.revealed) return;
    setIsScratching(true);
  }, [disabled, symbol.revealed]);
  
  const handleEnd = useCallback(() => {
    setIsScratching(false);
    if (!symbol.revealed) {
      onReveal(symbol.id);
    }
  }, [symbol.revealed, symbol.id, onReveal]);
  
  const handleMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isScratching || disabled || symbol.revealed) return;
    
    e.preventDefault();
    // For demo purposes, we'll reveal after any movement
    // In a real implementation, you'd track scratch percentage
  }, [isScratching, disabled, symbol.revealed]);
  
  return (
    <div
      ref={areaRef}
      className={`aspect-square rounded-lg relative cursor-pointer select-none overflow-hidden ${
        symbol.revealed ? 'bg-transparent' : 'scratch-area bg-gray-300'
      }`}
      onMouseDown={handleStart}
      onMouseUp={handleEnd}
      onMouseMove={handleMove}
      onMouseLeave={handleEnd}
      onTouchStart={handleStart}
      onTouchEnd={handleEnd}
      onTouchMove={handleMove}
    >
      <div
        className={`absolute inset-0 flex items-center justify-center text-4xl transition-opacity duration-300 ${
          symbol.revealed ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {symbol.symbol}
      </div>
      
      {!symbol.revealed && (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-600 font-medium">
          긁기
        </div>
      )}
    </div>
  );
}
