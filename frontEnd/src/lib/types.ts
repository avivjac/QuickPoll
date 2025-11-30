// define the types used in the application


export type QuestionOption = {
  id: number;
  text: string;
  imageUrl: string;
};

export type Question = {
  id: number;
  title: string;
  options: QuestionOption[];
};

export type ResultSlice = {
  optionId: number;
  percent: number;
};
