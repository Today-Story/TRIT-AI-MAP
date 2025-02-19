import React, { useEffect } from "react";
import { ContentData, DrawerMode } from "./GoogleMapComponent";
import ContentSummary from "./ContentSummary";
import ContentDetail from "./ContentDetail";

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
    let heightNum = 80; // collapsed
    if (drawerMode === "summary") heightNum = 270;
    if (drawerMode === "detail") heightNum = 600;

    // 모드 바뀔 때마다 상위에 알림
    useEffect(() => {
        onDrawerHeightChange(heightNum);
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
                <ContentDetail
                    content={selectedContent}
                    onClose={() => setDrawerMode("summary")}
                />
            </div>
        );
    };

    return (
        <div
            className={`
        absolute bottom-0 left-0 w-full
        bg-white rounded-t-3xl shadow-lg z-10
        border border-gray-200
        transition-all duration-300
      `}
            style={{ width: "390px", height: `${heightNum}px` }}
        >
            {drawerMode === "collapsed" && renderCollapsed()}
            {drawerMode === "summary" && renderSummary()}
            {drawerMode === "detail" && renderDetail()}
        </div>
    );
};

export default CardDrawer;
