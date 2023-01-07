import React from "react";
import { useParams } from "react-router";
import LoginForm from "./loginForm/loginForm";

import "./loginPanel.scss";

const LoginPanel = () => {
    let params = useParams();
    return (
        <div className="login">
            {params.type !== "signup" ? (
                <LoginForm type="signin" />
            ) : (
                <LoginForm type="signup" />
            )}
        </div>
    );
};

export default LoginPanel;
