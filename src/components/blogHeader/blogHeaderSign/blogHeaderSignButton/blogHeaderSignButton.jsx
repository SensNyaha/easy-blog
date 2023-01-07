import React from "react";

import { Link } from "react-router-dom";

import "./blogHeaderSignButton.scss";

const BlogHeaderSignButton = ({ to, text }) => {
    return (
        <button className="blog__header-button">
            <Link to={to} className="blog__header-link">
                {text}
            </Link>
        </button>
    );
};

export default BlogHeaderSignButton;
