import React from "react";

interface BeeRatingProps {
  fullBees: number;
  hasHalfBee: boolean;
  averageRating: number;
}

const BeeRating: React.FC<BeeRatingProps> = ({
  fullBees,
  hasHalfBee,
  averageRating,
}) => {
  const emptyBees = 5 - fullBees - (hasHalfBee ? 1 : 0);

  return (
    <div className="flex items-center gap-1 text-lg leading-none">
      {/* Full Bees: Just the normal emoji */}
      {Array.from({ length: fullBees }).map((_, i) => (
        <span key={`full-${i}`}>🐝</span>
      ))}

      {/* Half Bee: We stack two bees on top of each other and clip the top one! */}
      {hasHalfBee && (
        <div className="relative inline-block w-[1em] overflow-hidden">
          {/* Background: Gray Bee */}
          <span className="absolute left-0 top-0 opacity-30 grayscale filter">
            🐝
          </span>
          {/* Foreground: Colored Bee (Clipped to 50%) */}
          <span className="absolute left-0 top-0 overflow-hidden w-[50%]">
            🐝
          </span>
          {/* Invisible spacer to keep the width correct */}
          <span className="invisible">🐝</span>
        </div>
      )}

      {/* Empty Bees: Grayed out using CSS filters */}
      {Array.from({ length: emptyBees }).map((_, i) => (
        <span key={`empty-${i}`} className="opacity-30 grayscale filter">
          🐝
        </span>
      ))}

      <span className="ml-2 text-sm text-gray-500 font-sans">
        ({averageRating})
      </span>
    </div>
  );
};

export default BeeRating;
