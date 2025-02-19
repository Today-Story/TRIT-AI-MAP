import { useEffect, useState } from "react";

import CardDrawer from "@components/CardDrawer";
import SearchBar from "@components/SearchBar";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

import axios from "axios";

// 지도 컨테이너 스타일
const containerStyle = {
  // width: "390px",
  width: "100vw",
  // height: "690px",
  height: "100vh",
};

// 서버에서 내려오는 데이터 타입
export type ContentData = {
  id: number;
  postNumber: string;
  title: string;
  url: string; // 유튜브 영상 URL (임베드 가능)
  author: string;
  authorId: string;
  createdAt: string;
  views: number;
  likes: number;
  category: string;
  location: string | null; // 지도 링크 or 주소
  latitude: string | null; // 지도 마커 표시
  longitude: string | null; // 지도 마커 표시
};

// 하단 드로어 모드
export type DrawerMode = "collapsed" | "summary" | "detail";

// 카테고리별 마커 아이콘
const CATEGORY_ICON_MAP: { [key: string]: string } = {
  BEAUTY: "/Marker_Beauty.svg",
  TRAVEL: "/Marker_Play.svg",
  SHOPPING: "/Marker_Shopping.svg",
  FOOD: "/Marker_Tasty.svg",
  DEFAULT: "/Marker_Shopping.svg",
};

const MapPage = () => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "YOUR_GOOGLE_MAP_API_KEY";

  // 내 위치
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  // 전체 콘텐츠
  const [contents, setContents] = useState<ContentData[]>([]);
  // 선택된 콘텐츠 (summary/detail에서 사용)
  const [selectedContent, setSelectedContent] = useState<ContentData | null>(null);

  // 드로어 모드
  const [drawerMode, setDrawerMode] = useState<DrawerMode>("collapsed");
  // 실제 드로어 높이(px)
  const [drawerHeight, setDrawerHeight] = useState<number>(80);

  // 검색/필터
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const fetchContents = async () => {
    try {
      if (!searchTerm.trim()) {
        // 검색어 없으면 전체 조회
        const res = await axios.get<ContentData[]>("https://api.trit.store/contents");
        setContents(res.data);
      } else {
        // 검색어가 있으면 검색
        const res = await axios.get<ContentData[]>(
          `https://api.trit.store/contents/search?name=${encodeURIComponent(searchTerm)}`
        );
        setContents(res.data);
      }
    } catch (error) {
      console.error("❌ Error fetching contents:", error);
    }
  };
  // 1) 내 위치 가져오기
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => {
          console.error("Error fetching location:", err);
        }
      );
    }
  }, []);

  // 2) 검색어에 따른 콘텐츠 불러오기 (Debounce)
  useEffect(() => {
    const timer = setTimeout(fetchContents, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // 지도 클릭 => collapsed
  const handleMapClick = () => {
    setDrawerMode("collapsed");
    setSelectedContent(null);
  };

  // 마커 클릭 => summary 모드 + 선택된 콘텐츠
  const handleMarkerClick = (content: ContentData) => {
    setSelectedContent(content);
    setDrawerMode("summary");
  };

  // summary 모드에서 표시할 콘텐츠: (마커 클릭이면 1개, 아니면 최대 10개)
  let drawerContents: ContentData[] = [];
  if (drawerMode === "summary" && selectedContent) {
    drawerContents = [selectedContent];
  } else {
    drawerContents = contents.slice(0, 10);
  }

  // (중요) 카드 높이가 바뀔 때마다 필터 컴포넌트 위치 재조정
  const handleDrawerHeightChange = (height: number) => {
    setDrawerHeight(height);
  };

  return (
    <div className="flex justify-center">
      {/* 상단 검색바 */}
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onSearch={fetchContents}
        onBack={() => console.log("뒤로가기 버튼 클릭됨")}
        onLocate={() => {
          if (location) {
            console.log("내 위치로 이동:", location);
          }
        }}
      />

      {/* 구글 맵 */}
      <LoadScript googleMapsApiKey={apiKey}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={location || { lat: 37.5665, lng: 126.978 }}
          zoom={12}
          onClick={handleMapClick}
          options={{
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
        >
          {/* 내 위치 마커 */}
          {location && (
            <Marker
              position={location}
              icon={{
                url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                scaledSize: new window.google.maps.Size(50, 50),
              }}
            />
          )}

          {/* 콘텐츠 마커 (카테고리 필터 적용) */}
          {contents
            .filter((c) =>
              selectedCategory ? c.category.toUpperCase() === selectedCategory : true
            )
            .filter((c) => c.latitude && c.longitude)
            .map((c) => (
              <Marker
                key={c.id}
                position={{
                  lat: parseFloat(c.latitude!),
                  lng: parseFloat(c.longitude!),
                }}
                icon={{
                  url: CATEGORY_ICON_MAP[c.category.toUpperCase()] || CATEGORY_ICON_MAP.DEFAULT,
                  scaledSize: new window.google.maps.Size(50, 50),
                }}
                onClick={() => handleMarkerClick(c)}
              />
            ))}
        </GoogleMap>
      </LoadScript>

      {/* 하단 드로어 */}
      <CardDrawer
        drawerMode={drawerMode}
        setDrawerMode={setDrawerMode}
        contents={drawerContents}
        selectedContent={selectedContent}
        setSelectedContent={setSelectedContent}
        onDrawerHeightChange={handleDrawerHeightChange}
      />
    </div>
  );
};

export default MapPage;
