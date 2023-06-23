import {useDeleteNoteMutation, useUpdateNoteMutation} from "./notesApiSlice";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import "./editNoteForm.scss";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import DeleteIcon from '@mui/icons-material/Delete';
import Alert from "@mui/material/Alert";

const EditNoteForm = ({users, note}) => {
    const [updateNote, {
        isLoading,
        isSuccess,
        isError,
        error,
    }] = useUpdateNoteMutation();

    const [deleteNote, {
        isLoading: isDelLoading,
        isSuccess: isDelSuccess,
        isError: isDelError,
        error: delError,
    }] = useDeleteNoteMutation();

    const [title, setTitle] = useState(String(note.title));
    const [text, setText] = useState(String(note.text));
    const [userId, setUserId] = useState(String(note.user));
    const [completed, setCompleted] = useState(Boolean(note.completed));

    const handleTitleChange = (e) => setTitle(e.target.value);
    const handleTextChange = (e) => setText(e.target.value);
    const handleUserChange = (e) => setUserId(e.target.value);
    const handleCompletedChange= (e) => setCompleted(!completed);

    const navigate = useNavigate();
    useEffect(() => {
        if(isSuccess || isDelSuccess) {
            setTitle("");
            setText("");
            setCompleted(false);
            setUserId("");
            navigate("/dash/notes", {replace: true});
        }
    }, [isSuccess, isDelSuccess, navigate]);

    const handleDelete = async (e) => {
        e.preventDefault();
        await deleteNote({id: note.id});
    }

    const canUpdate = [title.length, text.length, userId.length].every(Boolean) && !isLoading && !isDelLoading;
    const handleUpdate = async (e) => {
        e.preventDefault();
        if(canUpdate) {
            await updateNote({id: note.id, title, text, user: userId, completed})
        }
    }

    return (
        <div className="edit-note-form-container">
            {
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={isLoading || isDelLoading}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
            }
            <form className="edit-note-form" onSubmit={(e) => e.preventDefault()}>
                <div className="edit-note-title-row">
                    <p className="title">Edit Note</p>
                    <div className="button-container">
                        <button onClick={handleUpdate} disabled={!canUpdate} ><SaveAltIcon fontSize="large" /></button>
                        <button onClick={handleDelete}><DeleteIcon fontSize="large" /></button>
                    </div>
                </div>
                <div className="input-container">
                    <div className="label">Title</div>
                    <input value={title} type="text" onChange={handleTitleChange} />
                </div>
                <div className="input-container">
                    <div className="label">Text</div>
                    <input value={text} type="text" onChange={handleTextChange} />
                </div>
                <div className="input-container">
                    <div className="label">Assigned To</div>
                    <select onChange={handleUserChange} value={String(userId)}>
                        {
                            users.map((user) => {
                                return <option key={user.id} value={user.id}>{user.username}</option>
                            })
                        }
                    </select>
                </div>
                <div className="input-container">
                    <label htmlFor="status" className="label">Completed: </label>
                    <input className="check-box" id="status" type="checkbox"  checked={completed} onChange={handleCompletedChange} />
                </div>
                {
                    (isError || isDelError) && <Alert severity="error">{error.data?.message || delError.data?.message}</Alert>
                }
            </form>
        </div>
    )
}
export default EditNoteForm;
