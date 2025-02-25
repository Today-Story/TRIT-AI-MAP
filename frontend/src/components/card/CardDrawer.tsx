import { useEffect, useState } from "react";

import { ContentDTO } from "@services/contents";
import { cn } from "@utils/cn";
import { getDistanceFromLatLngInKm } from "@utils/map";

import axios from "axios";
import { useDrawerStore } from "lib/zustand/drawer";

import CardAIPath from "./CardAIPath";
import CardDetail from "./CardDetail";
import CardSummary from "./CardSummary";
import EmptyCard from "./EmptyCard";

interface CardDrawerProps {
  contents: ContentDTO | null;
  selectedContent: ContentDTO | null;
  setSelectedContent: React.Dispatch<React.SetStateAction<ContentDTO | null>>;
  currentLocation: { lat: number; lng: number };
}

export type DrawerMode = "collapsed" | "summary" | "detail" | "ai-path";

export default function CardDrawer({
  contents,
  selectedContent,
  currentLocation,
}: CardDrawerProps) {
  const [address, setAddress] = useState({ name: "", distance: 0 });

  const { drawerMode, setDrawerMode } = useDrawerStore();

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "YOUR_GOOGLE_MAP_API_KEY";

  const onStartAIPath = () => {
    setDrawerMode("ai-path");
  };

  useEffect(() => {
    if (!contents) return;

    const fetchAddress = async () => {
      try {
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${contents.latitude},${contents.longitude}&key=${apiKey}&language=en`
        );
        if (response.status === 200 && response.data.results?.length > 0) {
          setAddress({
            name: response.data.results[0].formatted_address,
            distance: getDistanceFromLatLngInKm(
              currentLocation?.lat,
              currentLocation?.lng,
              contents.latitude,
              contents.longitude
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
  }, [contents]);

  return (
    <div
      className={cn(
        "fixed bottom-0 w-full max-w-mobile px-5 flex flex-col gap-5 justify-end transition-all translate-y-2/3",
        drawerMode !== "collapsed" && "-translate-y-5"
      )}
    >
      {drawerMode !== "detail" && (
        <button
          onClick={onStartAIPath}
          className="bg-primary-100 rounded-full py-2 px-4 w-max border border-primary-200 shadow-md shadow-primary-200 gradient-chip relative text-primary-300 self-end"
        >
          AI PATH
        </button>
      )}
      <div className="rounded-3xl shadow-lg z-10 transition-all duration-300 max-h-1/4">
        {drawerMode === "collapsed" ? (
          <EmptyCard />
        ) : drawerMode === "summary" ? (
          <CardSummary place={contents} currentLocation={currentLocation} />
        ) : drawerMode === "ai-path" ? (
          <CardAIPath />
        ) : (
          <CardDetail address={address} selectedContent={selectedContent} />
        )}
      </div>
    </div>
  );
}
