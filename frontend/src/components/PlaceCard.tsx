import React from "react";

type PlaceCardProps = {
    place: { lat: number; lng: number; name: string };
    onClose: () => void;
};

const PlaceCard: React.FC<PlaceCardProps> = ({ place, onClose }) => {
    return (
        <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-white shadow-lg p-4 rounded-lg w-80">
            <h2 className="text-xl font-bold">{place.name}</h2>
            <p className="text-gray-600">위도: {place.lat.toFixed(6)}</p>
            <p className="text-gray-600">경도: {place.lng.toFixed(6)}</p>
            <button
                className="mt-4 w-full bg-red-500 text-white py-2 rounded"
                onClick={onClose}
            >
                닫기
            </button>
        </div>
    );
};

export default PlaceCard;
