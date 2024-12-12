export interface IVocabulary {
  id: string;
  word: string;
  pronunciation: string;
  meaning: string;
  whenToSay: string;
  lessonNo: number;
  adminEmail: string;
  createdAt: string;
  updatedAt: string;
}

export interface IVocabularyData {
  data: IVocabulary[];
}

export interface IVocabularySingleData {
  data: IVocabulary;
}
