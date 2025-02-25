import { ContentDTO } from "@services/contents";

import { create } from "zustand";

interface ContentStoreProps {
  contents: ContentDTO[];
  setContents: (contents: ContentDTO[]) => void;
}

export const useContentStore = create<ContentStoreProps>((set) => ({
  contents: [],
  setContents: (contents) => set({ contents }),
}));
