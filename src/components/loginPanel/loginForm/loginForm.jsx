import React from "react";
import { Link } from "react-router-dom";

import "./loginForm.scss";

const LoginForm = ({ type }) => {
    let types = {
        signin: {
            title: "Вход",
            linkToReg: true,
        },
        signup: {
            title: "Регистрация",
        },
    };
    return (
        <>
            <form className="login__form">
                <h5 className="login__title">{types[type].title}</h5>
                <input
                    type="text"
                    className="login__input"
                    placeholder="Логин"
                />
                <input
                    type="password"
                    className="login__input"
                    placeholder="Пароль"
                />
                <input type="submit" className="login__submit" />
            </form>
            {types[type].linkToReg ? (
                <Link to="signup">
                    <button className="login__toreg">
                        Еще не имеете аккаунта?
                    </button>
                </Link>
            ) : null}
        </>
    );
};

export default LoginForm;
