export interface Option {
  id: number;
  label: string;
  image_url: string;
  sort_order?: number;
}

export interface Question {
  id: number;
  title: string;
  description: string | null;
  options: Option[];
}

export interface Stat {
  option_id: number;
  label: string;
  count: number;
  percentage: number;
}

/** @deprecated Use Stat instead */
export type ResultSlice = {
  optionId: number;
  percent: number;
};
