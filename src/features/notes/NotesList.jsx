import {useGetNotesQuery} from "./notesApiSlice";
import React from "react";
import Note from "./Note";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import "./notesList.scss";
import {useNavigate} from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';
import useAuth from "../../hooks/useAuth";


const NotesList = () => {
    const {username, isAdmin, isManager} = useAuth();

    const {
        data: notes,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetNotesQuery(undefined, {
        pollingInterval: 60000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true,
    });

    const navigate = useNavigate();

    let content;
    if(isLoading) {
        content =  <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={isLoading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
    }
    if(isError) {
        content = <p className="errmsg">{error?.data?.message}</p>
    }

    if(isSuccess) {
        const {ids, entities} = notes;
        let filteredIds;
        if(isAdmin || isManager) {
            filteredIds = ids;
        } else {
            filteredIds = ids.filter((noteId) => (entities[noteId].username === username));
        }
        const notesContent = filteredIds?.length ? filteredIds.map((noteId) => (<Note key={noteId} noteId={noteId} />)) : null;
        content = (
            <>
                <div className="title-container">
                    <p className="title">All Notes</p>
                    <button onClick={() => navigate("/dash/notes/new")}><AddIcon /></button>
                </div>
                <div className="notes-container">
                    {notesContent}
                </div>
            </>
        )
    }

    return content;
}
export default NotesList;
