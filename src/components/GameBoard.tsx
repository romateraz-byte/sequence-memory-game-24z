// src/components/GameBoard.tsx
import React from 'react';

interface GameBoardProps {
  size: number;
  activeCell: number | null;
  hitCell: number | null;
  missCell: number | null;
  isUserTurn: boolean;
  onCellClick: (index: number) => void;
}

const GameBoard: React.FC<GameBoardProps> = ({
  size,
  activeCell,
  hitCell,
  missCell,
  isUserTurn,
  onCellClick,
}) => {
  return (
    <div className="grid">
      {Array.from({ length: size }).map((_, i) => {
        const isFlash = activeCell === i;
        const isHit   = hitCell === i;
        const isMiss  = missCell === i;
        const cls = [
          'cell',
          isFlash ? 'flash' : '',
          isHit   ? 'hit'   : '',
          isMiss  ? 'miss'  : '',
        ].filter(Boolean).join(' ');

        return (
          <button
            key={i}
            className={cls}
            onClick={() => onCellClick(i)}
            disabled={!isUserTurn || isFlash}
            aria-label={`Ячейка ${i + 1}`}
          >
            {i + 1}
          </button>
        );
      })}
    </div>
  );
};

export default GameBoard;
