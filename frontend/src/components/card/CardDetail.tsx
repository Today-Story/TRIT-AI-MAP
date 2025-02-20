import { useState } from "react";

import { ContentDTO } from "@services/contents";
import { cn } from "@utils/cn";

import { MdLocalPhone } from "react-icons/md";

import { DrawerMode } from "./CardDrawer";
import StarRating from "../StarRating";
import Tag from "../Tag";

interface CardDetailProps {
  selectedContent: ContentDTO | null;
  address: { name: string; distance: number };
  setDrawerMode: React.Dispatch<React.SetStateAction<DrawerMode>>;
}

const MENUS = ["Home", "Vide", "Product", "Book", "Brand"];

export default function CardDetail({ selectedContent, address, setDrawerMode }: CardDetailProps) {
  const [selectedMenu, setSelectedMenu] = useState("Home");

  const onSelectMenu = (menu: string) => {
    setSelectedMenu(menu);
  };

  return selectedContent ? (
    <section className="h-full shadow-md shadow-primary-200 bg-primary-100 rounded-3xl">
      <div className="p-5">
        <div className="flex gap-2">
          <div className="min-w-16 min-h-16 max-w-16 max-h-16 bg-primary-300 rounded-lg" />
          <div className="truncate flex flex-col">
            <p className="text-sm truncate font-bold">{selectedContent.title}</p>
            <div className="flex gap-2 text-xs">
              <span className="truncate">{address.name}</span>
              <span className="font-medium">{address.distance}km</span>
            </div>
            <div className="flex gap-1 text-xs text-primary-300 items-center">
              <MdLocalPhone color="#007FFF" size={16} />
              053-637-9999
            </div>
            <StarRating rating={4.5} />
            <div className="flex gap-2 text-xs">
              {selectedContent.hashtags.map((tag) => (
                <Tag key={tag} tag={tag} />
              ))}
            </div>
          </div>
        </div>
        <hr className="border-primary-200 my-5" />
        <div className="flex justify-center gap-2">
          <div className="text-xs flex gap-2 items-center font-semibold text-primary-300 bg-primary-200 rounded-full py-1 px-2 w-max">
            <button>Departure</button>
            <div className="w-0.5 h-3 bg-primary-300" />
            <button>Arrival</button>
          </div>
          <button className="relative py-1 px-2 text-xs text-white bg-primary-300 gradient-chip">
            AI 경로 저장 +
          </button>
        </div>
      </div>
      <div className="bg-white p-5">
        <ul className="flex">
          {MENUS.map((menu) => (
            <li key={menu} className="text-sm flex-1 text-center text-primary-200">
              <button
                onClick={() => onSelectMenu(menu)}
                className={cn(
                  "w-full py-1",
                  selectedMenu === menu && "border-b-2 border-primary-300 text-primary-300"
                )}
              >
                {menu}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  ) : (
    <p className="flex items-center justify-center w-full aspect-video shadow-md shadow-primary-200 bg-primary-100 rounded-3xl">
      데이터가 없습니다.
    </p>
  );
}
