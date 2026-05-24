// src/tests/game.test.ts
import { describe, test, expect } from '@jest/globals';
import {
  SIZE,
  getRandomCell,
  generateSequence,
  checkInput,
} from '../utils/game';

describe('Логика генерации последовательности', () => {
  test('Случайное число находится в диапазоне [0, SIZE)', () => {
    for (let i = 0; i < 100; i++) {
      const value = getRandomCell();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(SIZE);
    }
  });

  test('generateSequence увеличивает длину на 1', () => {
    const initial = [0, 2, 5];
    const next = generateSequence(initial);
    expect(next.length).toBe(initial.length + 1);
    expect(next.slice(0, initial.length)).toEqual(initial);
  });

  test('generateSequence не мутирует оригинальный массив', () => {
    const initial = [1, 3];
    const copy = [...initial];
    generateSequence(initial);
    expect(initial).toEqual(copy);
  });
});

describe('Проверка ввода пользователя', () => {
  test('Верный ввод возвращает true', () => {
    const seq = [1, 4, 7, 2];
    expect(checkInput(seq, [1])).toBe(true);
    expect(checkInput(seq, [1, 4])).toBe(true);
    expect(checkInput(seq, [1, 4, 7, 2])).toBe(true);
  });

  test('Неверный ввод возвращает false', () => {
    const seq = [1, 4, 7, 2];
    expect(checkInput(seq, [0])).toBe(false);
    expect(checkInput(seq, [1, 3])).toBe(false);
    expect(checkInput(seq, [1, 4, 7, 5])).toBe(false);
  });

  test('Пустой ввод всегда возвращает true', () => {
    expect(checkInput([1, 2, 3], [])).toBe(true);
  });
});

describe('Константы', () => {
  test('SIZE равен 9', () => {
    expect(SIZE).toBe(9);
  });
});
