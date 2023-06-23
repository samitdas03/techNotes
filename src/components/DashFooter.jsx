import React from 'react';
import {useLocation, useNavigate} from "react-router-dom";
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import "./dashFooter.scss";
import useAuth from "../hooks/useAuth";

const DashFooter = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {username, status} = useAuth();

    let goHomeButton = null;
    if(location.pathname !== "/dash") {
        goHomeButton = <button
            className="dash-footer-button icon-button"
            onClick={() => navigate("/dash")}
        >
            <SpaceDashboardIcon />
        </button>
    }

    const content = (
        <footer className="dash-footer">
            {goHomeButton}
            <p>USER: {username}</p>
            <p>STATUS: {status}</p>
        </footer>
    )
    return (content);
}
export default DashFooter;
