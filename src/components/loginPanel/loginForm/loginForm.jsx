import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isAuthOK, isRegOK } from "../../../api";
import Sending from "../../sending/sending";

import "./loginForm.scss";

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

const LoginForm = ({ type }) => {
    let [formContent, setFormContent] = useState({
        login: "",
        password: "",
        isAdmin: false,
        adminCode: "",
    });
    let [authStatus, setAuthStatus] = useState({});
    let [registeredStatus, setRegisteredStatus] = useState({});
    let [sending, setSending] = useState(false);
    let [errored, setErrored] = useState(false);
    let [successReg, setSuccessReg] = useState(false);

    let navigate = useNavigate();

    const handleCheckboxChange = () => {
        setFormContent((prevState) => ({
            ...prevState,
            isAdmin: !prevState.isAdmin,
        }));
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        const auth = {
            login: formContent.login,
            password: formContent.password,
            isAdmin: formContent.isAdmin,
        };
        setSending(true);
        setErrored(false);
        setSuccessReg(false);

        if (type === "signin") {
            isAuthOK(auth)
                .then((res) => {
                    setAuthStatus(res);
                })
                .catch((res) => {
                    setAuthStatus(res);
                    setErrored(true);
                })
                .finally(() => setSending(false));
        } else if (type === "signup") {
            isRegOK(auth)
                .then((res) => {
                    setRegisteredStatus(res);
                    setSuccessReg(true);
                })
                .catch((res) => {
                    setRegisteredStatus(res);
                    setErrored(true);
                })
                .finally(() => {
                    setSending(false);
                    setFormContent({
                        login: "",
                        password: "",
                        isAdmin: false,
                        adminCode: "",
                    });
                });
        }
    };

    useEffect(() => {
        setErrored(false);
    }, [type]);
    useEffect(() => {
        if (authStatus.verified) {
            navigate(`/user/${authStatus.code}`);
        }
    }, [authStatus]);

    return (
        <>
            <form className="login__form" onSubmit={handleSubmit}>
                <h5 className="login__title">{types[type].title}</h5>
                <input
                    type="text"
                    className="login__input"
                    placeholder="Логин"
                    value={formContent.login}
                    onChange={({ target }) =>
                        setFormContent((prevContent) => ({
                            ...prevContent,
                            login: target.value,
                        }))
                    }
                    required
                />
                <input
                    type="password"
                    className="login__input"
                    placeholder="Пароль"
                    value={formContent.password}
                    onChange={({ target }) =>
                        setFormContent((prevContent) => ({
                            ...prevContent,
                            password: target.value,
                        }))
                    }
                    required
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
                            checked={formContent.isAdmin}
                            onChange={handleCheckboxChange}
                        />
                        <label
                            htmlFor="login__checkbox"
                            className="login__checkbox-title"
                        >
                            Вы админ?
                        </label>
                        {formContent.isAdmin ? (
                            <input
                                type="text"
                                className="login__input"
                                placeholder="Одноразовый админ-код"
                                value={formContent.adminCode}
                                onChange={({ target }) =>
                                    setFormContent((prevContent) => ({
                                        ...prevContent,
                                        adminCode: target.value,
                                    }))
                                }
                            />
                        ) : null}
                    </div>
                ) : null}
                {sending ? <Sending /> : null}
                {errored ? (
                    <div className="login__error">
                        {authStatus.reason || registeredStatus.reason}
                    </div>
                ) : null}
                {successReg ? (
                    <div className="login__info">
                        Вы успешно зарегистрировали аккаунт в статусе
                        {registeredStatus.isAdmin
                            ? " администратора"
                            : " пользователя"}
                        .
                        <br />
                        Мы сохранили всю требуемую информацию о Вас.
                        Производится формирование личного кабинета.
                        <br />
                        Можете воспользоваться демо-функционалом администратора,
                        войдя в систему через admin/admin
                    </div>
                ) : null}
            </form>
        </>
    );
};

export default LoginForm;
