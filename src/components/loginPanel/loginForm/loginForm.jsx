import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isAuthOK } from "../../../api";
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
        admin: false,
    });
    let [authStatus, setAuthStatus] = useState({});
    let [sending, setSending] = useState(false);

    let navigate = useNavigate();

    let loginRef = useRef();
    let passwordRef = useRef();

    const handleCheckboxChange = () => {
        setFormContent((prevState) => ({
            ...prevState,
            admin: !prevState.admin,
        }));
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        const auth = {
            login: loginRef.current.value,
            password: passwordRef.current.value,
        };
        setSending(true);

        if (type === "signin") {
            isAuthOK(auth)
                .then((res) => {
                    setAuthStatus(res);
                })
                .catch((res) => {
                    setAuthStatus(res);
                })
                .finally(() => setSending(false));
        }
    };

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
                    onChange={({ target }) =>
                        setFormContent((prevContent) => ({
                            ...prevContent,
                            login: target.value,
                        }))
                    }
                    ref={loginRef}
                    required
                />
                <input
                    type="password"
                    className="login__input"
                    placeholder="Пароль"
                    onChange={({ target }) =>
                        setFormContent((prevContent) => ({
                            ...prevContent,
                            password: target.value,
                        }))
                    }
                    ref={passwordRef}
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
                            checked={formContent.admin}
                            onChange={handleCheckboxChange}
                        />
                        <label
                            htmlFor="login__checkbox"
                            className="login__checkbox-title"
                        >
                            Вы админ?
                        </label>
                        {formContent.admin ? (
                            <input
                                type="text"
                                className="login__input"
                                placeholder="Одноразовый админ-код"
                            />
                        ) : null}
                    </div>
                ) : null}
                {sending ? <Sending /> : null}
            </form>
        </>
    );
};

export default LoginForm;
