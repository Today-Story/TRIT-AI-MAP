import { cn } from "@utils/cn";

import { useDrawerStore } from "lib/zustand/drawer";
import { FaBus, FaWalking } from "react-icons/fa";
import { FaCalendarDays } from "react-icons/fa6";
import { MdKeyboardArrowRight } from "react-icons/md";

interface GuideProps {
  isPlanMade: boolean;
}

export default function Guide({ isPlanMade }: GuideProps) {
  const contents = useDrawerStore((state) => state.contents);

  const getColorByCategory = (category: string) => {
    switch (category) {
      case "TRAVEL":
        return "bg-primary-300";
      case "FOOD":
        return "bg-food";
      case "SHOPPING":
        return "bg-shopping";
      case "BEAUTY":
        return "bg-beauty";
      default:
        return "bg-primary-300";
    }
  };

  return isPlanMade ? (
    <section className="py-10">
      <div className="flex flex-col gap-6 px-4">
        {contents.map((content, index) => (
          <div key={index} className="flex items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <span className="bg-primary-300 text-white w-6 h-6 shrink-0 flex items-center justify-center rounded-full text-xs">
                {index + 1}
              </span>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-primary-300 line-clamp-1">{content.name}</p>
                  <span
                    className={cn(
                      "text-white px-2 py-1 rounded-full text-xxs font-semibold",
                      getColorByCategory(content.category)
                    )}
                  >
                    {content.category}
                  </span>
                </div>
                <div className="flex flex-col gap-2 text-primary-300 w-max">
                  <button className="bg-primary-200 rounded-full p-2 flex justify-between items-center gap-2">
                    <FaBus />
                    <span className="text-sm">5 min</span>
                    <MdKeyboardArrowRight />
                  </button>
                  <button className="bg-primary-200 rounded-full p-2 flex justify-between items-center gap-2">
                    <FaWalking />
                    <span className="text-sm">15 min</span>
                    <MdKeyboardArrowRight />
                  </button>
                </div>
              </div>
            </div>
            <div className="bg-gray-200 rounded w-20 h-20 self-start shrink-0" />
          </div>
        ))}
      </div>
    </section>
  ) : (
    <section className="flex flex-col justify-center items-center gap-3 text-primary-300 py-10 font-bold">
      <FaCalendarDays className="text-3xl" />
      <p>Make AI Plan First!</p>
    </section>
  );
}

// TRAVEL BEAUTY FOOD SHOPPING
