import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import getPostsAuth from "../../services/getPostsAuth";
import logout from "../../services/logout";

import "./me.scss";
import MeGrid from "./meGrid/meGrid";

const Me = () => {
    const navigate = useNavigate();

    const [user, setUser] = useState({});
    const [content, setContent] = useState(null);

    useEffect(() => {
        if (!localStorage.getItem("accessToken")) {
            navigate("/login");
        }
        setUser(JSON.parse(localStorage.getItem("user")));
    }, []);
    useEffect(() => {
        getPostsAuth(
            JSON.parse(localStorage.getItem("user")).email,
            localStorage.getItem("accessToken"),
            user.id
        ).then(setContent);
    }, []);
    try {
        return (
            <div className="me">
                <h2 className="me__title">
                    Привет, {user.email}, дорогой друг
                </h2>
                <Link to="create" className="me__create">
                    Создать статью
                </Link>
                <MeGrid content={content} />
            </div>
        );
    } catch {
        logout();
        navigate("/login");
    }
};

export default Me;
