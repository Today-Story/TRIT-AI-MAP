import { useState } from "react";
import { IoFilter, IoChevronDown } from "react-icons/io5"; // 필터 아이콘, 드롭다운 아이콘

interface CategoryFilterProps {
    selectedCategory: string | null;
    onSelectCategory: (category: string | null) => void;
}

const categories = ["ALL", "TRAVEL", "SHOPPING", "FOOD", "BEAUTY"];

const CategoryFilter = ({ selectedCategory, onSelectCategory }: CategoryFilterProps) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="absolute bottom-16 right-4 z-50 flex items-center gap-2">
            {/* 🔘 필터 버튼 */}
            <div className="relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="bg-[#EEFDFF] text-[#027FFF] shadow-md rounded-full px-4 py-2 flex items-center gap-2 font-semibold border border-[#027FFF]"
                >
                    {selectedCategory || "PLAY"}
                    <IoChevronDown className="text-lg" />
                </button>

                {/* 🏷️ 드롭다운 필터 목록 (위쪽으로 생성) */}
                {isOpen && (
                    <div className="absolute bottom-full mb-2 w-full bg-white shadow-lg rounded-lg overflow-hidden border border-gray-300">
                        {categories.map((category) => (
                            <button
                                key={category}
                                className={`w-full text-left px-4 py-2 hover:bg-[#EEFDFF] transition-all ${selectedCategory === category ? "bg-[#027FFF] text-white" : "text-[#027FFF]"
                                    }`}
                                onClick={() => {
                                    onSelectCategory(category === "ALL" ? null : category);
                                    setIsOpen(false);
                                }}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* 🎛️ 필터 아이콘 버튼 */}
            <button className="bg-[#EEFDFF] text-[#027FFF] shadow-md rounded-full p-3 border border-[#027FFF]">
                <IoFilter className="text-lg" />
            </button>
        </div>
    );
};

export default CategoryFilter;
