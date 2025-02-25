import { DrawerMode } from "@components/card/CardDrawer";

import { create } from "zustand";

interface ContentsProps {
  name: string;
  category: string;
}

interface DrawerStoreProps {
  drawerMode: DrawerMode;
  setDrawerMode: (mode: DrawerMode) => void;
  contents: ContentsProps[];
  setContents: (mode: ContentsProps[]) => void;
  focusIndex: number;
  setFocusIndex: (index: number) => void;
}

export const useDrawerStore = create<DrawerStoreProps>((set) => ({
  drawerMode: "collapsed",
  setDrawerMode: (mode) => set({ drawerMode: mode }),
  contents: [
    { name: "", category: "" },
    { name: "", category: "" },
  ],
  setContents: (contents) => set({ contents }),
  focusIndex: -1,
  setFocusIndex: (focusIndex) => set({ focusIndex }),
}));
