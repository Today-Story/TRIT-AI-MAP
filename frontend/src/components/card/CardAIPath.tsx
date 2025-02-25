import { useState } from "react";

import { cn } from "@utils/cn";

import Guide from "./ai-path/Guide";
import Plan from "./ai-path/Plan";

const TABS = ["Plan", "Guide"];

export default function CardAIPath() {
  const [currentTab, setCurrentTab] = useState("Plan");

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
          <button className="bg-primary-300 text-white rounded-full px-1 text-sm">CONTINUE</button>
        )}
      </div>
      {currentTab === "Plan" ? <Plan /> : <Guide />}
    </div>
  );
}
