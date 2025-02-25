import { useState } from "react";

import { cn } from "@utils/cn";

import { useDrawerStore } from "lib/zustand/drawer";

import Guide from "./ai-path/Guide";
import Plan from "./ai-path/Plan";

const TABS = ["Plan", "Guide"];

export default function CardAIPath() {
  const [currentTab, setCurrentTab] = useState("Plan");
  // const [addresses, setAddresses] = useState(["", ""]);
  const contents = useDrawerStore((state) => state.contents);
  const [isPlanMade, setIsPlanMade] = useState(false);

  const onClickContinue = () => {
    const isAddressEmpty = contents.some((content) => content.name === "");
    if (isAddressEmpty) return alert("Please fill in all addresses.");
    setCurrentTab("Guide");
    setIsPlanMade(true);
  };

  return (
    <div className="shadow-md shadow-primary-200 bg-primary-100 rounded-3xl p-3">
      <div className="flex justify-between font-semibold">
        <div className="flex gap-5 text-primary-200">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setCurrentTab(tab)}
              className={cn(
                "border-b border-primary-200",
                currentTab === tab && "border-primary-300 text-primary-300"
              )}
            >
              AI {tab}
            </button>
          ))}
        </div>
        {currentTab === "Plan" && (
          <button
            onClick={onClickContinue}
            className="bg-primary-300 text-white rounded-full px-1 text-sm"
          >
            CONTINUE
          </button>
        )}
      </div>
      {currentTab === "Plan" ? <Plan /> : <Guide isPlanMade={isPlanMade} />}
    </div>
  );
}
