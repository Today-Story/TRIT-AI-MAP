import GoogleMapComponent from "../components/GoogleMapComponent";

const MapPage = () => {
    return (
        <div className="flex flex-col items-center gap-4">
            <h1 className="text-3xl font-bold">Google Maps - 주변 장소</h1>
            <GoogleMapComponent />
        </div>
    );
};

export default MapPage;
