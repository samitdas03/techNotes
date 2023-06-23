import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {useAddNewUserMutation} from "./usersApiSlice";
import {ROLES} from "../../config/roles";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import "./newUserForm.scss";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import Alert from "@mui/material/Alert";

const USER_REGEX = /^[A-z0-9]{3,20}$/;
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/;

const NewUserForm = () => {
    const [addNewUser, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useAddNewUserMutation();

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [validUsername, setValidUsername] = useState(false);
    const [password, setPassword] = useState("");
    const [validPassword, setValidPassword] = useState(false);
    const [roles, setRoles] = useState(["Employee"]);

    useEffect(() => {
        setValidUsername(USER_REGEX.test(username));
    }, [username]);
    useEffect(() => {
        setValidPassword(PWD_REGEX.test(password));
    }, [password]);

    useEffect(() => {
        if(isSuccess) {
            setUsername("");
            setPassword("");
            setRoles(["Employee"]);
            navigate("/dash/users");
        }
    }, [isSuccess, navigate]);

    const onChangeUsername = (e) => setUsername(e.target.value);
    const onChangePassword = (e) => setPassword(e.target.value);
    const onChangeRoles = (e) => {
        const values = Array.from(
            e.target.selectedOptions,
            (option) => option.value,
        );
        setRoles(values);
    }

    const canSave = [roles.length, validUsername, validPassword].every(Boolean) && !isLoading;

    const onSaveUserClicked = async (e) => {
        e.preventDefault();
        if(canSave) {
            await addNewUser({username, password, roles});
        }
    }

    const options = Object.values(ROLES).map((role) => (
        <option
            key={role}
            value={role}
        >
            {role}
        </option>
    ));

    const validUserClass = !validUsername ? "form-input-incomplete" : "";
    const validPwdClass = !validPassword ? "form-input-incomplete" : "";
    const validRolesClass = !Boolean(roles.length) ? "form-input-incomplete" : "";

    const content = (
        <div className="new-user-form-container">
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={isLoading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>

            <form className="new-user-form" onSubmit={onSaveUserClicked}>
                <div className="new-user-title-row">
                    <p className="title">New User</p>
                    <button disabled={!canSave}><SaveAltIcon fontSize="large" /></button>
                </div>

                <div className="input-container">
                    <div className="label">
                        Username <span className="nowrap">[3-20 letters]</span>
                    </div>
                    <input
                        className={`form-input ${validUserClass}`}
                        type="text"
                        autoComplete="off"
                        placeholder="username"
                        value={username}
                        onChange={onChangeUsername}
                    />
                </div>

                <div className="input-container">
                    <div className="label">
                        Password <span className="nowrap">[4-12 chars incl !@#$%]</span>
                    </div>
                    <input
                        className={`form-input ${validPwdClass}`}
                        type="password"
                        placeholder="password"
                        value={password}
                        onChange={onChangePassword}
                    />
                </div>

                <div className="input-container">
                    <div className="label">
                        ASSIGNED ROLES:
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
                {
                    isError && <Alert severity="error">{error.data.message}</Alert>
                }
            </form>
        </div>
    );


    return (
        content
    )
}
export default NewUserForm;
