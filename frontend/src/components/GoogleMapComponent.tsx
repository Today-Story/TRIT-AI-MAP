import { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import PlaceCard from "../components/PlaceCard"; // ✅ 카드 컴포넌트 추가

const containerStyle = {
  width: "100%",
  height: "500px",
};

// 🔥 랜덤 위치 생성 함수 (내 위치에서 500m 반경 내)
const generateRandomLocation = (lat: number, lng: number, radius = 500) => {
  const y0 = lat;
  const x0 = lng;
  const rd = radius / 111300; // 1 degree = ~111.3km

  const u = Math.random();
  const v = Math.random();
  const w = rd * Math.sqrt(u);
  const t = 2 * Math.PI * v;
  const x = w * Math.cos(t);
  const y = w * Math.sin(t);

  return { lat: y0 + y, lng: x0 + x };
};

const GoogleMapComponent = () => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [places, setPlaces] = useState<{ lat: number; lng: number; name: string }[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<{ lat: number; lng: number; name: string } | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setLocation(userLocation);

          // 🔥 내 위치 기준으로 랜덤한 위치 5개 생성
          const randomPlaces = Array.from({ length: 5 }, (_, index) => ({
            ...generateRandomLocation(userLocation.lat, userLocation.lng),
            name: `Random Place ${index + 1}`,
          }));

          setPlaces(randomPlaces);
        },
        (error) => {
          console.error("Error fetching location:", error);
        }
      );
    }
  }, []);

  return (
    <LoadScript googleMapsApiKey={apiKey}>
      {location && (
        <GoogleMap mapContainerStyle={containerStyle} center={location} zoom={15}>
          {/* 🔴 내 위치 */}
          <Marker
            position={location}
            icon={{
              url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
              scaledSize: new window.google.maps.Size(50, 50),
            }}
          />

          {/* 🔵 랜덤 마커 5개 */}
          {places.map((place, index) => (
            <Marker
              key={index}
              position={place}
              icon={{
                url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                scaledSize: new window.google.maps.Size(50, 50),
              }}
              onClick={() => setSelectedPlace(place)}
            />
          ))}
        </GoogleMap>
      )}

      {/* ✅ 마커 클릭 시 카드 컴포넌트 표시 */}
      {selectedPlace && (
        <PlaceCard place={selectedPlace} onClose={() => setSelectedPlace(null)} />
      )}
    </LoadScript>
  );
};

export default GoogleMapComponent;
