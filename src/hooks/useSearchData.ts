import { searchCategories } from "@/data";

export const useSearchData = () => {
  return { categories: searchCategories };
};
