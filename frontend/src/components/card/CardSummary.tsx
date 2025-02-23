import { useEffect, useState } from "react";

import { ContentDTO } from "@services/contents";
import { getDistanceFromLatLngInKm } from "@utils/map";

import axios from "axios";
import { AiFillInstagram } from "react-icons/ai";
import { SiTiktok } from "react-icons/si";

import { DrawerMode } from "./CardDrawer";
import StarRating from "../StarRating";
import Tag from "../Tag";

interface CardSummaryProps {
  place: ContentDTO | null;
  currentLocation: { lat: number; lng: number };
  setDrawerMode: React.Dispatch<React.SetStateAction<DrawerMode>>;
}

const youtubeEmbedUrls = ["https://www.youtube.com/embed", "https://youtube.com/embed"];

export default function CardSummary({ place, currentLocation, setDrawerMode }: CardSummaryProps) {
  const [address, setAddress] = useState({ name: "", distance: 0 });

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "YOUR_GOOGLE_MAP_API_KEY";

  const checkYoutubeEmbedUrl = (url: string) => {
    return youtubeEmbedUrls.some((embedUrl) => url.startsWith(embedUrl));
  };

  const onVideoClick = () => {
    window.location.href = place?.url || "http://localhost:5173";
  };

  useEffect(() => {
    if (!place) return;

    const fetchAddress = async () => {
      try {
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${place.latitude},${place.longitude}&key=${apiKey}&language=en`
        );
        if (response.status === 200 && response.data.results?.length > 0) {
          setAddress({
            name: response.data.results[0].formatted_address,
            distance: getDistanceFromLatLngInKm(
              currentLocation?.lat,
              currentLocation?.lng,
              place.latitude,
              place.longitude
            ),
          });
        } else {
          console.error("Reverse Geocoding 실패", response);
        }
      } catch (error) {
        console.error("Reverse Geocoding 에러", error);
      }
    };

    fetchAddress();
  }, [place]);

  console.log(place?.url);

  return place ? (
    <div className="shadow-md shadow-primary-200 bg-primary-100 rounded-3xl flex gap-2 p-3">
      <div className="flex items-center justify-center aspect-video-vertical w-1/3">
        {checkYoutubeEmbedUrl(place.url) ? (
          <iframe
            src={place.url}
            title="Video"
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
            onError={(e) => console.log(e)}
          />
        ) : (
          <button
            onClick={onVideoClick}
            className="w-full h-full bg-primary-200 rounded-xl text-primary-300 flex justify-center items-center"
          >
            {place.url.includes("instagram") ? (
              <AiFillInstagram size={40} />
            ) : (
              <SiTiktok size={40} />
            )}
          </button>
        )}
      </div>
      <button
        onClick={() => setDrawerMode("detail")}
        className="flex-[2] overflow-hidden flex flex-col justify-center gap-4 text-start"
      >
        <div className="flex gap-2 text-dark-blue">
          <div className="w-1/3 shrink-0 aspect-square bg-primary-300 rounded-xl" />
          <div className="truncate flex flex-col justify-between">
            <p className="text-sm truncate font-bold">{place.title}</p>
            <p className="text-xs truncate">{address.name}</p>
            <div className="flex text-xs justify-between items-end text-primary-300 mt-2">
              <span className="font-medium">{address.distance}km</span>
              <span className="relative font-bold py-1 px-2 gradient-chip text-xxs">BENEFIT</span>
            </div>
          </div>
        </div>
        <div>
          <div className="text-xs flex gap-2 items-center font-semibold text-dark-blue">
            <span>트릿 리뷰 20개</span>
            <div className="w-0.5 h-3 bg-primary-200" />
            <span>구글 리뷰 10개</span>
          </div>
          <StarRating rating={4.5} />
          <div className="flex gap-2 text-xs mt-2">
            {place.hashtags.map((tag) => (
              <Tag key={tag} tag={tag} />
            ))}
          </div>
        </div>
      </button>
    </div>
  ) : (
    <p className="flex items-center justify-center w-full aspect-video shadow-md shadow-primary-200 bg-primary-100 rounded-3xl">
      데이터가 없습니다.
    </p>
  );
}
