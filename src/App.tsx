// src/App.tsx
import React, { useState, useCallback } from 'react';
import './styles.css';
import GameBoard from './components/GameBoard';
import {
  SIZE,
  getRandomCell,
  checkInput,
  saveRecord,
  getRecord,
  saveHistory,
  loadHistory,
  clearHistory,
} from './utils/game';

type GameState = 'idle' | 'watching' | 'your-turn' | 'success' | 'game-over';

interface OverlayData {
  score: number;
  isRecord: boolean;
  prevRecord: number;
}

export default function App() {
  const [sequence, setSequence]     = useState<number[]>([]);
  const [userInput, setUserInput]   = useState<number[]>([]);
  const [activeCell, setActiveCell] = useState<number | null>(null);
  const [hitCell, setHitCell]       = useState<number | null>(null);
  const [missCell, setMissCell]     = useState<number | null>(null);
  const [level, setLevel]           = useState(0);
  const [gameState, setGameState]   = useState<GameState>('idle');
  const [maxScore, setMaxScore]     = useState(getRecord);
  const [history, setHistory]       = useState<number[]>(loadHistory);
  const [overlay, setOverlay]       = useState<OverlayData | null>(null);

  const statusMessages: Record<GameState, string> = {
    idle:       '— нажмите СТАРТ для начала —',
    watching:   '◈  запоминайте последовательность',
    'your-turn':'▶  ваш ход — повторите',
    success:    '✓  верно! переход на следующий уровень',
    'game-over':'✗  игра окончена',
  };

  const showSequence = useCallback(async (seq: number[]) => {
    setGameState('watching');
    setUserInput([]);

    // Brief pause before showing
    await new Promise(r => setTimeout(r, 400));

    for (const cell of seq) {
      setActiveCell(cell);
      await new Promise(r => setTimeout(r, 550));
      setActiveCell(null);
      await new Promise(r => setTimeout(r, 230));
    }

    setGameState('your-turn');
  }, []);

  const startGame = useCallback(async () => {
    setOverlay(null);
    const first = [getRandomCell()];
    setSequence(first);
    setLevel(1);
    setHitCell(null);
    setMissCell(null);
    await showSequence(first);
  }, [showSequence]);

  const nextLevel = useCallback(async (seq: number[]) => {
    setGameState('success');
    await new Promise(r => setTimeout(r, 600));
    const next = [...seq, getRandomCell()];
    setSequence(next);
    setLevel(next.length);
    setHitCell(null);
    setMissCell(null);
    await showSequence(next);
  }, [showSequence]);

  const endGame = useCallback((currentLevel: number) => {
    const score = currentLevel - 1;
    const prevRecord = getRecord();
    const isRecord = score > prevRecord;

    const newHistory = [...history, score];
    setHistory(newHistory);
    saveHistory(newHistory);

    if (isRecord) {
      saveRecord(score);
      setMaxScore(score);
    }

    setGameState('game-over');
    setOverlay({ score, isRecord, prevRecord });
  }, [history]);

  const onCellClick = useCallback((index: number) => {
    if (gameState !== 'your-turn') return;

    const newInput = [...userInput, index];
    setUserInput(newInput);

    const pos = newInput.length - 1;
    if (sequence[pos] !== index) {
      // Wrong cell
      setMissCell(index);
      setTimeout(() => setMissCell(null), 500);
      endGame(level);
      return;
    }

    // Correct cell
    setHitCell(index);
    setTimeout(() => setHitCell(null), 300);

    if (newInput.length === sequence.length) {
      nextLevel(sequence);
    }
  }, [gameState, userInput, sequence, level, nextLevel, endGame]);

  const handleClearHistory = () => {
    clearHistory();
    setHistory([]);
    setMaxScore(0);
  };

  const isPlaying = gameState !== 'idle' && gameState !== 'game-over';
  const progressDone = userInput.length;

  return (
    <div className="app">
      {/* HEADER */}
      <header className="header">
        <h1>
          <span>Курсовая работа · ООП · 2026</span>
          Запоминание последовательностей
        </h1>
      </header>

      {/* STATS */}
      <div className="stats">
        <div className={`stat-card ${gameState === 'your-turn' ? 'highlight' : ''}`}>
          <div className="stat-label">Уровень</div>
          <div className="stat-value">{level || '—'}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Длина</div>
          <div className="stat-value">{sequence.length || '—'}</div>
        </div>
        <div className="stat-card record">
          <div className="stat-label">Рекорд</div>
          <div className="stat-value">{maxScore}</div>
        </div>
      </div>

      {/* STATUS BAR */}
      <div className={`status-bar ${gameState}`}>
        {statusMessages[gameState]}
      </div>

      {/* GRID */}
      <div className="grid-wrapper">
        <GameBoard
          size={SIZE}
          activeCell={activeCell}
          hitCell={hitCell}
          missCell={missCell}
          isUserTurn={gameState === 'your-turn'}
          onCellClick={onCellClick}
        />

        {/* Progress dots */}
        {isPlaying && gameState === 'your-turn' && sequence.length > 0 && (
          <div className="progress-dots">
            {sequence.map((_, i) => (
              <div
                key={i}
                className={`dot ${i < progressDone ? 'done' : i === progressDone ? 'current' : ''}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* CONTROLS */}
      <div className="controls">
        <button
          className="btn btn-primary"
          onClick={startGame}
          disabled={isPlaying && gameState !== 'game-over'}
        >
          {level === 0 ? '▶  Старт' : '↺  Заново'}
        </button>
        {history.length > 0 && (
          <button className="btn btn-secondary" onClick={handleClearHistory}>
            Сбросить
          </button>
        )}
      </div>

      {/* HISTORY */}
      <div className="history-panel">
        <div className="history-header">История попыток</div>
        {history.length === 0 ? (
          <div className="history-empty">Нет сыгранных партий</div>
        ) : (
          <ul className="history-list">
            {[...history].reverse().map((score, idx) => {
              const num = history.length - idx;
              const isBest = score === maxScore && maxScore > 0;
              return (
                <li key={idx} className={`history-item ${isBest ? 'best' : ''}`}>
                  <span className="history-num">#{num}</span>
                  <span className="history-score">{score} уровн.</span>
                  {isBest && <span className="history-badge">РЕКОРД</span>}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* GAME OVER OVERLAY */}
      {overlay && (
        <div className="overlay" onClick={() => setOverlay(null)}>
          <div className="overlay-card" onClick={e => e.stopPropagation()}>
            <div className="overlay-title">Игра окончена</div>
            <div className={`overlay-score ${overlay.isRecord ? 'record' : ''}`}>
              {overlay.score}
            </div>
            <div className="overlay-sub">
              {overlay.isRecord
                ? <>🏆 Новый рекорд! <strong>+{overlay.score - overlay.prevRecord}</strong> к прошлому</>
                : <>Рекорд: <strong>{maxScore}</strong></>
              }
            </div>
            <div className="controls">
              <button className="btn btn-primary" onClick={startGame}>
                ▶  Играть снова
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
