import React, {useEffect, useRef} from "react";
import {useRefreshMutation} from "./authApiSlice";
import {useSelector} from "react-redux";
import {selectCurrentToken} from "./authSlice";
import {Link, Outlet} from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import Alert from '@mui/material/Alert';
import {AlertTitle} from "@mui/material";


const PersistLogin = () => {
    const token = useSelector(selectCurrentToken);
    const effectRan = useRef(false);

    const [refresh, {
        isError,
        error,
    }] = useRefreshMutation();

    useEffect(() => {
        if(effectRan.current === true || process.env.NODE_ENV !== "development") {
            console.log("verifying refresh token");
            const verifyRefreshToken = async () => {
                try {
                    await refresh();
                } catch(err) {
                    console.log(err);
                }
            }
            if(!token) {
                verifyRefreshToken();
            }
        }

        return () => {
            effectRan.current = true;
        };
    }, []);

    let content = null;
    if(token) {
        content = <Outlet />
    } else if(isError && error) {
        content = <div style={{margin: "40px"}}>
                <Alert severity="error">
                <AlertTitle>Error</AlertTitle>
                <p>
                    {`${error.data?.message} - `}
                    <Link to="/login">Please Login again</Link>
                </p>
            </Alert>
        </div>
    } else {
        content = <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={true}
        >
            <CircularProgress color="inherit" />
        </Backdrop>
    }

    return content;
}
export default PersistLogin;
