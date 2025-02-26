import { ContentDTO } from "@services/contents";

export const getRandomPlan = (contents: ContentDTO[] | null) => {
  const randomIndex = Math.floor(Math.random() * 110) + 1;
  return contents
    ? { name: contents![randomIndex].title, category: contents![randomIndex].category }
    : { name: "", category: "" };
};
