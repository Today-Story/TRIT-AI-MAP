import React, { useRef } from "react";
import { ContentData } from "./GoogleMapComponent";

type ContentDetailProps = {
  content: ContentData;
  onClose: () => void; // detail -> summary
};

const ContentDetail: React.FC<ContentDetailProps> = ({ content, onClose }) => {
  // 각 섹션 레퍼런스
  const homeRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLDivElement | null>(null);
  const productRef = useRef<HTMLDivElement | null>(null);
  const bookRef = useRef<HTMLDivElement | null>(null);
  const brandRef = useRef<HTMLDivElement | null>(null);

  // 스크롤 함수
  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // 첫 번째 주소만
  const locationStr = content.location ? content.location.split(",")[0] : "위치 정보 없음";

  // 비디오가 있으면 임베드, 없으면 박스
  const renderVideo = () => {
    if (content.url) {
      return (
        <iframe
          src={content.url}
          title="Video"
          className="w-full h-32 rounded"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
        />
      );
    }
    return (
      <div className="w-full h-32 bg-gray-300 flex items-center justify-center rounded">
        No Video
      </div>
    );
  };

  return (
    <div className="w-full h-full px-4 py-2 text-black">
      {/* 상단 헤더 */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex space-x-2">
          <button className="bg-blue-500 text-white px-3 py-1 rounded-md text-xs">Departure</button>
          <button className="bg-blue-500 text-white px-3 py-1 rounded-md text-xs">Arrival</button>
          <button className="bg-blue-500 text-white px-3 py-1 rounded-md text-xs">
            AI 경로 저장
          </button>
        </div>
        <button className="text-gray-500 text-xs" onClick={onClose}>
          닫기
        </button>
      </div>

      {/* 탭: Home / Video / Product / Book / Brand */}
      <div className="flex items-center space-x-2 mb-2">
        <button
          className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded"
          onClick={() => scrollToSection(homeRef)}
        >
          Home
        </button>
        <button
          className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded"
          onClick={() => scrollToSection(videoRef)}
        >
          Video
        </button>
        <button
          className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded"
          onClick={() => scrollToSection(productRef)}
        >
          Product
        </button>
        <button
          className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded"
          onClick={() => scrollToSection(bookRef)}
        >
          Book
        </button>
        <button
          className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded"
          onClick={() => scrollToSection(brandRef)}
        >
          Brand
        </button>
      </div>

      {/* HOME 영역 */}
      <div ref={homeRef} className="mb-4">
        <h1 className="text-md font-bold mb-1">{content.title}</h1>
        <p className="text-sm text-gray-700 mb-1">{locationStr}</p>
        <p className="text-xs text-gray-500 mb-2">트윗 리뷰 20개 · 구글 리뷰 10개</p>
      </div>

      {/* TRIT COUPON */}
      <div className="mb-4">
        <h2 className="text-md font-bold mb-2">TRIT COUPON</h2>
        <div className="bg-blue-50 p-3 rounded-md flex justify-between items-center">
          <span className="text-sm font-semibold">20% OFF COUPON</span>
          <button className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm">
            GET COUPON
          </button>
        </div>
      </div>

      {/* BRAND MATCH (brandRef로 이동) */}
      <div ref={brandRef} className="mb-4">
        <h2 className="text-md font-bold mb-2">BRAND MATCH</h2>
        <div className="bg-blue-50 p-3 rounded-md">
          <p className="text-sm">연관 브랜드 정보 예시</p>
        </div>
      </div>

      {/* VIDEO (videoRef로 이동) */}
      <div ref={videoRef} className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-md font-bold">VIDEO</h2>
          <button className="text-blue-500 text-sm">VIEW MORE</button>
        </div>
        {renderVideo()}
      </div>

      {/* PRODUCT (productRef로 이동) */}
      <div ref={productRef} className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-md font-bold">PRODUCT</h2>
          <button className="text-blue-500 text-sm">VIEW MORE</button>
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="min-w-[100px] bg-blue-50 rounded-md p-2 flex flex-col items-center"
            >
              <div className="bg-gray-300 w-14 h-14 mb-1" />
              <div className="text-xs font-semibold">Prod {i + 1}</div>
              <div className="text-xs">$99.00</div>
            </div>
          ))}
        </div>
      </div>

      {/* RESERVATION (bookRef로 이동) */}
      <div ref={bookRef} className="mb-4">
        <h2 className="text-md font-bold mb-2">RESERVATION</h2>
        <div className="bg-blue-50 p-3 rounded-md flex justify-between items-center mb-2">
          <span className="text-sm">피부 관찰 시스템</span>
          <button className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm">BOOK</button>
        </div>
        <div className="bg-blue-50 p-3 rounded-md flex justify-between items-center">
          <span className="text-sm">피부 관찰 시술</span>
          <button className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm">BOOK</button>
        </div>
      </div>
    </div>
  );
};

export default ContentDetail;
