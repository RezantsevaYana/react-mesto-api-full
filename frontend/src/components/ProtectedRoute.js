import React from "react";
import { Navigate } from "react-router-dom";

//компонент, который не дает неавторизованным пользователям перейти на main

const ProtectedRoute = ({ component: Component, ...props }) => {
    return (
        props.loggedIn ? <Component {...props} /> : <Navigate to="/sign-in" />
    )
}

export default ProtectedRoute; 