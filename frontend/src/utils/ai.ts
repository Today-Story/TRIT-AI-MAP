import { ContentDTO } from "@services/contents";

export const getRandomPlan = (contents: ContentDTO[] | null) => {
  const randomIndex = Math.floor(Math.random() * 110) + 1;
  return contents![randomIndex].title || "";
};
