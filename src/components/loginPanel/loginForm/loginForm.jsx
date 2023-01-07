import React, { useState } from "react";
import { Link } from "react-router-dom";

import "./loginForm.scss";

const LoginForm = ({ type }) => {
    let [admin, setAdmin] = useState(false);
    const handleCheckboxChange = () => {
        setAdmin((prev) => !prev);
    };
    let types = {
        signin: {
            title: "Вход",
            linkToReg: true,
        },
        signup: {
            title: "Регистрация",
            checkboxAdmin: true,
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
                {types[type].linkToReg ? (
                    <Link to="signup">
                        <button type="button" className="login__toreg">
                            Еще не имеете аккаунта?
                        </button>
                    </Link>
                ) : null}
                {types[type].checkboxAdmin ? (
                    <div>
                        <input
                            type="checkbox"
                            className="login__checkbox"
                            id="login__checkbox"
                            checked={admin}
                            onChange={handleCheckboxChange}
                        />
                        <label
                            htmlFor="login__checkbox"
                            className="login__checkbox-title"
                        >
                            Вы админ?
                        </label>
                        {admin ? (
                            <input
                                type="text"
                                className="login__input"
                                placeholder="Одноразовый админ-код"
                            />
                        ) : null}
                    </div>
                ) : null}
            </form>
        </>
    );
};

export default LoginForm;
