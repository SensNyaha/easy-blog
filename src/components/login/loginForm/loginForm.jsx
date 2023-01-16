import { useContext, useState } from "react";
import { BlogContext } from "../../../context/context";
import LoginError from "../loginError/loginError";

import "./loginForm.scss";

const LoginForm = ({ type, status, handleStatusChange }) => {
    const [, dispatch] = useContext(BlogContext);

    const [errorMsg, setErrorMsg] = useState("");

    const handleSuccessAuth = ({
        accessToken,
        user = "Server didnt return",
    }) => {
        dispatch({
            type: "LOGIN",
            payload: { token: accessToken, user: user },
        });
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("user", JSON.stringify(user));

        handleStatusChange("success");
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();

        const formData = Array.from(
            document.querySelectorAll("input[name]")
        ).reduce((obj, input) => {
            obj[input.name] = input.value;
            return obj;
        }, {});

        fetch(`http://localhost:3001/${type}`, {
            method: "POST",
            body: JSON.stringify(formData),
            headers: {
                "Content-type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((res) => {
                if (res.accessToken) {
                    handleSuccessAuth(res);
                } else {
                    handleStatusChange("failed");
                    setErrorMsg(res);
                    throw new Error(res);
                }
            })
            .catch(console.log);
    };

    return (
        <form onSubmit={handleFormSubmit} className="login__form">
            <input
                className="login__input"
                type="email"
                name="email"
                placeholder="Электронная почта"
                required
            />
            <input
                className="login__input"
                type="password"
                name="password"
                placeholder="Пароль"
                required
            />
            <input
                className="login__submit"
                type="submit"
                value={
                    type === "login"
                        ? "Войти в систему"
                        : type === "register"
                        ? "Зарегистрироваться"
                        : "Ошибка"
                }
            />
            {status === "failed" ? <LoginError text={errorMsg} /> : null}
        </form>
    );
};

export default LoginForm;
