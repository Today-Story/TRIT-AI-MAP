import { useRef } from "react";
import ContentCard from "./ContentCard";

interface CardDrawerProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    contents: any[];
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

const CardDrawer = ({ contents, isOpen, onOpen, onClose }: CardDrawerProps) => {
    const drawerRef = useRef<HTMLDivElement | null>(null);

    return (
        <div
            ref={drawerRef}
            className={`absolute bottom-4 left-0 w-full bg-transparent transition-transform duration-300 ${isOpen ? "translate-y-[50px]" : "translate-y-[50px]"
                }`}
        >
            {/* 📌 튀어나온 부분 (클릭 시 카드 전체 표시) */}
            <div className="w-full flex justify-center py-10 cursor-pointer bg-[#EEFDFF] rounded-t-3xl" onClick={onOpen}>
                <div className="w-14 h-2 bg-gray-400 rounded-full"></div>
            </div>

            {/* 📌 선택된 콘텐츠가 있을 경우 1개만, 없으면 50개 */}
            {isOpen && <ContentCard contents={contents} onClose={onClose} />}
        </div>
    );
};

export default CardDrawer;
