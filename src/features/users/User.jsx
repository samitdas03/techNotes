import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {selectUserById} from "./usersApiSlice";
import EditIcon from '@mui/icons-material/Edit';
import "./user.scss";


const User = ({userId}) => {
    const user = useSelector((state) => selectUserById(state, userId));
    const navigate = useNavigate();

    if(user) {
        const userRoles = user.roles.toString().replaceAll(",", ", ");
        const handleEdit = () => {
            navigate(`/dash/users/${userId}`);
        }

        return (
            <tr>
                <td>{user.username}</td>
                <td>{userRoles}</td>
                <td style={{color: (user.active) ? "green" : "red"}}>{user.active ? "Active" : "Inactive"}</td>
                <td>
                    <button className="edit-button" onClick={handleEdit}>
                        <EditIcon />
                    </button>
                </td>
            </tr>
        )
    } else {
        return null;
    }
}
export default User;


