import React, {useEffect} from 'react';
import {Link, useLocation, useNavigate} from "react-router-dom";
import "./dashHeader.scss";
import LogoutIcon from '@mui/icons-material/Logout';
import {useLogoutMutation} from "../features/auth/authApiSlice";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";

const DashHeader = () => {
    const navigate = useNavigate();
    const {pathname} = useLocation();

    const [logout, {
        isLoading,
        isSuccess,
        isError,
        error,
    }] = useLogoutMutation();

    useEffect(() => {
        if(isSuccess) {
            navigate("/");
        }
    }, [isSuccess, navigate]);

    const onLogoutClicked = () => {
        logout();
    }

    return (
        <header className="dash-header">
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={isLoading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <div className="dash-header-container">
                <Link to="/dash" className="link" style={{textDecoration: "none"}}><h1 className="title">techNotes</h1></Link>
                <nav className="dash-header-nav">
                    <button onClick={onLogoutClicked}>
                        <LogoutIcon fontSize="large" />
                    </button>
                </nav>
            </div>
        </header>
    )
}
export default DashHeader;
