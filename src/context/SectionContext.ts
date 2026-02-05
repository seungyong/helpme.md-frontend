import { createContext, useContext } from "react";
import { Section } from "@src/types/section";

export interface SectionContextType {
  sections: Section[];
  clickedSection: Section;
  clickSection: (section: Section) => void;
  createSection: (title: string, content: string) => void;
  updateSectionOrder: (reorderedSections: Section[]) => void;
  updateSectionContent: (sectionId: string | number, content: string) => void;
  deleteSection: (sectionId: string | number) => void;
  resetSection: (splitMode: string) => void;
  isLoading: boolean;
}

export const SectionContext = createContext<SectionContextType | undefined>(
  undefined
);

export const useSectionContext = () => {
  const context = useContext(SectionContext);
  if (!context) {
    throw new Error("useSectionContext must be used within SectionProvider");
  }
  return context;
};
