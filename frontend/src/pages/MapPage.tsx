import { useEffect, useState } from "react";

import CardDrawer from "@components/card/CardDrawer";
import SearchBar from "@components/SearchBar";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { ContentDTO } from "@services/contents";

import { api } from "apis";
import { useContentStore } from "lib/zustand/contents";
import { useDrawerStore } from "lib/zustand/drawer";

const containerStyle = {
  width: "100vw",
  height: "100vh",
};

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
  const [location, setLocation] = useState({ lat: 37.5665, lng: 126.978 });
  const [selectedContent, setSelectedContent] = useState<ContentDTO | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>("AI 추천");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  console.log(setSelectedCategory);

  const {
    drawerMode,
    setDrawerMode,
    contents: addresses,
    setContents: setAddresses,
    focusIndex,
  } = useDrawerStore();
  const { contents, setContents } = useContentStore();

  const fetchContents = async () => {
    try {
      if (!searchTerm.trim()) {
        const res = await api.get<ContentDTO[]>("/contents");
        setContents(res.data);
      } else {
        const res = await api.get<ContentDTO[]>(
          `/contents/search?name=${encodeURIComponent(searchTerm)}`
        );
        setContents(res.data);
      }
    } catch (error) {
      console.error("❌ Error fetching contents:", error);
    }
  };

  const onMapClick = () => {
    setDrawerMode("collapsed");
    setSelectedContent(null);
  };

  const onMarkerClick = (content: ContentDTO) => {
    setSelectedContent(content);
    setDrawerMode("summary");
  };

  const onChangeAddress = (content: ContentDTO) => {
    const newAddresses = [...addresses];
    newAddresses[focusIndex] = { name: content.title, category: content.category };
    setAddresses(newAddresses);
  };

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

  useEffect(() => {
    const timer = setTimeout(fetchContents, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    if (drawerMode === "collapsed") fetchContents();
  }, [drawerMode]);

  return (
    <div className="flex justify-center">
      {/* 상단 검색바 */}
      <SearchBar
        searchTerm={searchTerm}
        selectedFilter={selectedFilter}
        onSelectFilter={setSelectedFilter}
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
          center={location}
          zoom={12}
          onClick={onMapClick}
          options={{
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
        >
          {/* 내 위치 마커 */}
          <Marker
            position={location}
            icon={{
              url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
              ...(typeof window.google !== "undefined"
                ? { scaledSize: new window.google.maps.Size(50, 50) }
                : {}),
            }}
          />

          {/* 콘텐츠 마커 (카테고리 필터 적용) */}
          {contents
            .filter((c) =>
              selectedCategory ? c.category.toUpperCase() === selectedCategory : true
            )
            .filter((c) => c.latitude && c.longitude)
            .map((c, idx) => (
              <Marker
                key={c.id ?? idx}
                position={{
                  lat: parseFloat(c.latitude!),
                  lng: parseFloat(c.longitude!),
                }}
                icon={{
                  url: CATEGORY_ICON_MAP[c.category.toUpperCase()] || CATEGORY_ICON_MAP.DEFAULT,
                  scaledSize: new window.google.maps.Size(50, 50),
                }}
                onClick={() => (drawerMode === "ai-path" ? onChangeAddress(c) : onMarkerClick(c))}
              />
            ))}
        </GoogleMap>
      </LoadScript>

      {/* 하단 드로어 */}
      <CardDrawer
        contents={selectedContent}
        selectedContent={selectedContent}
        setSelectedContent={setSelectedContent}
        currentLocation={location}
      />
    </div>
  );
};

export default MapPage;
