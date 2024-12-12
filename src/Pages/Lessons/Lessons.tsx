import { Link } from "react-router-dom";
import { useGetLessonsQuery } from "../../redux/features/lesson/lessonApi";
import { ILesson } from "../../types/lesson";
import { FaBookOpen } from "react-icons/fa";
import { TbChartBubbleFilled } from "react-icons/tb";

const Lessons = () => {
  const {
    data: lessonsData,
    isLoading: isLessonsLoading,
    error: lessonsError,
  } = useGetLessonsQuery({});

  if (isLessonsLoading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading Lessons...
      </div>
    );
  if (lessonsError)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Error loading Lessons
      </div>
    );

  const lessons = lessonsData?.data || [];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="pt-5 ">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 p-8 max-w-5xl mx-auto rounded-md flex items-center justify-center space-x-3 bg-gradient-to-r from-blue-50 to-blue-100 shadow-lg">
          <TbChartBubbleFilled className="text-blue-600 text-4xl" />
          <span>Choose a Lesson</span>
        </h1>
      </div>

      <div className="max-w-5xl mx-auto p-6 grid gap-8 md:grid-cols-2 lg:grid-cols-3 ">
        {lessons.length === 0 ? (
          <div className="col-span-full text-center text-gray-600">
            No lessons found.
          </div>
        ) : (
          lessons.map((lesson: ILesson) => (
            <div
              key={lesson._id}
              className="flex flex-col overflow-hidden rounded-lg shadow-md bg-white border border-gray-200 hover:shadow-lg transform hover:-translate-y-1 transition duration-200"
            >
              {/* Card Header */}
              <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 p-4 flex items-center">
                <div className="w-10 h-10 bg-indigo-500 text-white flex items-center justify-center rounded-full mr-3">
                  <FaBookOpen />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 leading-tight">
                    Lesson {lesson.number}
                  </h2>
                </div>
              </div>

              {/* Card Body with Large Lesson Number */}
              <div className="flex-1 p-4 bg-gray-50 flex items-center justify-center">
                <span className="text-4xl font-bold text-indigo-500">
                  {lesson.name}
                </span>
              </div>

              {/* Call to Action */}
              <div className="p-4 border-t border-gray-100 bg-gray-50 ">
                <Link
                  to={`/lessons/${lesson._id}`}
                  className="inline-flex items-center px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 w-full justify-center"
                >
                  Start Lesson
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Lessons;
