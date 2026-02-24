"use client";

interface RoundCardProps {
  scran: {
    id: number;
    imageUrl: string;
    name: string;
    description: string | null;
    price: number;
  };
  onVote: () => void;
  isVoting: boolean;
  position: "left" | "right";
}

export function RoundCard({ scran, onVote, isVoting, position }: RoundCardProps) {
  const borderClass = position === "left" 
    ? "border-b-4 border-black md:border-b-0 md:border-r-4" 
    : "";

  return (
    <button
      onClick={onVote}
      disabled={isVoting}
      className={`group relative h-1/2 w-full overflow-hidden ${borderClass} disabled:cursor-default md:h-full md:w-1/2`}
    >
      <img
        src={scran.imageUrl}
        alt={scran.name}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
        <h2 className="pixel-text mb-1 text-lg font-bold text-white sm:text-xl">
          {scran.name}
        </h2>
        {scran.description && (
          <p className="pixel-text mb-2 line-clamp-2 text-xs text-zinc-300 sm:text-sm">
            {scran.description}
          </p>
        )}
        <p className="pixel-text text-sm font-semibold text-white sm:text-base">
          {scran.price.toFixed(2)} ₽
        </p>
      </div>
    </button>
  );
}
