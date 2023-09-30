import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { } from '@redux-devtools/extension'

export type CGAssetSearchFormValues = {
  assetCates: string[],
  assetTags: string[],
  assetAppProds: string[],
  keyword: string;
}

export const INIT_CGASSET_SEARCH_FORM_VALUES = {
  assetCates: [],
  assetTags: [],
  assetAppProds: [],
  keyword: ""
}

type State = {
  searchFormData: CGAssetSearchFormValues;
};

type Action = {
  setSearchFormData: (data: CGAssetSearchFormValues) => void;
  resetSearchFormData: () => void;
};

export const useSearchForm = create<State & Action>()(
  devtools(
    persist(
      (set) => ({
        searchFormData: INIT_CGASSET_SEARCH_FORM_VALUES,
        setSearchFormData: (data) => set({ searchFormData: data }, false, 'setSearchFormData'),
        resetSearchFormData: () => set({
          searchFormData: INIT_CGASSET_SEARCH_FORM_VALUES
        }, false, 'resetSearchFormData'),
      }),
      {
        name: 'search-storage',
      }
    )
  )
);
