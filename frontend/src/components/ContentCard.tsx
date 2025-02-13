import React, { useRef } from "react";

type ContentData = {
  id: number;
  postNumber: string;
  title: string;
  url: string;
  author: string;
  authorId: string;
  createdAt: string;
  views: number;
  likes: number;
  category: string;
  location: string | null;
  latitude: string | null;
  longitude: string | null;
};

type ContentCardProps = {
  contents: ContentData[];
  onClose: () => void;
};

const ContentCard: React.FC<ContentCardProps> = ({ contents, onClose }) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  // ✅ 마우스 드래그 시작
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    isDragging.current = true;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
  };

  // ✅ 마우스 드래그 이동
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5; // 스크롤 속도 조정
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  // ✅ 마우스 드래그 종료
  const handleMouseUp = () => {
    isDragging.current = false;
  };

  return (
    <div className="fixed bottom-0 left-0 w-full h-[350px] bg-white shadow-lg rounded-t-3xl p-4">
      {/* 📌 콘텐츠 가로 스크롤 */}
      <div ref={scrollRef} className="overflow-x-auto whitespace-nowrap scrollbar-hide flex gap-4 px-2 py-4 cursor-pointer select-none" onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
        {contents.map((content) => (
          <div key={content.id} className="min-w-[260px] bg-[#EEFDFF] shadow-md rounded-lg p-4">
            <h2 className="text-md font-bold text-[#027FFF]">{content.title}</h2>
            <p className="text-gray-500 text-sm">작성자: {content.author}</p>

            {/* ✅ 유튜브 영상 embed */}
            <iframe width="100%" height="150" src={content.url.replace("watch?v=", "embed/")} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope" allowFullScreen></iframe>

            {/* 🔗 지도 링크 */}
            {content.location ? (
              <a href={content.location} target="_blank" className="block mt-2 text-[#027FFF] text-sm font-semibold">
                위치 확인하기
              </a>
            ) : (
              <p className="text-gray-500 text-sm mt-2">위치 정보 없음</p>
            )}
          </div>
        ))}
      </div>

      {/* 닫기 버튼 */}
      <button className="mt-4 w-full bg-red-500 text-white py-2 rounded-lg" onClick={onClose}>
        닫기
      </button>
    </div>
  );
};

export default ContentCard;
