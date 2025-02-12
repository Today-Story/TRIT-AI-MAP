import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
    width: "100%",
    height: "400px",
};

const center = {
    lat: 37.5665, // 기본 서울 좌표
    lng: 126.978,
};

const GoogleMapComponent = () => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY; // 환경변수에서 API 키 가져오기

    return (
        <LoadScript googleMapsApiKey={apiKey}>
            <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={14}>
                <Marker position={center} />
            </GoogleMap>
        </LoadScript>
    );
};

export default GoogleMapComponent;
