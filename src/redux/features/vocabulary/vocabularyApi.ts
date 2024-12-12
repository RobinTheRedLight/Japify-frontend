import { IVocabulary, IVocabularyData, IVocabularySingleData } from "../../../types/vocabulary";
import { baseApi } from "../../api/baseApi";

export const vocabularyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getVocabularies: builder.query<IVocabularyData, { lessonNo?: number }>({
      query: ({ lessonNo }) => ({
        url: "/vocabularies",
        method: "GET",
        params: lessonNo ? { lessonNo } : {},
      }),
      providesTags: ["Vocabularies"],
    }),

    getSingleVocabulary: builder.query<IVocabularySingleData, string>({
      query: (id) => ({
        url: `/vocabularies/${id}`,
        method: "GET",
      }),
      providesTags: ["Vocabulary"],
    }),

    createVocabulary: builder.mutation<IVocabulary, Partial<IVocabulary>>({
      query: (data) => ({
        url: "/vocabularies",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Vocabularies", "Vocabulary"],
    }),

    updateVocabulary: builder.mutation<
      IVocabulary,
      { id: string; data: Partial<IVocabulary> }
    >({
      query: ({ id, data }) => ({
        url: `/vocabularies/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Vocabularies", "Vocabulary"],
    }),

    deleteVocabulary: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/vocabularies/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Vocabularies", "Vocabulary"],
    }),
  }),
});

export const {
  useGetVocabulariesQuery,
  useGetSingleVocabularyQuery,
  useCreateVocabularyMutation,
  useUpdateVocabularyMutation,
  useDeleteVocabularyMutation,
} = vocabularyApi;
