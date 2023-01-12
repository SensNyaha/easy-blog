import React, { useEffect, useState } from "react";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import getPostsAuth from "../../services/getPostsAuth";
import logout from "../../services/logout";
import EditPost from "../editPost/editPost";

import "./me.scss";
import MeGrid from "./meGrid/meGrid";

const Me = () => {
    const navigate = useNavigate();

    const [user, setUser] = useState({});
    const [isAdmin, setIsAdmin] = useState(false);
    const [content, setContent] = useState(null);

    useEffect(() => {
        if (!localStorage.getItem("accessToken")) {
            navigate("/login");
        }
        setUser(JSON.parse(localStorage.getItem("user")));
    }, []);
    useEffect(() => {
        if (user.email === "admin@admin.admin") {
            setIsAdmin(true);
        }
    }, [user]);
    useEffect(() => {
        if (isAdmin) {
            getPostsAuth(
                "admin",
                localStorage.getItem("accessToken"),
                user.id
            ).then(setContent);
        }
    }, [isAdmin]);
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
