import {useSelector} from "react-redux";
import {selectAllUsers} from "../users/usersApiSlice";
import NewNoteForm from "./NewNoteForm";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const NewNote = () => {
    const users = useSelector(selectAllUsers);

    return (
        <div>
            {
                users.length ? <NewNoteForm users={users} /> : <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={true}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
            }

        </div>
    )
}
export default NewNote;
