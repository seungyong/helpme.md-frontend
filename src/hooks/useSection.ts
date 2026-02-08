import { createContext, useContext } from "react";

import { Section, Sections } from "@src/types/section";
import {
  CreateSectionRequest,
  InitSectionRequest,
  ReorderSectionRequest,
} from "@src/types/request/repository";
import { Callback } from "@src/types/request/common";

export interface SectionContextType {
  sections: Section[];
  fullContent: string;
  clickedSection: Section;
  clickSection: (section: Section) => void;

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
  updateSectionContent: (sectionId: string | number, content: string) => void;
  deleteSection: (sectionId: string | number) => void;
  resetSection: (splitMode: string) => void;
  isLoading: boolean;
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
