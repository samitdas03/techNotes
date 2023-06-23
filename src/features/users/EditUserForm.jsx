import {useState, useEffect} from "react";
import {useUpdateUserMutation, useDeleteUserMutation} from "./usersApiSlice";
import {useNavigate} from "react-router-dom";
import { ROLES } from "../../config/roles";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import "./editUserForm.scss";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import DeleteIcon from "@mui/icons-material/Delete";
import Alert from "@mui/material/Alert";

const USER_REGEX = /^[A-z0-9]{3,20}$/;
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/;


const EditUserForm = ({user}) => {
    const [updateUser, {
        isLoading,
        isSuccess,
        isError,
        error,
    }] = useUpdateUserMutation();

    const [deleteUser, {
        isLoading: isDelLoading,
        isSuccess: isDelSuccess,
        isError: isDelError,
        error: delError,
    }] = useDeleteUserMutation();

    const navigate = useNavigate();

    const [username, setUsername] = useState(String(user.username));
    const [validUsername, setValidUsername] = useState(false);
    const [password, setPassword] = useState("");
    const [validPassword, setValidPassword] = useState(false);
    const [roles, setRoles] = useState(user.roles);
    const [active, setActive] = useState(Boolean(user.active));

    useEffect(() => {
        setValidUsername(USER_REGEX.test(username));
    }, [username]);

    useEffect(() => {
        setValidPassword(PWD_REGEX.test(password))
    }, [password]);

    useEffect(() => {
        if(isSuccess || isDelSuccess) {
            setUsername("");
            setPassword("");
            setRoles(["Employee"]);
            navigate("/dash/users", {replace: true});
        }
    }, [isSuccess, isDelSuccess, navigate]);

    const onChangeUsername = (e) => setUsername(e.target.value);
    const onChangePassword = (e) => setPassword(e.target.value);
    const onChangeRoles = (e) => {
        const values = Array.from(
            e.target.selectedOptions,
            (option) => option.value
        );
        setRoles(values);
    };
    const onChangeActive = () => setActive(prev => !prev);


    const handleUpdate = async (e) => {
        e.preventDefault();
        if(password) {
            await updateUser({id: user.id, username, password, roles, active});
        } else {
            await updateUser({id: user.id, username, roles, active});
        }
    }

    const handleDelete = async (e) => {
        e.preventDefault();
        await deleteUser({id: user.id});
    }

    const options = Object.values(ROLES).map((role) => (
        <option
            key={role}
            value={role}
        >
            {role}
        </option>
    ));

    let canUpdate;
    if(password) {
        canUpdate = [validUsername, validPassword, roles.length].every(Boolean) && !isLoading && !isDelLoading;
    } else {
        canUpdate = [validUsername, roles.length].every(Boolean) && !isLoading && !isDelLoading;
    }

    const validUserClass = !validUsername ? "form-input-incomplete" : "";
    const validPwdClass = password && !validPassword ? 'form-input-incomplete' : "";
    const validRolesClass = !Boolean(roles.length) ? 'form-input-incomplete' : "";

    const errContent = (error?.data?.message || delError?.data?.message) ?? "";

    return (
        <div className="edit-user-form-container">
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={isLoading || isDelLoading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>

            <form className="edit-user-form" onSubmit={(e) => e.preventDefault()}>
                <div className="edit-user-title-row">
                    <p className="title">Edit User</p>
                    <div className="button-container">
                        <button onClick={handleUpdate} disabled={!canUpdate} ><SaveAltIcon fontSize="large" /></button>
                        <button onClick={handleDelete}><DeleteIcon fontSize="large" /></button>
                    </div>
                </div>

                <div className="input-container">
                    <div className="label">Username <span className="nowrap">[3-20 letters]</span></div>
                    <input
                        className={`form-input ${validUserClass}`}
                        id="username"
                        name="username"
                        type="text"
                        autoComplete="off"
                        value={username}
                        onChange={onChangeUsername}
                    />
                </div>

                <div className="input-container">
                    <div className="label">Password <span className="nowrap">[empty = no change]</span> <span className="nowrap">[4-12 chars incl. !@#$%]</span></div>
                    <input
                        className={`form-input ${validPwdClass}`}
                        id="password"
                        name="password"
                        type="password"
                        value={password}
                        onChange={onChangePassword}
                    />
                </div>

                <div className="input-container">
                    <div className="label">
                        ASSIGNED ROLES
                    </div>
                    <select
                        className={`form-select ${validRolesClass}`}
                        multiple={true}
                        size="3"
                        value={roles}
                        onChange={onChangeRoles}
                    >
                        {options}
                    </select>
                </div>

                <div className="input-container">
                    <label htmlFor="status" className="label">Active: </label>
                    <input className="check-box" id="status" type="checkbox"  checked={active} onChange={onChangeActive} />
                </div>
                {
                    (isError || isDelError) && <Alert severity="error">{errContent}</Alert>
                }
            </form>
        </div>
    )
}
export default EditUserForm;
