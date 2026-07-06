import type { ConfettiPiece } from "../../../hooks/useConfetti";

interface Props {
  pieces: ConfettiPiece[];
}

// Purely decorative: renders whatever burst useConfetti currently holds.
export default function ConfettiLayer({ pieces }: Props) {
  if (pieces.length === 0) return null;

  return (
    <div className="confetti-layer" aria-hidden="true">
      {pieces.map((piece) => (
        <span
          key={piece.id}
          className="confetti-piece"
          style={{
            left: `${piece.left}vw`,
            backgroundColor: piece.color,
            animationDuration: `${piece.duration}s`,
            animationDelay: `${piece.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
