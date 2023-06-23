import React from 'react';
import {useGetUsersQuery} from "./usersApiSlice";
import User from "./User";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import "./usersList.scss";
import AddIcon from '@mui/icons-material/Add';
import {useNavigate} from "react-router-dom";

const UsersList = () => {
    const {
        data: users,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetUsersQuery(undefined, {
        pollingInterval: 60000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true,
    });

    let content;
    if(isLoading) {
        content = <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={true}
        >
            <CircularProgress color="inherit" />
        </Backdrop>
    }
    if(isError) {
        content = <p className="errmsg">{error?.data?.message}</p>
    }

    const navigate = useNavigate();
    if(isSuccess) {
        const {ids} = users;
        const tableContent = ids?.length ? ids.map((userId) => <User key={userId} userId={userId} />) : null;
        content = (
            <div className="wrapper">
                <div className="title-button-container">
                    <p className="title">All Users</p>
                    <button onClick={() => navigate("/dash/users/new")}><AddIcon /></button>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Roles</th>
                            <th>Status</th>
                            <th>Edit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableContent}
                    </tbody>
                </table>
            </div>
        )
    }

    return (
        <div className="users-container">
            {content}
        </div>
    )
}
export default UsersList;






