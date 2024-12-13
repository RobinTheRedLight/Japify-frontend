/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Toaster, toast } from "sonner";
import {
  FaEdit,
  FaTrash,
  FaFilter,
  FaSpinner,
  FaTimes,
  FaCheck,
} from "react-icons/fa";
import {
  useDeleteVocabularyMutation,
  useGetVocabulariesQuery,
  useUpdateVocabularyMutation,
} from "../../../redux/features/vocabulary/vocabularyApi";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet-async";

interface IFilterForm {
  lessonNo?: string;
}

interface IUpdateForm {
  word: string;
  pronunciation: string;
  meaning: string;
  whenToSay: string;
  lessonNo: number;
}

const ManageVocab = () => {
  const [filterLessonNo, setFilterLessonNo] = useState<number | undefined>(
    undefined
  );
  const {
    data: vocabulariesData,
    isLoading: isVocabLoading,
    error: vocabError,
  } = useGetVocabulariesQuery(
    filterLessonNo ? { lessonNo: filterLessonNo } : {}
  );
  const vocabularies = vocabulariesData?.data || [];

  const { register: registerFilter, handleSubmit: handleFilterSubmit } =
    useForm<IFilterForm>();

  const onFilterSubmit: SubmitHandler<IFilterForm> = (data) => {
    const lessonNumber = data.lessonNo
      ? parseInt(data.lessonNo, 10)
      : undefined;
    setFilterLessonNo(lessonNumber);
  };

  const [deleteVocabulary, { isLoading: isDeleting }] =
    useDeleteVocabularyMutation();

  const [showModal, setShowModal] = useState(false);
  const [selectedVocabId, setSelectedVocabId] = useState<string | null>(null);

  const [updateVocabulary, { isLoading: isUpdating }] =
    useUpdateVocabularyMutation();
  const {
    register: registerUpdate,
    handleSubmit: handleUpdateSubmit,
    reset: resetUpdateForm,
    formState: { errors: updateErrors },
  } = useForm<IUpdateForm>();

  const openEditModal = (vocab: any) => {
    setSelectedVocabId(vocab._id);
    resetUpdateForm({
      word: vocab.word,
      pronunciation: vocab.pronunciation,
      meaning: vocab.meaning,
      whenToSay: vocab.whenToSay,
      lessonNo: vocab.lessonNo,
    });
    setShowModal(true);
  };

  const closeEditModal = () => {
    setShowModal(false);
    setSelectedVocabId(null);
    resetUpdateForm();
  };

  const onUpdateSubmit: SubmitHandler<IUpdateForm> = async (data) => {
    if (!selectedVocabId) return;
    try {
      await updateVocabulary({ id: selectedVocabId, data }).unwrap();
      toast.success("Vocabulary updated successfully!");
      closeEditModal();
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || "Failed to update vocabulary.";
      toast.error(errorMessage);
    }
  };

  const handleDelete = async (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteVocabulary(id)
          .unwrap()
          .then(() => {
            toast.success("Vocabulary deleted successfully!");
          })
          .catch((error: any) => {
            const errorMessage =
              error?.data?.message || "Failed to delete vocabulary.";
            toast.error(errorMessage);
          });
      }
    });
  };

  return (
    <div className="min-h-screen container mx-auto p-4 lg:mt-0 mt-10">
      <Helmet>
        <title>Japify | Manage Vocabularies</title>
      </Helmet>
      <Toaster richColors position="top-right" />

      <div className="h-full max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row justify-between items-center mb-6">
          <h1 className="text-2xl lg:text-3xl font-semibold text-gray-800 text-center">
            Manage Vocabularies
          </h1>

          {/* Filter Form */}
          <form
            onSubmit={handleFilterSubmit(onFilterSubmit)}
            className="flex flex-row items-center justify-end gap-4 mt-4 md:mt-0"
          >
            <div className="flex flex-col">
              <input
                id="lessonNo"
                type="number"
                min={0}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Lesson Number"
                {...registerFilter("lessonNo")}
              />
            </div>
            <button
              type="submit"
              className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
            >
              <FaFilter className="mr-2" />
              Filter
            </button>
          </form>
        </div>

        {isVocabLoading ? (
          <div className="text-center py-10">
            <FaSpinner className="animate-spin inline-block text-blue-500 mr-2" />
            Loading vocabularies...
          </div>
        ) : vocabError ? (
          <div className="text-red-500 text-center py-10">
            Error fetching vocabularies!
          </div>
        ) : vocabularies && vocabularies.length > 0 ? (
          <>
            {/* Table View for Medium & Larger Screens */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="py-3 px-4 font-medium text-gray-700">
                      Word
                    </th>
                    <th className="py-3 px-4 font-medium text-gray-700">
                      Pronunciation
                    </th>
                    <th className="py-3 px-4 font-medium text-gray-700">
                      Meaning
                    </th>
                    <th className="py-3 px-4 font-medium text-gray-700">
                      When To Say
                    </th>
                    <th className="py-3 px-4 font-medium text-gray-700">
                      Lesson No
                    </th>
                    <th className="py-3 px-4 font-medium text-gray-700 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {vocabularies.map((vocab: any) => (
                    <tr
                      key={vocab._id}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="py-2 px-4">{vocab.word}</td>
                      <td className="py-2 px-4">{vocab.pronunciation}</td>
                      <td className="py-2 px-4">{vocab.meaning}</td>
                      <td className="py-2 px-4">{vocab.whenToSay}</td>
                      <td className="py-2 px-4">{vocab.lessonNo}</td>
                      <td className="py-2 px-4 text-right">
                        <button
                          onClick={() => openEditModal(vocab)}
                          className="text-blue-500 hover:text-blue-600 mr-4"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(vocab._id)}
                          className="text-red-500 hover:text-red-600"
                          title="Delete"
                          disabled={isDeleting}
                        >
                          {isDeleting ? (
                            <FaSpinner className="animate-spin" />
                          ) : (
                            <FaTrash />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Card View for Small Screens */}
            <div className="block md:hidden space-y-4">
              {vocabularies.map((vocab: any) => (
                <div
                  key={vocab._id}
                  className="bg-white border rounded-md shadow-sm p-4"
                >
                  <div className="mb-2">
                    <span className="font-medium text-gray-700">Word:</span>{" "}
                    {vocab.word}
                  </div>
                  <div className="mb-2">
                    <span className="font-medium text-gray-700">
                      Pronunciation:
                    </span>{" "}
                    {vocab.pronunciation}
                  </div>
                  <div className="mb-2">
                    <span className="font-medium text-gray-700">Meaning:</span>{" "}
                    {vocab.meaning}
                  </div>
                  <div className="mb-2">
                    <span className="font-medium text-gray-700">
                      When To Say:
                    </span>{" "}
                    {vocab.whenToSay}
                  </div>
                  <div className="mb-2">
                    <span className="font-medium text-gray-700">
                      Lesson No:
                    </span>{" "}
                    {vocab.lessonNo}
                  </div>
                  <div className="flex justify-end space-x-4 pt-2 border-t mt-2">
                    <button
                      onClick={() => openEditModal(vocab)}
                      className="text-blue-500 hover:text-blue-600"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(vocab._id)}
                      className="text-red-500 hover:text-red-600"
                      title="Delete"
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <FaSpinner className="animate-spin" />
                      ) : (
                        <FaTrash />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-10 text-gray-500">
            No vocabularies found.
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-lg rounded-lg shadow-md p-6 relative">
            <button
              onClick={closeEditModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <FaTimes />
            </button>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FaEdit className="mr-2 text-blue-500" />
              Edit Vocabulary
            </h2>
            <form
              onSubmit={handleUpdateSubmit(onUpdateSubmit)}
              className="space-y-4"
            >
              {/* Word */}
              <div>
                <label
                  htmlFor="updateWord"
                  className="block text-gray-700 font-medium mb-1"
                >
                  Word (Japanese)
                </label>
                <input
                  id="updateWord"
                  type="text"
                  className={`w-full px-3 py-2 border ${
                    updateErrors.word ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  {...registerUpdate("word", { required: "Word is required." })}
                />
                {updateErrors.word && (
                  <p className="text-red-500 text-sm mt-1">
                    {updateErrors.word.message}
                  </p>
                )}
              </div>

              {/* Pronunciation */}
              <div>
                <label
                  htmlFor="updatePronunciation"
                  className="block text-gray-700 font-medium mb-1"
                >
                  Pronunciation
                </label>
                <input
                  id="updatePronunciation"
                  type="text"
                  className={`w-full px-3 py-2 border ${
                    updateErrors.pronunciation
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  {...registerUpdate("pronunciation", {
                    required: "Pronunciation is required.",
                  })}
                />
                {updateErrors.pronunciation && (
                  <p className="text-red-500 text-sm mt-1">
                    {updateErrors.pronunciation.message}
                  </p>
                )}
              </div>

              {/* Meaning */}
              <div>
                <label
                  htmlFor="updateMeaning"
                  className="block text-gray-700 font-medium mb-1"
                >
                  Meaning
                </label>
                <input
                  id="updateMeaning"
                  type="text"
                  className={`w-full px-3 py-2 border ${
                    updateErrors.meaning ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  {...registerUpdate("meaning", {
                    required: "Meaning is required.",
                  })}
                />
                {updateErrors.meaning && (
                  <p className="text-red-500 text-sm mt-1">
                    {updateErrors.meaning.message}
                  </p>
                )}
              </div>

              {/* When to Say */}
              <div>
                <label
                  htmlFor="updateWhenToSay"
                  className="block text-gray-700 font-medium mb-1"
                >
                  When to Say
                </label>
                <textarea
                  id="updateWhenToSay"
                  className={`w-full px-3 py-2 border ${
                    updateErrors.whenToSay
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  {...registerUpdate("whenToSay", {
                    required: "This field is required.",
                  })}
                ></textarea>
                {updateErrors.whenToSay && (
                  <p className="text-red-500 text-sm mt-1">
                    {updateErrors.whenToSay.message}
                  </p>
                )}
              </div>

              {/* Lesson Number */}
              <div>
                <label
                  htmlFor="updateLessonNo"
                  className="block text-gray-700 font-medium mb-1"
                >
                  Lesson Number
                </label>
                <input
                  id="updateLessonNo"
                  type="number"
                  className={`w-full px-3 py-2 border ${
                    updateErrors.lessonNo ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  {...registerUpdate("lessonNo", {
                    required: "Lesson number is required.",
                    valueAsNumber: true,
                    min: {
                      value: 1,
                      message: "Must be a positive integer.",
                    },
                    validate: {
                      isInteger: (value) =>
                        Number.isInteger(Number(value)) ||
                        "Must be an integer.",
                    },
                  })}
                />
                {updateErrors.lessonNo && (
                  <p className="text-red-500 text-sm mt-1">
                    {updateErrors.lessonNo.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdating ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <FaCheck className="mr-2" />
                      Update
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageVocab;
