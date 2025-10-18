import { useContext } from "react";
import { AuthContext } from "./AuthProvider";
import { Navigate } from "react-router-dom";    

const PublicRoute = ({ children }) => {
    const { isLoggedIn } = useContext(AuthContext);

    if (isLoggedIn) {
        return <Navigate to="/dashboard" />;
    }

    return children;
}

export default PublicRoute;
