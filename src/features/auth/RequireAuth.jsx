import useAuth from "../../hooks/useAuth";
import {Navigate, Outlet, useLocation} from "react-router-dom";


const RequireAuth = ({allowedRoles}) => {

    const {roles} = useAuth();
    const location = useLocation();

    const content = (roles.some((role) => allowedRoles.includes(role)))
                                ? <Outlet />
                                : <Navigate to="/login" state={{from: location}} replace={true} />

    return content;
}
export default RequireAuth;
