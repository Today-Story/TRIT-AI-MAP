import { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import axios from "axios";
import ContentCard from "./ContentCard";
import SearchBar from "./SearchBar"; // ✅ 검색 바 컴포넌트 추가

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

// 🔥 카테고리별 아이콘 매핑 (public 폴더 내 파일명과 일치)
const CATEGORY_ICON_MAP: { [key: string]: string } = {
  "BEAUTY": "/Marker_Beauty.svg",
  "TRAVEL": "/Marker_Play.svg",
  "SHOPPING": "/Marker_Shopping.svg",
  "FOOD": "/Marker_Tasty.svg",
  "DEFAULT": "/Marker_Shopping.svg",
};

const containerStyle = {
  width: "390px",
  height: "690px",
};

const GoogleMapComponent = () => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [contents, setContents] = useState<ContentData[]>([]);
  const [selectedContent, setSelectedContent] = useState<ContentData | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("AI 추천");

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

  // ✅ 컨텐츠 데이터 가져오기 (GET /contents)
  useEffect(() => {
    const fetchContents = async () => {
      try {
        const response = await axios.get<ContentData[]>("http://localhost:3000/contents");

        // ✅ location이 null이면 빈 문자열로 변환
        const normalizedContents = response.data.map((content) => ({
          ...content,
          location: content.location || "",
        }));

        setContents(normalizedContents);
      } catch (error) {
        console.error("Error fetching content data:", error);
      }
    };

    fetchContents();
  }, []);

  return (
    <div className="relative w-[390px] h-[690px] mx-auto border border-gray-300 rounded-lg overflow-hidden">
      {/* 🔍 검색 바 (컴포넌트로 분리) */}
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

      {/* 🗺 Google Maps */}
      <LoadScript googleMapsApiKey={apiKey}>
        <GoogleMap mapContainerStyle={containerStyle} center={location || { lat: 37.5665, lng: 126.978 }} zoom={12} options={{
          zoomControl: false,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}>
          {/* 🔴 내 위치 마커 */}
          {location && (
            <Marker
              position={location}
              icon={{
                url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                scaledSize: new window.google.maps.Size(50, 50),
              }}
            />
          )}

          {/* 📍 API에서 받은 컨텐츠의 좌표값이 존재하는 경우에만 마커 표시 */}
          {contents
            .filter((content) => content.latitude !== null && content.longitude !== null)
            .map((content) => (
              <Marker
                key={content.id}
                position={{ lat: parseFloat(content.latitude ?? "0"), lng: parseFloat(content.longitude ?? "0") }}
                icon={{
                  url: CATEGORY_ICON_MAP[content.category.toUpperCase()] || CATEGORY_ICON_MAP["DEFAULT"],
                  scaledSize: new window.google.maps.Size(50, 50),
                }}
                onClick={() => setSelectedContent(content)}
              />
            ))}
        </GoogleMap>
      </LoadScript>

      {/* ✅ 마커 클릭 시 컨텐츠 상세 카드 표시 */}
      {selectedContent && <ContentCard content={selectedContent} onClose={() => setSelectedContent(null)} />}
    </div>
  );
};

export default GoogleMapComponent;
