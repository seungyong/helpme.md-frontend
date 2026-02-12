import { createContext, useContext } from "react";

import { Section, Sections } from "@src/types/section";
import {
  CreateSectionRequest,
  DeleteSectionRequest,
  InitSectionRequest,
  ReorderSectionRequest,
  UpdateSectionContentRequest,
} from "@src/types/request/repository";
import { Callback } from "@src/types/request/common";

export interface SectionContextType {
  sections: Section[];
  fullContent: string;
  clickedSection: Section | null;
  isLoading: boolean;
  clickSection: (section: Section) => void;
  resetSection: (splitMode: string) => void;
  refetchSections: (callback?: Callback<void>) => void;

  createSection: (
    request: CreateSectionRequest,
    callback?: Callback<Section>
  ) => void;
  initSections: (
    request: InitSectionRequest,
    callback?: Callback<Sections>
  ) => void;
  updateSectionReorder: (
    request: ReorderSectionRequest,
    callback?: Callback<void>
  ) => void;
  updateSectionContent: (
    request: UpdateSectionContentRequest,
    callback?: Callback<void>
  ) => void;
  deleteSection: (
    request: DeleteSectionRequest,
    callback?: Callback<void>
  ) => void;
}

export const SectionContext = createContext<SectionContextType | undefined>(
  undefined
);

export const useSection = () => {
  const context = useContext(SectionContext);
  if (!context) {
    throw new Error("useSection must be used within SectionProvider");
  }
  return context;
};
