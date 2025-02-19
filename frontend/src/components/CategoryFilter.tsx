import React from "react";

type CategoryFilterProps = {
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
};

const CategoryFilter: React.FC<CategoryFilterProps> = ({ selectedCategory, onSelectCategory }) => {
  // 예: 4개 필터
  const filters = ["AI 추천", "AI 내 주변", "AI 크리에이터 추천", "맛집 추천"];

  return (
    <div className="bg-white rounded-full px-2 py-1 flex justify-center space-x-2 border border-gray-300 shadow">
      {filters.map((f) => (
        <button
          key={f}
          className={`text-xs font-semibold px-3 py-1 rounded-full ${
            selectedCategory === f.toUpperCase()
              ? "bg-blue-500 text-white"
              : "bg-blue-100 text-blue-600"
          }`}
          onClick={() =>
            onSelectCategory(selectedCategory === f.toUpperCase() ? null : f.toUpperCase())
          }
        >
          {f}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
