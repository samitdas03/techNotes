import React from 'react';
import {useNavigate} from "react-router-dom";
import "./welcome.scss";
import ViewCarouselIcon from '@mui/icons-material/ViewCarousel';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import useAuth from "../../hooks/useAuth";

const Welcome = () => {
    const date = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const today = date.toLocaleDateString("en-US", options);
    const navigate = useNavigate();
    const {username, isManager, isAdmin} = useAuth();
    return (
        <div className="welcome">
            <p className="date">{today}</p>
            <h1>Hello {username}</h1>
            <div className="button-container">
                <button onClick={() => navigate("/dash/notes")}>
                    <div className="button-content">
                        <ViewCarouselIcon fontSize="large" />
                        View techNotes
                    </div>
                </button>
                <button onClick={() => navigate("/dash/notes/new")}>
                    <div className="button-content">
                        <NoteAddIcon fontSize="large" />
                        Add New Note
                    </div>
                </button>
                {
                    (isAdmin || isManager) && <>
                        <button onClick={() => navigate("/dash/users")}>
                            <div className="button-content">
                                <AdminPanelSettingsIcon fontSize="large"/>
                                View User Settings
                            </div>
                        </button>
                        <button onClick={() => navigate("/dash/users/new")}>
                            <div className="button-content">
                                <PersonAddIcon fontSize="large" />
                                Add New User
                            </div>
                        </button>
                    </>
                }
            </div>
        </div>
    )
}
export default Welcome;
