import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatTimeUntilMidnightUTC(): string {
  const now = new Date();
  const tomorrowUTC = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + 1,
    0, 0, 0
  ));
  
  const diff = tomorrowUTC.getTime() - now.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export function getLikesPercentage(likes: number, dislikes: number): number {
  const total = likes + dislikes;
  if (total === 0) return 50;
  return Math.round((likes / total) * 100);
}

export function calculateScore(answers: { isCorrect: boolean }[]): number {
  return answers.filter(a => a.isCorrect).length;
}

export function formatShareText(answers: { isCorrect: boolean }[], score: number): string {
  const circles = answers.map((answer) => (answer.isCorrect ? '🟢' : '🔴')).join('');
  return `${circles} - ${score}/10\nhttps://bebebendle.ru`;
}
