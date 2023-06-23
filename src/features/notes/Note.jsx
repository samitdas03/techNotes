import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {selectNoteById} from "./notesApiSlice";
import "./note.scss"
import EditIcon from '@mui/icons-material/Edit';
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import React from "react";

const Note = ({noteId}) => {
    const note = useSelector((state) => selectNoteById(state, noteId));
    const navigate = useNavigate();

    if(note) {
        const created = new Date(note.createdAt).toLocaleString("en-US", {day: "numeric", month: "long"});
        const updated = new Date(note.updatedAt).toLocaleString("en-US", {day: "numeric", month: "long"});
        const handleEdit = () => {
            navigate(`/dash/notes/${noteId}`);
        }

        return (
            <>
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={!Boolean(note)}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>

                <div className="note-content">
                    <div className="top">
                        <p className="title">{note?.title}</p>
                        <button onClick={handleEdit}>
                            <EditIcon />
                        </button>
                    </div>
                    <p className="text">{note?.text}</p>
                    <div className="bottom">
                        <div className="left">
                            <p style={{color: (note?.completed) ? "green" : "red"}}>{(note?.completed) ? "Complete" : "Pending"}</p>
                            <p className="user">by {note?.username}</p>
                        </div>
                        <div className="right">
                            <p>Created At: {created}</p>
                            <p>Updated At: {updated}</p>
                        </div>
                    </div>
                </div>
            </>
        )
    } else {
        return null;
    }
}
export default Note
