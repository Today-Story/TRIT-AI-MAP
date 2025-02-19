import React from "react";

type SearchBarProps = {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedFilter: string;
  onFilterSelect: (value: string) => void;
  onBack: () => void;
  onLocate: () => void;
};

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
  selectedFilter,
  onFilterSelect,
  onBack,
  onLocate,
}) => {
  return (
    <div className="flex items-center space-x-2 p-2 bg-white border-b border-gray-200">
      <button onClick={onBack} className="text-blue-500 font-bold text-sm">
        ◀
      </button>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search"
        className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
      />
      <button
        onClick={() => onFilterSelect("AI 추천")}
        className={`text-sm px-2 py-1 rounded-md ${
          selectedFilter === "AI 추천" ? "bg-blue-500 text-white" : "bg-gray-200"
        }`}
      >
        AI 추천
      </button>
      <button onClick={onLocate} className="text-blue-500 text-sm">
        내위치
      </button>
    </div>
  );
};

export default SearchBar;
