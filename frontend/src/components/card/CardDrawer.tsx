import { useEffect, useState } from "react";

import { ContentDTO } from "@services/contents";
import { cn } from "@utils/cn";
import { getDistanceFromLatLngInKm } from "@utils/map";

import axios from "axios";
import { MdOutlineFilterList, MdOutlineKeyboardArrowDown } from "react-icons/md";

import CardDetail from "./CardDetail";
import CardSummary from "./CardSummary";
import EmptyCard from "./EmptyCard";

interface CardDrawerProps {
  drawerMode: DrawerMode;
  setDrawerMode: React.Dispatch<React.SetStateAction<DrawerMode>>;
  contents: ContentDTO | null;
  selectedContent: ContentDTO | null;
  setSelectedContent: React.Dispatch<React.SetStateAction<ContentDTO | null>>;
  currentLocation: { lat: number; lng: number };
}

export type DrawerMode = "collapsed" | "summary" | "detail";

export default function CardDrawer({
  drawerMode,
  setDrawerMode,
  contents,
  selectedContent,
  currentLocation,
}: CardDrawerProps) {
  const [address, setAddress] = useState({ name: "", distance: 0 });

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "YOUR_GOOGLE_MAP_API_KEY";

  const onToggleDrawer = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setDrawerMode(drawerMode === "collapsed" ? "summary" : "collapsed");
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
        <div className="flex gap-2 self-end">
          <button
            onClick={onToggleDrawer}
            className="flex gap-5 bg-primary-100 text-primary-300 rounded-full w-max py-2 px-4 border border-primary-200 items-center shadow-md shadow-primary-200"
          >
            PLAY
            <MdOutlineKeyboardArrowDown size={24} />
          </button>
          <button className="flex items-center justify-center aspect-square h-10 bg-primary-100 rounded-full w-max border border-primary-200 shadow-md shadow-primary-200">
            <MdOutlineFilterList size={24} color="#007FFF" />
          </button>
        </div>
      )}
      <div className="rounded-3xl shadow-lg z-10 transition-all duration-300 max-h-1/4">
        {drawerMode === "collapsed" ? (
          <EmptyCard />
        ) : drawerMode === "summary" ? (
          <CardSummary
            place={contents}
            currentLocation={currentLocation}
            setDrawerMode={setDrawerMode}
          />
        ) : (
          <CardDetail
            address={address}
            selectedContent={selectedContent}
            setDrawerMode={setDrawerMode}
          />
        )}
      </div>
    </div>
  );
}
