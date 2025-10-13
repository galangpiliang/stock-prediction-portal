import { useContext } from "react";
import { AuthContext } from "./AuthProvider";
import { Navigate } from "react-router-dom";    

const PrivateRoute = ({ children }) => {
    const { isLoggedIn } = useContext(AuthContext);
    console.log(`isLoggedIn`,isLoggedIn)

    if (!isLoggedIn) {
        return <Navigate to="/login" />;
    }

    return children;
}

export default PrivateRoute;
