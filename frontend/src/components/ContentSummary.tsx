import React from "react";
import { ContentData } from "./GoogleMapComponent";

type ContentSummaryProps = {
  place: ContentData;
  onClick: () => void; // 디테일 모드로 이동
  onClose: () => void; // collapsed 모드로
};

const ContentSummary: React.FC<ContentSummaryProps> = ({
  place,
  onClick,
  onClose,
}) => {
  // 첫 번째 주소만 사용(쉼표 구분일 경우)
  const locationStr = place.location
    ? place.location.split(",")[0]
    : "위치 정보 없음";

  return (
    <div className="relative w-full h-full p-3 flex flex-row  bg-white rounded-md shadow">
      {/* 닫기 버튼 (오른쪽 상단) */}
      <button
        className="absolute top-2 right-2 text-sm text-gray-500"
        onClick={onClose}
      >
        X
      </button>

      {/* 왼쪽: 영상 박스(크기 확장) */}
      <div className="w-[130px] h-[200px] min-w-[130px] bg-[#027FFF] rounded-md flex items-center justify-center overflow-hidden mr-2">
        {place.url ? (
          <iframe
            src={place.url}
            title="Video"
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
          />
        ) : (
          <div className="text-xs text-white">No Video</div>
        )}
      </div>

      {/* 오른쪽 영역(영상 제외 클릭 시 onClick) */}
      <div className="flex-1 flex flex-col cursor-pointer" onClick={onClick}>
        {/* 타이틀 + 거리/혜택 */}
        <div className="flex justify-between items-start mb-0.5">
          {/* 긴 제목 줄바꿈/폭 제한 */}
          <h2 className="text-sm font-bold text-black break-words max-w-[140px] leading-4">
            {place.title}
          </h2>
          <span className="text-xs text-gray-600 ml-2 whitespace-nowrap">
            3.0km <span className="text-blue-500 ml-1">BENEFIT</span>
          </span>
        </div>

        {/* 주소 (줄바꿈/폭 제한) */}
        <p className="text-xs text-gray-700 mb-0.5 break-words max-w-[200px]">
          {locationStr}
        </p>

        {/* 리뷰 */}
        <p className="text-xs text-gray-500 mb-0.5">
          트윗 리뷰 20개 · 구글 리뷰 10개
        </p>

        {/* 평점 + 해시태그 */}
        <div className="flex items-center space-x-2 text-[10px]">
          <span className="text-sm text-blue-600">★ 4.5</span>
          <span className="bg-blue-100 text-blue-600 px-1 py-[2px] rounded">
            #Cafe
          </span>
          <span className="bg-blue-100 text-blue-600 px-1 py-[2px] rounded">
            #Hotplace
          </span>
        </div>
      </div>
    </div>
  );
};

export default ContentSummary;
