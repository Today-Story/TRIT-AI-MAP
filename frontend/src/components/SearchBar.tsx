import { FiSearch } from "react-icons/fi"; // 🔍 검색 아이콘
import { IoSettingsOutline } from "react-icons/io5"; // ⚙️ 설정 아이콘
import { useState } from "react";

const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const filters = ["AI 추천", "AI 내 주변", "AI 크리에이터 추천", "맛집 추천", "여행 추천"];

    return (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-11/12 z-10">
            {/* 🔍 검색 바 */}
            <div className="flex items-center bg-white shadow-md rounded-full px-4 py-2 border border-blue-400">
                <FiSearch className="text-blue-500 text-lg mr-2" />
                <input
                    type="text"
                    placeholder="Search"
                    className="flex-1 outline-none text-gray-800 placeholder-gray-500 bg-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <IoSettingsOutline className="text-blue-500 text-lg" />
            </div>

            {/* 🏷️ 필터 태그 버튼 */}
            <div className="flex overflow-x-auto mt-2 space-x-2 scrollbar-hide">
                {filters.map((filter, index) => (
                    <button
                        key={index}
                        className={`whitespace-nowrap px-4 py-1 rounded-full text-sm font-semibold ${index === 0
                            ? "bg-blue-600 text-white"
                            : "border border-yellow-400 text-yellow-500 bg-white"
                            }`}
                    >
                        {filter}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default SearchBar;
