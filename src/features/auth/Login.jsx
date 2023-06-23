import {useLoginMutation} from "./authApiSlice";
import {useEffect, useRef, useState} from "react";
import Alert from "@mui/material/Alert";
import {useDispatch} from "react-redux";
import {setCredentials} from "./authSlice";
import {useNavigate} from "react-router-dom";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import "./login.scss";


const Login = () => {
    const userRef = useRef();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errMsg, setErrMsg] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        userRef.current.focus();
    }, []);

    useEffect(() => {
        setErrMsg("");
    }, [username, password]);

    const [login, {
        isLoading,
    }] = useLoginMutation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const {accessToken} = await login({username, password}).unwrap();
            dispatch(setCredentials(accessToken));
            setUsername("");
            setPassword("");
            navigate("/dash");
        } catch(err) {
            console.log(err);
            if(!err.data) {
                setErrMsg("no server response")
            } else {
                setErrMsg(err.data.message);
            }
        }
    }

    return (
        <div className="login-container">
            {
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={isLoading}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
            }
            <div className="login-left">
                    <p className="login-title">techNotes</p>
                <form className="login-form" onSubmit={handleSubmit}>
                    <input
                        className="login-input"
                        ref={userRef}
                        type="text"
                        placeholder="username"
                        value={username}
                        autoComplete="off"
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        className="login-input"
                        type="password"
                        placeholder="password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        required
                    />
                    <button className="login-button">LOGIN</button>
                    {
                        errMsg && <Alert severity="error">{errMsg}</Alert>
                    }
                </form>
            </div>
            <div className="login-right">
                <p className="login-text">LOGIN</p>
            </div>
        </div>
    )
}
export default Login;
