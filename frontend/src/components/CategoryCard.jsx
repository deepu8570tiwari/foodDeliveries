import React from 'react';

function CategoryCard({name,image, onClick}) {
  return (
    <div onClick={onClick} className="relative w-[140px] h-[140px] md:w-[200px] md:h-[200px] rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-300 shrink-0">
      <img
        src={image}
        alt={name}
        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
      />

      {/* Gradient overlay */}
      <div className="absolute bottom-0 left-0 w-full bg-linear-to-t from-black/60 to-transparent p-3">
        <p className="text-white text-sm md:text-base font-semibold drop-shadow">
          {name}
        </p>
      </div>
    </div>
  );
}

export default CategoryCard;
