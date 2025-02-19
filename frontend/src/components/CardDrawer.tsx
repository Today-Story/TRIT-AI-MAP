import { useEffect } from "react";

import { cn } from "@utils/cn";

import { MdOutlineFilterList, MdOutlineKeyboardArrowDown } from "react-icons/md";

import CategoryFilter from "./CategoryFilter";
import ContentDetail from "./ContentDetail";
import ContentSummary from "./ContentSummary";
import { ContentData, DrawerMode } from "./GoogleMapComponent";

type CardDrawerProps = {
  drawerMode: DrawerMode;
  setDrawerMode: React.Dispatch<React.SetStateAction<DrawerMode>>;
  contents: ContentData[];
  selectedContent: ContentData | null;
  setSelectedContent: React.Dispatch<React.SetStateAction<ContentData | null>>;

  // 카드 높이가 바뀔 때 상위로 알림
  onDrawerHeightChange: (height: number) => void;
};

const CardDrawer: React.FC<CardDrawerProps> = ({
  drawerMode,
  setDrawerMode,
  contents,
  selectedContent,
  onDrawerHeightChange,
}) => {
  // 모드에 따라 높이 결정
  let height = "10%"; // collapsed
  if (drawerMode === "summary") height = "30%";
  if (drawerMode === "detail") height = "calc(100% - 200px)";

  // 모드 바뀔 때마다 상위에 알림
  useEffect(() => {
    // onDrawerHeightChange(height);
  }, [drawerMode]);

  // (1) collapsed
  const renderCollapsed = () => (
    <div className="flex items-center justify-center h-full">
      {/* 아래만 살짝 보이는 상태 */}
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-bold"
        onClick={() => setDrawerMode("summary")}
      >
        PLAY
      </button>
    </div>
  );

  // (2) summary
  const renderSummary = () => {
    // 보통 마커 클릭 시 contents = [1개],
    // 그렇지 않으면 10개 중 첫 번째만 요약 표시
    const place = contents[0];
    if (!place) return <div>데이터가 없습니다.</div>;

    return (
      <ContentSummary
        place={place}
        onClick={() => setDrawerMode("detail")}
        onClose={() => setDrawerMode("collapsed")}
      />
    );
  };

  // (3) detail
  const renderDetail = () => {
    if (!selectedContent) return <div>데이터가 없습니다.</div>;
    return (
      <div className="h-full overflow-y-auto">
        <ContentDetail content={selectedContent} onClose={() => setDrawerMode("summary")} />
      </div>
    );
  };

  return (
    <div
      className={cn(
        "fixed bottom-0 w-full max-w-mobile px-5 flex flex-col gap-5 justify-end border border-black translate-y-2/3",
        drawerMode
      )}
    >
      <div className="flex gap-2 self-end">
        <button
          onClick={() => setDrawerMode("summary")}
          className="flex gap-5 bg-primary-100 text-primary-300 rounded-full w-max py-2 px-4 border border-primary-200 items-center shadow-md shadow-primary-200"
        >
          PLAY
          <MdOutlineKeyboardArrowDown size={24} />
        </button>
        <button className="flex items-center justify-center aspect-square h-10 bg-primary-100 rounded-full w-max border border-primary-200 shadow-md shadow-primary-200">
          <MdOutlineFilterList size={24} color="#007FFF" />
        </button>
      </div>
      <div
        className="bg-white rounded-t-3xl shadow-lg z-10 transition-all duration-300 border border-black"
        style={{ height }}
      >
        {/* {drawerMode === "collapsed" && renderCollapsed()} */}
        {(drawerMode === "collapsed" || drawerMode === "summary") && renderSummary()}
        {drawerMode === "detail" && renderDetail()}
      </div>
    </div>
  );
};

export default CardDrawer;
