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
  useDeleteLessonMutation,
  useGetLessonsQuery,
  useUpdateLessonMutation,
} from "../../../redux/features/lesson/lessonApi";
import { ILesson } from "../../../types/lesson";
import VocabCount from "./VocabCount";
import Swal from "sweetalert2";

interface IFilterForm {
  lessonNo?: string;
}

interface IUpdateForm {
  name: string;
  number: number;
}

const ManageLessons = () => {
  const [filterLessonNo, setFilterLessonNo] = useState<number | undefined>(
    undefined
  );

  const {
    data: lessonsData,
    isLoading: isLessonsLoading,
    error: lessonsError,
  } = useGetLessonsQuery(filterLessonNo ? { lessonNo: filterLessonNo } : {});

  const lessons = lessonsData?.data || [];

  const { register: registerFilter, handleSubmit: handleFilterSubmit } =
    useForm<IFilterForm>();

  const onFilterSubmit: SubmitHandler<IFilterForm> = (data) => {
    const lessonNumber = data.lessonNo
      ? parseInt(data.lessonNo, 10)
      : undefined;
    setFilterLessonNo(lessonNumber);
  };

  const [deleteLesson, { isLoading: isDeleting }] = useDeleteLessonMutation();

  const [showModal, setShowModal] = useState(false);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);

  const [updateLesson, { isLoading: isUpdating }] = useUpdateLessonMutation();
  const {
    register: registerUpdate,
    handleSubmit: handleUpdateSubmit,
    reset: resetUpdateForm,
    formState: { errors: updateErrors },
  } = useForm<IUpdateForm>();

  const openEditModal = (lesson: ILesson) => {
    setSelectedLessonId(lesson._id);
    resetUpdateForm({
      name: lesson.name,
      number: lesson.number,
    });
    setShowModal(true);
  };

  const closeEditModal = () => {
    setShowModal(false);
    setSelectedLessonId(null);
    resetUpdateForm();
  };

  const onUpdateSubmit: SubmitHandler<IUpdateForm> = async (data) => {
    if (!selectedLessonId) return;
    try {
      await updateLesson({ id: selectedLessonId, data }).unwrap();
      toast.success("Lesson updated successfully!");
      closeEditModal();
    } catch (error: any) {
      const errorMessage = error?.data?.message || "Failed to update lesson.";
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
        deleteLesson(id)
          .unwrap()
          .then(() => {
            toast.success("Lesson deleted successfully!");
          })
          .catch((error: any) => {
            const errorMessage =
              error?.data?.message || "Failed to delete lesson.";
            toast.error(errorMessage);
          });
      }
    });
  };

  return (
    <div className="min-h-screen container mx-auto p-4 lg:mt-0 mt-10">
      <Toaster richColors position="top-right" />

      <div className="h-full max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row justify-between items-center mb-6">
          <h1 className="text-2xl lg:text-3xl font-semibold text-gray-800 text-center">
            Manage Lessons
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

        {isLessonsLoading ? (
          <div className="text-center py-10">
            <FaSpinner className="animate-spin inline-block text-blue-500 mr-2" />
            Loading lessons...
          </div>
        ) : lessonsError ? (
          <div className="text-red-500 text-center py-10">
            Error fetching lessons!
          </div>
        ) : lessons && lessons.length > 0 ? (
          <>
            {/* Table View for Medium & Larger Screens */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="py-3 px-4 font-medium text-gray-700">
                      Lesson Name
                    </th>
                    <th className="py-3 px-4 font-medium text-gray-700">
                      Lesson Number
                    </th>
                    <th className="py-3 px-4 font-medium text-gray-700">
                      Vocabulary Count
                    </th>
                    <th className="py-3 px-4 font-medium text-gray-700 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {lessons.map((lesson: ILesson) => (
                    <tr
                      key={lesson._id}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="py-2 px-4">{lesson.name}</td>
                      <td className="py-2 px-4">{lesson.number}</td>
                      <td className="py-2 px-4">
                        <VocabCount lessonNo={lesson.number} />
                      </td>
                      <td className="py-2 px-4 text-right">
                        <button
                          onClick={() => openEditModal(lesson)}
                          className="text-blue-500 hover:text-blue-600 mr-4"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(lesson._id)}
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
              {lessons.map((lesson: ILesson) => (
                <div
                  key={lesson._id}
                  className="bg-white border rounded-md shadow-sm p-4"
                >
                  <div className="mb-2">
                    <span className="font-medium text-gray-700">
                      Lesson Name:
                    </span>{" "}
                    {lesson.name}
                  </div>
                  <div className="mb-2">
                    <span className="font-medium text-gray-700">
                      Lesson Number:
                    </span>{" "}
                    {lesson.number}
                  </div>
                  <div className="mb-2">
                    <span className="font-medium text-gray-700">
                      Vocabulary Count:
                    </span>{" "}
                    <VocabCount lessonNo={lesson.number} />
                  </div>
                  <div className="flex justify-end space-x-4 pt-2 border-t mt-2">
                    <button
                      onClick={() => openEditModal(lesson)}
                      className="text-blue-500 hover:text-blue-600"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(lesson._id)}
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
            No lessons found.
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
              Edit Lesson
            </h2>
            <form
              onSubmit={handleUpdateSubmit(onUpdateSubmit)}
              className="space-y-4"
            >
              {/* Lesson Name */}
              <div>
                <label
                  htmlFor="updateName"
                  className="block text-gray-700 font-medium mb-1"
                >
                  Lesson Name
                </label>
                <input
                  id="updateName"
                  type="text"
                  className={`w-full px-3 py-2 border ${
                    updateErrors.name ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  {...registerUpdate("name", { required: "Name is required." })}
                />
                {updateErrors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {updateErrors.name.message}
                  </p>
                )}
              </div>

              {/* Lesson Number */}
              <div>
                <label
                  htmlFor="updateNumber"
                  className="block text-gray-700 font-medium mb-1"
                >
                  Lesson Number
                </label>
                <input
                  id="updateNumber"
                  type="number"
                  className={`w-full px-3 py-2 border ${
                    updateErrors.number ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  {...registerUpdate("number", {
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
                {updateErrors.number && (
                  <p className="text-red-500 text-sm mt-1">
                    {updateErrors.number.message}
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

export default ManageLessons;
