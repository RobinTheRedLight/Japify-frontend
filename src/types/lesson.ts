export interface ILesson {
  _id: string;
  name: string;
  number: number;
  createdAt: string;
  updatedAt: string;
}

export interface ILessonData {
  data: ILesson[];
}
