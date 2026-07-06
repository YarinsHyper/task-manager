import { useState } from "react";

export interface ConfettiPiece {
  id: number;
  left: number;
  color: string;
  duration: number;
  delay: number;
}

const COLORS = ["#4f46e5", "#22c55e", "#f59e0b", "#ef4444", "#06b6d4", "#ec4899"];
const PIECE_COUNT = 40;
const CLEANUP_MS = 3000;

let nextId = 0;

// Fires a one-off burst of confetti pieces, auto-removing them once their
// fall animation finishes so the DOM doesn't accumulate stale nodes.
export function useConfetti() {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  const fire = () => {
    const burst: ConfettiPiece[] = Array.from({ length: PIECE_COUNT }, () => ({
      id: nextId++,
      left: Math.random() * 100,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      duration: 2 + Math.random() * 1.5,
      delay: Math.random() * 0.3
    }));

    setPieces((prev) => [...prev, ...burst]);

    const burstIds = new Set(burst.map((piece) => piece.id));
    setTimeout(() => {
      setPieces((prev) => prev.filter((piece) => !burstIds.has(piece.id)));
    }, CLEANUP_MS);
  };

  return { pieces, fire };
}
