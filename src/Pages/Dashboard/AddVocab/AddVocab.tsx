import { useForm, SubmitHandler } from "react-hook-form";
import { FaPlus, FaSpinner } from "react-icons/fa";
import { Toaster, toast } from "sonner";
import { useCreateVocabularyMutation } from "../../../redux/features/vocabulary/vocabularyApi";
import { useAppSelector } from "../../../redux/hook";
import { selectCurrentUser } from "../../../redux/features/auth/authSlice";
import { User } from "../../../types/user.type";

interface IAddVocabForm {
  word: string;
  pronunciation: string;
  meaning: string;
  whenToSay: string;
  lessonNo: number;
  adminEmail: string;
}

const AddVocab = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IAddVocabForm>();

  const [createVocabulary, { isLoading }] = useCreateVocabularyMutation();
  const user = useAppSelector(selectCurrentUser) as User;

  const onSubmit: SubmitHandler<IAddVocabForm> = async (data) => {
    console.log(data);
    try {
      await createVocabulary(data).unwrap();
      toast.success("Vocabulary added successfully!");
      reset();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorMessage =
        error?.data?.message ||
        "An error occurred while adding the vocabulary.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 mt-10 lg:mt-0">
      <Toaster richColors position="top-right" />

      <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-center mb-6 flex items-center justify-center">
          <FaPlus className="mr-2 text-blue-500" />
          Add New Vocabulary
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Word */}
            <div>
              <label
                htmlFor="word"
                className="block text-gray-700 font-medium mb-2"
              >
                Word (Japanese)
              </label>
              <input
                id="word"
                type="text"
                placeholder="e.g., こんにちは"
                className={`w-full px-3 py-2 border ${
                  errors.word ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                {...register("word", {
                  required: "Word is required.",
                })}
              />
              {errors.word && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.word.message}
                </p>
              )}
            </div>

            {/* Pronunciation */}
            <div>
              <label
                htmlFor="pronunciation"
                className="block text-gray-700 font-medium mb-2"
              >
                Pronunciation
              </label>
              <input
                id="pronunciation"
                type="text"
                placeholder="e.g., Konnichiwa"
                className={`w-full px-3 py-2 border ${
                  errors.pronunciation ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                {...register("pronunciation", {
                  required: "Pronunciation is required.",
                })}
              />
              {errors.pronunciation && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.pronunciation.message}
                </p>
              )}
            </div>

            {/* Meaning */}
            <div>
              <label
                htmlFor="meaning"
                className="block text-gray-700 font-medium mb-2"
              >
                Meaning
              </label>
              <input
                id="meaning"
                type="text"
                placeholder="e.g., Hello"
                className={`w-full px-3 py-2 border ${
                  errors.meaning ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                {...register("meaning", {
                  required: "Meaning is required.",
                })}
              />
              {errors.meaning && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.meaning.message}
                </p>
              )}
            </div>

            {/* Lesson Number */}
            <div>
              <label
                htmlFor="lessonNo"
                className="block text-gray-700 font-medium mb-2"
              >
                Lesson Number
              </label>
              <input
                id="lessonNo"
                type="number"
                placeholder="e.g., 1"
                className={`w-full px-3 py-2 border ${
                  errors.lessonNo ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                {...register("lessonNo", {
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
              {errors.lessonNo && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.lessonNo.message}
                </p>
              )}
            </div>

            {/* When to Say */}
            <div className="md:col-span-2">
              <label
                htmlFor="whenToSay"
                className="block text-gray-700 font-medium mb-2"
              >
                When to Say
              </label>
              <textarea
                id="whenToSay"
                placeholder="Explain when to use this word"
                className={`w-full px-3 py-2 border ${
                  errors.whenToSay ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                {...register("whenToSay", {
                  required: "This field is required.",
                  minLength: {
                    value: 3,
                    message: "Please provide at least a few characters.",
                  },
                })}
              ></textarea>
              {errors.whenToSay && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.whenToSay.message}
                </p>
              )}
            </div>

            {/* Admin Email */}
            <div>
              <label
                htmlFor="adminEmail"
                className="block text-gray-700 font-medium mb-2"
              >
                Your Email
              </label>
              <input
                id="adminEmail"
                type="email"
                className={`w-full px-3 py-2 border ${
                  errors.adminEmail ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                {...register("adminEmail", {
                  value: user?.email || "",
                  onChange: () => {
                    return;
                  },
                })}
                disabled
              />
              {errors.adminEmail && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.adminEmail.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2 mt-2">
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
                    Add Vocabulary
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVocab;
