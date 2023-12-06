import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { } from '@redux-devtools/extension'

export type CgAssetsSearchFormValues = {
  assetCates: string[],
  assetGenres: string[],
  assetAppProds: string[],
  keyword: string;
}

export const INIT_CGASSET_SEARCH_FORM_VALUES = {
  assetCates: [],
  assetGenres: [],
  assetAppProds: [],
  keyword: ""
}

type State = {
  cgAssetsSearchFormData: CgAssetsSearchFormValues;
};

type Action = {
  setCgAssetsSearchFormData: (data: CgAssetsSearchFormValues) => void;
  resetCgAssetsSearchFormData: () => void;
};

export const useCgAssetsSearchForm = create<State & Action>()(
  devtools(
    persist(
      (set) => ({
        cgAssetsSearchFormData: INIT_CGASSET_SEARCH_FORM_VALUES,
        setCgAssetsSearchFormData: (data) => set({ cgAssetsSearchFormData: data }, false, 'setCgAssetsSearchFormData'),
        resetCgAssetsSearchFormData: () => set({
          cgAssetsSearchFormData: INIT_CGASSET_SEARCH_FORM_VALUES
        }, false, 'resetCgAssetsSearchFormData'),
      }),
      {
        name: 'search-storage',
      }
    )
  )
);
