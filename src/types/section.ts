export interface Section {
  id: number;
  title: string;
  content: string;
  orderIdx: number;
}

export interface Sections {
  sections: Section[];
}
