import {
    createEntityAdapter,
    createSelector,
} from '@reduxjs/toolkit';
import {apiSlice} from "../../app/api/apiSlice";

const notesAdapter = createEntityAdapter({
    sortComparer: (a, b) => {
        if(a.completed === b.completed) {
            return 0;
        }
        return (a.completed) ? 1 : -1;
    }
});

const initialState = notesAdapter.getInitialState({});


export const notesApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getNotes: builder.query({
            query: () => "/notes",
            validateResponse: (response, result) => {
                return response.status === 200 && !result.isError;
            },
            keepUnusedDataFor: 5,
            transformResponse: (responseData) => {
                const loadedNotes = responseData.map((note) => {
                    note.id = note._id;
                    return note;
                });
                return notesAdapter.setAll(initialState, loadedNotes);
            },
            providesTags: (result, err, args) => {
                if(result?.ids) {
                    return [
                        {type: "Note", id: "LIST"},
                        ...result.ids.map((id) => ({type: "Note", id}))
                    ];
                } else {
                    return [{type: "Note", id: "LIST"}];
                }
            },
        }),
        addNewNote: builder.mutation({
            query: (initialNoteData) => ({
                url: "/notes",
                method: "POST",
                body: initialNoteData
            }),
            invalidatesTags: [
                {type: "Note", id: "LIST"},
            ],
        }),
        updateNote: builder.mutation({
            query: (initialNoteData) => ({
                url: "/notes",
                method: "PATCH",
                body: initialNoteData,
            }),
            invalidatesTags: (result, err, arg) => {
                return [{type: "Note", id: arg.id}];
            },
        }),
        deleteNote: builder.mutation({
            query: ({id}) => ({
                url: "/notes",
                method: "DELETE",
                body: {id},
            }),
            invalidatesTags: (result, err, arg) => {
                return [{type: "Note", id: arg.id}];
            },
        }),
    }),
});


export const {
    useGetNotesQuery,
    useAddNewNoteMutation,
    useUpdateNoteMutation,
    useDeleteNoteMutation,
} = notesApiSlice;


// returns the query result object
export const selectNotesResult = notesApiSlice.endpoints.getNotes.select();

const selectNotesData = createSelector(
    selectNotesResult,
    notesResult => notesResult.data     // normalized state object with ids & entities
);

export const {
    selectAll: selectAllNotes,
    selectById: selectNoteById,
    selectIds: selectNoteIds,
} = notesAdapter.getSelectors((state) => selectNotesData(state) ?? initialState);





