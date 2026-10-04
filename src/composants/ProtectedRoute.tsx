import { useContext } from "react";
import { Navigate, Outlet } from "react-router";
import { UserContext } from "../context/UserContext";

function ProtectedRoute() {
    const context = useContext(UserContext);

    const { user, loading } = context;

    //Chargement
    if (loading) {
        return <div>Chargement...</div>;
    }

    // Pas connecté
    if (!user) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    // Connecté
    return <Outlet />;
}

export default ProtectedRoute;
