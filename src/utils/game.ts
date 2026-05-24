// src/utils/game.ts
// Утилиты игровой логики

export const SIZE = 9;

export function getRandomCell(): number {
  return Math.floor(Math.random() * SIZE);
}

export function generateSequence(prev: number[]): number[] {
  return [...prev, getRandomCell()];
}

export function checkInput(sequence: number[], input: number[]): boolean {
  for (let i = 0; i < input.length; i++) {
    if (sequence[i] !== input[i]) return false;
  }
  return true;
}

export function saveRecord(score: number): void {
  const prev = getRecord();
  if (score > prev) {
    localStorage.setItem('maxScore', String(score));
  }
}

export function getRecord(): number {
  return Number(localStorage.getItem('maxScore')) || 0;
}

export function saveHistory(history: number[]): void {
  localStorage.setItem('history', JSON.stringify(history));
}

export function loadHistory(): number[] {
  try {
    return JSON.parse(localStorage.getItem('history') || '[]');
  } catch {
    return [];
  }
}

export function clearHistory(): void {
  localStorage.removeItem('history');
  localStorage.removeItem('maxScore');
}
