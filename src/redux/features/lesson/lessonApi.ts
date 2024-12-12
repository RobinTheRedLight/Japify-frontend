import { ILesson, ILessonData, ILessonSingleData } from "../../../types/lesson";
import { baseApi } from "../../api/baseApi";

export const lessonApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLessons: builder.query<ILessonData, { lessonNo?: number }>({
      query: ({ lessonNo }) => ({
        url: "/lessons",
        method: "GET",
        params: lessonNo ? { lessonNo } : {},
      }),
      providesTags: ["Lessons"],
    }),

    getSingleLesson: builder.query<ILessonSingleData, string>({
      query: (id) => ({
        url: `/lessons/${id}`,
        method: "GET",
      }),
      providesTags: ["Lesson"],
    }),

    createLesson: builder.mutation<ILesson, Partial<ILesson>>({
      query: (data) => ({
        url: "/lessons",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Lessons", "Lesson"],
    }),

    updateLesson: builder.mutation<
      ILesson,
      { id: string; data: Partial<ILesson> }
    >({
      query: ({ id, data }) => ({
        url: `/lessons/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Lessons", "Lesson"],
    }),

    deleteLesson: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/lessons/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Lessons", "Lesson"],
    }),
  }),
});

export const {
  useGetLessonsQuery,
  useGetSingleLessonQuery,
  useCreateLessonMutation,
  useUpdateLessonMutation,
  useDeleteLessonMutation,
} = lessonApi;
