import React from "react";

import BlogHeaderSignButton from "./blogHeaderSignButton/blogHeaderSignButton";

import "./blogHeaderSign.scss";

const BlogHeaderSign = () => {
    return (
        <div className="blog__header-sign">
            <BlogHeaderSignButton to="/signup" text={"Вход"} />
            /
            <BlogHeaderSignButton to="/signin" text={"Регистрация"} />
        </div>
    );
};

export default BlogHeaderSign;
