import { useGetVocabulariesQuery } from "../../../redux/features/vocabulary/vocabularyApi";

const VocabCount = ({ lessonNo }: { lessonNo: number }) => {
  const {
    data: vocabulariesData,
    isLoading: isVocabLoading,
    error: vocabError,
  } = useGetVocabulariesQuery(lessonNo ? { lessonNo: lessonNo } : {});

  const vocabularies = vocabulariesData?.data || [];

  if (isVocabLoading)
    return <span className="loading loading-dots loading-xs"></span>;
  if (vocabError) return <div>Failed to load vocabularies</div>;

  return <>{vocabularies.length}</>;
};

export default VocabCount;
