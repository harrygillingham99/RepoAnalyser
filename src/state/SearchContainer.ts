import { useSetState } from "react-use";
import { createContainer } from "unstated-next";

interface ISearchState {
  searchText?: string;
}
const useSearchState = () => {
  const [searchState, setSearchState] = useSetState<ISearchState>({
    searchText: undefined,
  });

  const setSearchText = (search: string) => {
    setSearchState({ searchText: search });
  };

  const resetSearch = () => setSearchState({ searchText: undefined });

  return {
    searchState,
    setSearchText,
    resetSearch,
  };
};

export const SearchContainer = createContainer(useSearchState);
