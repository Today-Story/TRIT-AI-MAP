import { useEffect, useRef, useState } from "react";

import { useDebounce } from "@hooks/useDebounce";
import { ContentDTO } from "@services/contents";
import { getRandomPlan } from "@utils/ai";
import { cn } from "@utils/cn";

import { api } from "apis";
import { useContentStore } from "lib/zustand/contents";
import { useDrawerStore } from "lib/zustand/drawer";
import { CgSpinner } from "react-icons/cg";
import { MdClose, MdOutlineSearch } from "react-icons/md";

export default function Plan() {
  const [loadingIndex, setLoadingIndex] = useState(-1);

  const {
    contents: addresses,
    setContents: setAddresses,
    focusIndex,
    setFocusIndex,
  } = useDrawerStore();

  const { contents, setContents } = useContentStore();

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
    newAddresses.splice(idx + 1, 0, { name: "", category: "" });
    setAddresses(newAddresses);
    setFocusIndex(idx + 1);
  };

  const onChangeAddress = (idx: number, value: string) => {
    const newAddresses = [...addresses];
    newAddresses[idx].name = value;
    setAddresses(newAddresses);
  };

  const onAddAIPlan = (idx: number) => {
    setLoadingIndex(idx);
    setTimeout(() => {
      setLoadingIndex(-1);
      const newAddresses = [...addresses];
      newAddresses[idx] = getRandomPlan(contents);
      setAddresses(newAddresses);
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

  const debouncedAddresses = useDebounce(addresses, 500);

  useEffect(() => {
    (async () => {
      const isEmpty = !debouncedAddresses[focusIndex]?.name.trim();
      if (isEmpty) {
        const res = await api.get<ContentDTO[]>("/contents");
        return setContents(res.data);
      }
      const res = await api.get<ContentDTO[]>(
        `/contents/search?name=${encodeURIComponent(debouncedAddresses[focusIndex].name)}`
      );
      setContents(res.data);
    })();
  }, [debouncedAddresses, focusIndex]);

  return (
    <section className="py-3 flex flex-col gap-3">
      {addresses.map((address, idx) => (
        <div key={idx} className="flex flex-col items-center gap-2">
          <div
            className={cn(
              "flex rounded-full p-2 w-full justify-between bg-primary-200 text-primary-300 gap-3",
              focusIndex === idx && "border border-primary-300 bg-white text-black"
            )}
          >
            <div className="flex items-center gap-2 flex-1">
              <span className="bg-primary-300 text-white w-6 h-6 flex justify-center items-center rounded-full text-xs">
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
                  className="flex-1 w-full bg-transparent outline-none placeholder:text-gray-500"
                  value={address.name}
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
