import {useSelector} from "react-redux";
import {selectAllUsers} from "../users/usersApiSlice";
import {selectNoteById} from "./notesApiSlice";
import {useParams} from "react-router-dom";
import EditNoteForm from "./EditNoteForm";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";

const EditNote = () => {
    const {id} = useParams();
    const users = useSelector(selectAllUsers);
    const note = useSelector((state) => selectNoteById(state, id));

    return (
        <div>
            {
                users.length && note ? <EditNoteForm users={users} note={note} /> : <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={true}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
            }
        </div>
    )
}
export default EditNote;
