import React from "react";

// ✅ ContentData 타입 정의
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
  content: ContentData;
  onClose: () => void;
};

const ContentCard: React.FC<ContentCardProps> = ({ content, onClose }) => {
  return (
    <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-white shadow-lg p-4 rounded-lg w-80">
      <h2 className="text-xl font-bold">{content.title}</h2>
      <p className="text-gray-600">작성자: {content.author}</p>

      {/* ✅ 유튜브 영상 embed */}
      <iframe
        width="100%"
        height="200"
        src={content.url}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>

      {/* 🔗 지도 링크 (location이 null일 경우 예외 처리) */}
      {content.location ? (
        <a href={content.location} target="_blank" className="block mt-2 text-blue-500">
          위치 확인하기
        </a>
      ) : (
        <p className="text-gray-500 mt-2">위치 정보 없음</p>
      )}

      <button className="mt-4 w-full bg-red-500 text-white py-2 rounded" onClick={onClose}>
        닫기
      </button>
    </div>
  );
};

export default ContentCard;
