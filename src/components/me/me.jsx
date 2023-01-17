import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BlogContext } from "../../context/context";
import { fetchAdminEmail } from "../../services/createPort";
import getPostsAuth from "../../services/getPostsAuth";
import logout from "../../services/logout";

import "./me.scss";
import MeGrid from "./meGrid/meGrid";

const Me = () => {
    const [blogState] = useContext(BlogContext);
    const navigate = useNavigate();

    const [user, setUser] = useState({});
    const [contentEnded, setContentEnded] = useState(false);
    const [content, setContent] = useState([]);

    useEffect(() => {
        if (!localStorage.getItem("accessToken")) {
            navigate("/login");
        }
        setUser(JSON.parse(localStorage.getItem("user")));
    }, []);
    useEffect(() => {
        if (user.email) {
            if (blogState.posts.length === 0) {
                const user = JSON.parse(localStorage.getItem("user"));
                getPostsAuth(
                    user.email,
                    localStorage.getItem("accessToken"),
                    user.id
                ).then(setContent);
            } else {
                fetchAdminEmail().then((adminEmail) => {
                    if (adminEmail === user.email) {
                        setContent(blogState.posts);
                    } else {
                        const filtered = blogState.posts.filter(
                            (post) => post.userId === user.id
                        );
                        if (filtered.length) {
                            setContent(filtered);
                        } else {
                            const user = JSON.parse(
                                localStorage.getItem("user")
                            );
                            getPostsAuth(
                                user.email,
                                localStorage.getItem("accessToken"),
                                user.id
                            ).then((res) => {
                                setContent(res);
                                setContentEnded(true);
                            });
                        }
                    }
                });
            }
        }
    }, [user]);

    const handleLoadAllPosts = () => {
        getPostsAuth(
            user.email,
            localStorage.getItem("accessToken"),
            user.id
        ).then((res) => {
            setContent(res);
            setContentEnded(true);
        });
    };

    try {
        return (
            <div className="me">
                <h2 className="me__title">
                    Привет, {user.email}, дорогой друг
                </h2>
                <Link to="create" className="me__create">
                    Создать статью
                </Link>
                <MeGrid content={content} contentEnded={contentEnded} />
                <button
                    style={{ display: !contentEnded ? "block" : "none" }}
                    onClick={handleLoadAllPosts}
                    className="me__more"
                >
                    Дозагрузить все посты
                </button>
            </div>
        );
    } catch {
        logout();
        navigate("/login");
    }
};

export default Me;
