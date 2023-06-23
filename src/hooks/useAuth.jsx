import {useSelector} from "react-redux";
import {selectCurrentToken} from "../features/auth/authSlice";
import jwtDecode from "jwt-decode";

const UseAuth = () => {
    const token = useSelector(selectCurrentToken);
    let isManager = false;
    let isAdmin = false;
    let status = "Employee";

    if(token) {
        const decoded = jwtDecode(token);
        const {username, roles} = decoded.UserInfo;
        isAdmin = roles.includes("Admin");
        isManager = roles.includes("Manager");
        if(isManager) {
            status = "Manager";
        }
        if(isAdmin) {
            status = "Admin";
        }
        return {username, roles, isAdmin, isManager, status};
    }

    return {username: "", roles: [], isManager, isAdmin, status};
}
export default UseAuth;
