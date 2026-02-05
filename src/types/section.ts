export interface Section {
  id: string | number;
  title: string;
  content: string;
  orderIdx: number;
}

export interface Sections {
  sections: Section[];
}
