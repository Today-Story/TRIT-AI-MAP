import GoogleMapComponent from "../components/GoogleMap";

const MapPage = () => {
    return (
        <div className="flex flex-col items-center gap-4">
            <h1 className="text-3xl font-bold">Google Maps</h1>
            <GoogleMapComponent />
        </div>
    );
};

export default MapPage;
