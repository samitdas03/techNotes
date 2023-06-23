import {useParams} from "react-router-dom";
import {useSelector} from "react-redux";
import {selectUserById} from "./usersApiSlice";
import EditUserForm from "./EditUserForm";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const EditUser = () => {
    const {id} = useParams();
    const user = useSelector((state) => selectUserById(state, id));

    return (
        <div>
            {
                user ? <EditUserForm user={user}/> : <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={true}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>

            }
        </div>
    )

}
export default EditUser;
