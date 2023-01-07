import React from "react";

import BlogHeaderSignButton from "./blogHeaderSignButton/blogHeaderSignButton";

import "./blogHeaderSign.scss";

const BlogHeaderSign = () => {
    return (
        <div className="blog__header-sign">
            <BlogHeaderSignButton to="/login-panel" text={"Вход"} />
            /
            <BlogHeaderSignButton
                to="/login-panel/signup"
                text={"Регистрация"}
            />
        </div>
    );
};

export default BlogHeaderSign;
