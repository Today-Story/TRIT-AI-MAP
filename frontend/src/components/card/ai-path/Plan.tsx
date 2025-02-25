import { useEffect, useRef, useState } from "react";

import { getRandomPlan } from "@utils/ai";
import { cn } from "@utils/cn";

import { CgSpinner } from "react-icons/cg";
import { MdClose, MdOutlineSearch } from "react-icons/md";

export default function Plan() {
  const [addresses, setAddresses] = useState(["", ""]);
  const [focusIndex, setFocusIndex] = useState(-1);
  const [loadingIndex, setLoadingIndex] = useState(-1);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    setFocusIndex(0);
  }, []);

  useEffect(() => {
    if (focusIndex >= 0 && inputRefs.current[focusIndex]) {
      inputRefs.current[focusIndex]?.focus();
    }
  }, [focusIndex, addresses]);

  const onAddAddress = (idx: number) => {
    const newAddresses = [...addresses];
    newAddresses.splice(idx + 1, 0, "");
    setAddresses(newAddresses);
    setFocusIndex(idx + 1);
  };

  const onChangeAddress = (idx: number, value: string) => {
    const newAddresses = [...addresses];
    newAddresses[idx] = value;
    setAddresses(newAddresses);
  };

  const onAddAIPlan = (idx: number) => {
    setLoadingIndex(idx);
    setTimeout(() => {
      setLoadingIndex(-1);
      onChangeAddress(idx, getRandomPlan());
    }, 1000);
  };

  const onFocusInput = (idx: number) => {
    setFocusIndex(idx);
  };

  const onRemovePlan = (idx: number) => {
    if (addresses.length <= 2) return;
    const newAddresses = [...addresses];
    newAddresses.splice(idx, 1);
    setAddresses(newAddresses);
  };

  return (
    <section className="py-3 flex flex-col gap-3">
      {addresses.map((address, idx) => (
        <div key={idx} className="flex flex-col items-center gap-2">
          <div
            className={cn(
              "flex rounded-full p-2 w-full justify-between bg-primary-200 text-primary-300",
              focusIndex === idx && "border border-primary-300 bg-white text-black"
            )}
          >
            <div className="flex items-center gap-2">
              <span className="bg-primary-300 text-white py-1 px-2 rounded-full text-xs">
                {idx + 1}
              </span>
              {loadingIndex === idx ? (
                <CgSpinner className="animate-spin" />
              ) : (
                <input
                  ref={(el) => {
                    inputRefs.current[idx] = el;
                  }}
                  placeholder="Enter directly"
                  className={cn(
                    "flex-1 w-full bg-transparent outline-none placeholder:text-gray-500"
                  )}
                  value={address}
                  onChange={(e) => onChangeAddress(idx, e.target.value)}
                  onFocus={() => onFocusInput(idx)}
                />
              )}
            </div>
            {focusIndex === idx && (
              <div className="flex gap-1 text-primary-300 text-xl">
                <button>
                  <MdOutlineSearch />
                </button>
                <button onClick={() => onRemovePlan(idx)}>
                  <MdClose />
                </button>
              </div>
            )}
          </div>
          {focusIndex === idx && (
            <div className="flex items-center gap-2 self-end">
              <button
                onClick={() => onAddAddress(idx)}
                className="px-2 py-1 bg-primary-300 text-white rounded-full text-xs"
              >
                +
              </button>
              <button
                onClick={() => onAddAIPlan(idx)}
                className="gradient-chip relative py-2 px-4 text-primary-300 text-xs"
              >
                AI 채우기
              </button>
            </div>
          )}
        </div>
      ))}
    </section>
  );
}
