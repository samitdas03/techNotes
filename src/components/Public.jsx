import React from 'react';
import "./public.scss";
import {useNavigate} from "react-router-dom";

const Public = () => {
    const navigate = useNavigate();
    return (
        <div className="container">
            <div className="header">
                <p className="welcome">Welcome to</p>
                <p className="title">techNotes</p>
                <button className="login-button" onClick={() => navigate("/login")}>LOGIN</button>
            </div>
        </div>
    )
}
export default Public;
