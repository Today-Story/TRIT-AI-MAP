import { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import axios from "axios";
import SearchBar from "./SearchBar";
import CategoryFilter from "./CategoryFilter";
import CardDrawer from "./CardDrawer";

const containerStyle = {
  width: "390px",
  height: "690px",
};

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

// 🔥 카테고리별 아이콘 매핑
const CATEGORY_ICON_MAP: { [key: string]: string } = {
  BEAUTY: "/Marker_Beauty.svg",
  TRAVEL: "/Marker_Play.svg",
  SHOPPING: "/Marker_Shopping.svg",
  FOOD: "/Marker_Tasty.svg",
  DEFAULT: "/Marker_Shopping.svg",
};

const GoogleMapComponent = () => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [contents, setContents] = useState<ContentData[]>([]);
  const [selectedContent, setSelectedContent] = useState<ContentData | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isCardOpen, setIsCardOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // ✅ 검색어 상태 추가
  const [selectedFilter, setSelectedFilter] = useState<string>("AI 추천"); // ✅ 필터 상태 추가

  // ✅ 현재 위치 가져오기
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error fetching location:", error);
        }
      );
    }
  }, []);

  // ✅ 검색 API 활용 (Debounce 적용)
  useEffect(() => {
    const searchContents = async () => {
      if (searchTerm.trim() === "") {
        // 🔹 검색어가 없으면 기본 데이터 유지
        try {
          const response = await axios.get<ContentData[]>("http://localhost:3000/contents");
          setContents(response.data);
        } catch (error) {
          console.error("Error fetching default content data:", error);
        }
      } else {
        try {
          console.log(`🔍 검색 요청: /contents/search?name=${encodeURIComponent(searchTerm)}`);

          const response = await axios.get<ContentData[]>(
            `http://localhost:3000/contents/search?name=${encodeURIComponent(searchTerm)}`
          );

          if (response.data.length === 0) {
            console.warn("⚠️ 검색 결과 없음:", searchTerm);
          } else {
            console.log("✅ 검색 결과:", response.data);
          }

          setContents(response.data);
        } catch (error) {
          console.error("❌ Error fetching search results:", error);
        }
      }
    };

    const debounce = setTimeout(() => {
      searchContents();
    }, 300); // 🔥 0.3초 동안 입력이 없을 때만 요청

    return () => clearTimeout(debounce);
  }, [searchTerm]); // ✅ 검색어가 변경될 때마다 API 호출

  // ✅ 지도 클릭 시 카드 닫기
  const handleMapClick = () => {
    setIsCardOpen(false);
    setSelectedContent(null);
  };

  return (
    <div className="relative w-[390px] h-[690px] mx-auto border border-gray-300 rounded-lg overflow-hidden">
      {/* 🏷️ 검색 및 필터 UI */}
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedFilter={selectedFilter}
        onFilterSelect={setSelectedFilter}
        onBack={() => console.log("뒤로가기 버튼 클릭됨")}
        onLocate={() => {
          if (location) {
            console.log("내 위치로 이동:", location);
          }
        }}
      />
      <CategoryFilter selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />

      {/* 🗺 Google Maps */}
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
          }} // ✅ 지도 클릭 시 카드 닫기
        >
          {/* 🔵 내 위치 마커 */}
          {location && (
            <Marker
              position={location}
              icon={{
                url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                scaledSize: new window.google.maps.Size(50, 50),
              }}
            />
          )}

          {/* 📍 API에서 받은 컨텐츠 마커 */}
          {contents
            .filter(
              (content) =>
                content.latitude !== null &&
                content.longitude !== null &&
                (selectedCategory === null || content.category.toUpperCase() === selectedCategory)
            )
            .map((content) => (
              <Marker
                key={content.id}
                position={{ lat: parseFloat(content.latitude ?? "0"), lng: parseFloat(content.longitude ?? "0") }}
                icon={{
                  url: CATEGORY_ICON_MAP[content.category.toUpperCase()] || CATEGORY_ICON_MAP.DEFAULT,
                  scaledSize: new window.google.maps.Size(50, 50),
                }}
                onClick={() => {
                  setSelectedContent(content);
                  setIsCardOpen(true); // ✅ 마커 클릭 시 카드 열기
                }}
              />
            ))}
        </GoogleMap>
      </LoadScript>

      {/* ✅ 기본 50개, 마커 클릭 시 1개 데이터 표시 */}
      <CardDrawer
        contents={selectedContent ? [selectedContent] : contents.slice(0, 50)}
        isOpen={isCardOpen}
        onOpen={() => setIsCardOpen(true)}
        onClose={() => setIsCardOpen(false)}
      />
    </div>
  );
};

export default GoogleMapComponent;
