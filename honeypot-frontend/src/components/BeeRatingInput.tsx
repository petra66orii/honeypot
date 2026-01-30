import React, { useState } from "react";

interface BeeRatingInputProps {
  rating: number;
  setRating: (rating: number) => void;
  label?: string;
}

const BeeRatingInput: React.FC<BeeRatingInputProps> = ({
  rating,
  setRating,
  label,
}) => {
  const [hover, setHover] = useState<number>(0);

  return (
    <div className="flex flex-col gap-2">
      {label && <span className="font-medium text-gray-700">{label}</span>}

      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((index) => {
          const isActive = index <= (hover || rating);

          return (
            <button
              key={index}
              type="button"
              className={`text-2xl transition-transform hover:scale-110 focus:outline-none ${
                isActive ? "grayscale-0" : "grayscale opacity-30"
              }`}
              onClick={() => setRating(index)}
              onMouseEnter={() => setHover(index)}
              onMouseLeave={() => setHover(0)}
            >
              🐝
            </button>
          );
        })}
        <span className="ml-3 text-sm text-gray-400">
          {rating > 0 ? `${rating} / 5 Bees` : "Rate this honey"}
        </span>
      </div>
    </div>
  );
};

export default BeeRatingInput;
