import { useForm, SubmitHandler } from "react-hook-form";
import { FaPlus, FaSpinner } from "react-icons/fa";
import { Toaster, toast } from "sonner";
import { useCreateLessonMutation } from "../../../redux/features/lesson/lessonApi";
import { Helmet } from "react-helmet-async";

interface IAddLessonForm {
  name: string;
  number: number;
}

const AddLesson = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IAddLessonForm>();

  const [createLesson, { isLoading }] = useCreateLessonMutation();

  const onSubmit: SubmitHandler<IAddLessonForm> = async (data) => {
    console.log(data);
    try {
      await createLesson(data).unwrap();
      toast.success("Lesson added successfully!");
      reset();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || "An error occurred while adding the lesson.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
       <Helmet>
        <title>Japify | Add Lesson</title>
      </Helmet>
      {/* Toaster for notifications */}
      <Toaster richColors position="top-right" />

      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-center mb-6 flex items-center justify-center">
          <FaPlus className="mr-2 text-blue-500" />
          Add New Lesson
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Lesson Name */}
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-gray-700 font-medium mb-2"
            >
              Lesson Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Enter lesson name"
              className={`w-full px-3 py-2 border ${
                errors.name ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              {...register("name", {
                required: "Lesson name is required.",
                minLength: {
                  value: 3,
                  message: "Lesson name must be at least 3 characters.",
                },
              })}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Lesson Number */}
          <div className="mb-6">
            <label
              htmlFor="number"
              className="block text-gray-700 font-medium mb-2"
            >
              Lesson Number
            </label>
            <input
              id="number"
              type="number"
              placeholder="Enter lesson number"
              className={`w-full px-3 py-2 border ${
                errors.number ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              {...register("number", {
                required: "Lesson number is required.",
                valueAsNumber: true,
                min: {
                  value: 1,
                  message: "Lesson number must be a positive integer.",
                },
                validate: {
                  isInteger: (value) =>
                    Number.isInteger(Number(value)) ||
                    "Lesson number must be an integer.",
                },
              })}
            />
            {errors.number && (
              <p className="text-red-500 text-sm mt-1">
                {errors.number.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Adding...
              </>
            ) : (
              <>
                <FaPlus className="mr-2" />
                Add Lesson
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddLesson;
