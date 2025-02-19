import { useState } from "react";

import { cn } from "@utils/cn";

import { MdGpsFixed, MdOutlineKeyboardArrowLeft, MdOutlineSearch } from "react-icons/md";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
  onBack: () => void;
  onLocate: () => void;
}

const CATEGORIES = ["AI 추천", "AI 내 주변", "AI 크리에이터 추천", "맛집 추천"];

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
  onSearch,
  onBack,
  onLocate,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>("AI 추천");

  return (
    <header className="fixed z-10 px-5 top-2.5 flex flex-col gap-3 max-w-mobile w-full">
      <div className="flex items-center gap-2 flex-1 justify-between">
        <button
          onClick={onBack}
          className="p-2 bg-primary-100 border border-primary-200 rounded-full shadow-md shadow-primary-200"
        >
          <MdOutlineKeyboardArrowLeft color="#007FFF" size={24} />
        </button>
        <div className="flex-1 flex items-center justify-between gap-2 bg-primary-100 border border-primary-200 rounded-full py-2 px-5 shadow-md shadow-primary-200">
          <input
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search"
            className="bg-primary-100 outline-none placeholder:text-placeholder w-36 mobile:w-full"
          />
          <button onClick={onSearch}>
            <MdOutlineSearch color="#007FFF" size={24} />
          </button>
        </div>
        <button
          onClick={onLocate}
          className="p-2 bg-primary-100 border border-primary-200 rounded-full shadow-md shadow-primary-200"
        >
          <MdGpsFixed color="#007FFF" size={24} />
        </button>
      </div>
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 min-w-max">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedFilter(category)}
              className={cn(
                "relative outline-none font-bold py-2 px-4 text-sm whitespace-nowrap gradient-button",
                selectedFilter === category
                  ? "bg-primary-300 text-primary-100"
                  : "bg-primary-100 text-primary-300"
              )}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};

export default SearchBar;
