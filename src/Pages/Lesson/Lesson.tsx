import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetSingleLessonQuery } from "../../redux/features/lesson/lessonApi";
import { useGetVocabulariesQuery } from "../../redux/features/vocabulary/vocabularyApi";
import { ILesson } from "../../types/lesson";
import Confetti from "react-confetti";
import {
  FaArrowLeft,
  FaArrowRight,
  FaVolumeUp,
  FaCheckCircle,
} from "react-icons/fa";

const Lesson = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: lessonData,
    isLoading: isLessonLoading,
    error: isLessonError,
  } = useGetSingleLessonQuery(id ?? "");

  const lesson: ILesson | undefined = lessonData?.data;

  const {
    data: vocabulariesData,
    isLoading: isVocabLoading,
    error: vocabError,
  } = useGetVocabulariesQuery(lesson ? { lessonNo: lesson.number } : {}, {
    skip: !lesson,
  });

  const vocabularies = vocabulariesData?.data || [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    setCurrentIndex(0);
  }, [lesson?.number]);

  if (isLessonLoading || isVocabLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  if (isLessonError || vocabError)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Error loading lesson data
      </div>
    );

  if (!lesson)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Lesson not found
      </div>
    );

  if (vocabularies.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        No vocabularies found for this lesson.
      </div>
    );
  }

  const vocabulary = vocabularies[currentIndex];

  const handlePronounce = (word: string) => {
    if (!("speechSynthesis" in window)) {
      alert("Speech Synthesis not supported in this browser.");
      return;
    }
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "ja-JP";
    window.speechSynthesis.speak(utterance);
  };

  const handleNext = () => {
    if (currentIndex < vocabularies.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleComplete = () => {
    setShowConfetti(true);
    setTimeout(() => {
      setShowConfetti(false);
      navigate("/lessons");
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {showConfetti && (
        <Confetti width={window.innerWidth} height={window.innerHeight} />
      )}

      {/* Hero Section */}
      <div className="pt-5">
        <div className="hero min-h-[30vh] max-w-7xl mx-auto bg-gradient-to-r from-green-500 to-emerald-600 flex flex-col items-center justify-center text-white p-10 ">
          <h1 className="text-3xl  md:text-4xl font-bold mb-2">
            Lesson: {lesson.name}
          </h1>
          <p className="text-xl">Lesson Number: {lesson.number}</p>
        </div>
      </div>

      <div className="max-w-xl mx-auto p-4 mt-8">
        {/* Pagination info */}
        <div className="flex items-center justify-between mb-4 text-gray-700">
          <button
            className="flex items-center bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            <FaArrowLeft className="mr-2" />
            Previous
          </button>
          <div className="text-gray-800 font-medium">
            Vocabulary {currentIndex + 1} of {vocabularies.length}
          </div>
          <button
            className="flex items-center bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleNext}
            disabled={currentIndex === vocabularies.length - 1}
          >
            Next
            <FaArrowRight className="ml-2" />
          </button>
        </div>

        {/* Vocabulary Card */}
        <div
          className="bg-white p-6 rounded-md shadow-md hover:shadow-lg transition cursor-pointer"
          onClick={() => handlePronounce(vocabulary.word)}
          title="Click to hear pronunciation"
        >
          <div className="flex items-center justify-center mb-2">
            <h2 className="text-2xl font-semibold text-gray-800 mr-2">
              {vocabulary.word}
            </h2>
            <FaVolumeUp className="text-gray-500" />
          </div>
          <p className="text-gray-600 mb-1">
            <span className="font-semibold">Meaning:</span> {vocabulary.meaning}
          </p>
          <p className="text-gray-600 mb-1">
            <span className="font-semibold">Pronunciation:</span>{" "}
            {vocabulary.pronunciation}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold">When to Say:</span>{" "}
            {vocabulary.whenToSay}
          </p>
        </div>

        {/* Completion Button */}
        {currentIndex === vocabularies.length - 1 && (
          <div className="text-center mt-8">
            <button
              className="inline-flex items-center bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
              onClick={handleComplete}
            >
              <FaCheckCircle className="mr-2" />
              Complete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Lesson;
