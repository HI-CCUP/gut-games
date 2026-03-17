import React from 'react';

const RatingDisplay = ({ avg, count }) => {
  // Generujemy tablicę 5 elementów, żeby wyświetlić gwiazdki
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex items-center gap-2 my-2">
      <div className="flex text-yellow-400">
        {stars.map((star) => (
          <span key={star} className="text-xl">
            {/* Wyświetlamy pełną gwiazdkę, jeśli średnia jest >= numerowi gwiazdki */}
            {avg >= star ? '★' : '☆'}
          </span>
        ))}
      </div>
      
      <span className="font-bold text-gray-700">{avg || "0.0"}</span>
      <span className="text-sm text-gray-500">({count || 0} ocen)</span>
    </div>
  );
};

export default RatingDisplay;