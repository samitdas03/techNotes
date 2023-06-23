import {useEffect, useState} from "react";
import {useAddNewNoteMutation} from "./notesApiSlice";
import {useNavigate} from "react-router-dom";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from '@mui/material/Alert';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import "./newNoteForm.scss";

const NewNoteForm = ({users}) => {
    const [addNewNote, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useAddNewNoteMutation();

    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    const [userId, setUserId] = useState(users[0].id);

    const handleTitleChange = (e) => setTitle(e.target.value);
    const handleTextChange = (e) => setText(e.target.value);
    const handleUserChange = (e) => setUserId(e.target.value);

    const navigate = useNavigate();

    useEffect(() => {
        if(isSuccess) {
            setTitle("");
            setText("");
            setUserId("");
            navigate("/dash/notes");
        }
    }, [isSuccess, navigate]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if(canSave) {
            await addNewNote({user: userId, title, text});
        }
    }

    const canSave = [userId, title.length, text.length].every(Boolean) && !isLoading;

    return (
        <div className="new-note-form-container">
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={isLoading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>

            <form className="new-note-form" onSubmit={handleSubmit}>
                <div className="new-note-title-row">
                    <p className="title">New Note</p>
                    <button disabled={!canSave}><SaveAltIcon fontSize="large" /></button>
                </div>
                <div className="input-container">
                    <div className="label">Title</div>
                    <input value={title} placeholder="title" type="text" onChange={handleTitleChange} />
                </div>
                <div className="input-container">
                    <div className="label">Text</div>
                    <input value={text} placeholder="text" type="text" onChange={handleTextChange} />
                </div>
                <div className="input-container">
                    <div className="label">Assigned To</div>
                    <select onChange={handleUserChange} value={userId}>
                        {
                            users.map((user) => {
                                return <option key={user.id} value={user.id}>{user.username}</option>
                            })
                        }
                    </select>
                </div>
                {
                    isError && <Alert severity="error">{error.data.message}</Alert>
                }
            </form>
        </div>
    )
}
export default NewNoteForm;
