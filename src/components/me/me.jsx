import React, { useEffect, useState } from "react";
import getPostsAuth from "../../services/getPostsAuth";

const Me = () => {
    const [user, setUser] = useState({});
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        setUser(JSON.parse(localStorage.getItem("user")));
    }, []);
    useEffect(() => {
        if (user.email === "mwmakarov@bk.ru") {
            setIsAdmin(true);
        }
    }, [user]);

    useEffect(() => {
        if (isAdmin) {
            getPostsAuth(
                0,
                20,
                "admin",
                localStorage.getItem("accessToken")
            ).then(console.log);
        }
    });
    return <div className="me">{user.email}</div>;
};

export default Me;
