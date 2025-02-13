import { useRef } from "react";
import { FiSearch } from "react-icons/fi"; // 🔍 검색 아이콘
import { IoArrowBack, IoLocate } from "react-icons/io5"; // ⬅️ 뒤로가기, 📍 내 위치

interface SearchBarProps {
    searchTerm: string;
    onSearchChange: (term: string) => void;
    selectedFilter: string;
    onFilterSelect: (filter: string) => void;
    onBack: () => void;
    onLocate: () => void;
}

const SearchBar = ({ searchTerm, onSearchChange, selectedFilter, onFilterSelect, onBack, onLocate }: SearchBarProps) => {
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const isDragging = useRef(false);
    const startX = useRef(0);
    const scrollLeft = useRef(0);

    // ✅ 드래그 시작
    const handleMouseDown = (e: React.MouseEvent) => {
        if (!scrollRef.current) return;
        isDragging.current = true;
        startX.current = e.pageX - scrollRef.current.offsetLeft;
        scrollLeft.current = scrollRef.current.scrollLeft;
    };

    // ✅ 드래그 이동
    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging.current || !scrollRef.current) return;
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX.current) * 1.5; // 스크롤 속도 조정
        scrollRef.current.scrollLeft = scrollLeft.current - walk;
    };

    // ✅ 드래그 종료
    const handleMouseUp = () => {
        isDragging.current = false;
    };

    return (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-11/12 flex flex-col gap-2 z-10">
            {/* 🔍 검색 바 UI */}
            <div className="relative flex items-center bg-[#EEFDFF] shadow-md rounded-full px-4 py-2 border border-[#027FFF]">
                <IoArrowBack className="text-[#027FFF] text-xl mr-3 cursor-pointer" onClick={onBack} /> {/* 뒤로가기 */}
                <FiSearch className="text-[#027FFF] text-lg mr-2" />
                <input
                    type="text"
                    placeholder="Search"
                    className="flex-1 outline-none text-[#027FFF] placeholder-[#027FFF] bg-transparent"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
                <IoLocate className="text-[#027FFF] text-xl cursor-pointer" onClick={onLocate} /> {/* 내 위치 이동 */}
            </div>

            {/* 🏷️ 필터 태그 버튼 (드래그 가능) */}
            <div
                className="flex overflow-x-auto space-x-2 scrollbar-hide cursor-pointer select-none"
                ref={scrollRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                {["AI 추천", "AI 내 주변", "AI 크리에이터 추천", "맛집 추천"].map((text) => (
                    <button
                        key={text}
                        className={`min-w-fit px-4 py-1 rounded-full text-sm font-semibold transition-all ${selectedFilter === text
                            ? "bg-[#027FFF] text-white"
                            : "bg-[#EEFDFF] border border-[#027FFF] text-[#027FFF]"
                            }`}
                        onClick={() => onFilterSelect(text)}
                    >
                        {text}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default SearchBar;
