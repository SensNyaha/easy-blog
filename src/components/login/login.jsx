import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import "./login.scss";
import LoginForm from "./loginForm/loginForm";

const Login = () => {
    const [type, setType] = useState("login");
    const [status, setStatus] = useState();

    const navigate = useNavigate();
    useEffect(() => {
        if (localStorage.getItem("accessToken")) {
            navigate("/me");
        }
    }, []);

    const handleStatusChange = (status) => {
        setStatus(status);
    };
    useEffect(() => {
        if (status === "success") {
            navigate("/me");
        }
    }, [status]);
    useEffect(() => {
        setStatus(null);
    }, [type]);

    return (
        <div className="login">
            <h1 className="login__title">
                {type === "login" ? "Войдите в систему" : "Зарегистрируйтесь"}
            </h1>
            <LoginForm
                type={type}
                status={status}
                handleStatusChange={handleStatusChange}
            />
            {type === "login" ? (
                <button
                    className="login__change"
                    onClick={() => setType("register")}
                >
                    Еще не имею аккаунта
                </button>
            ) : (
                <button
                    className="login__change"
                    onClick={() => setType("login")}
                >
                    Уже имею аккаунт
                </button>
            )}
        </div>
    );
};

export default Login;
