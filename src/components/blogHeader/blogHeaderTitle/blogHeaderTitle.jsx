import React from "react";
import { Link } from "react-router-dom";

import "./blogHeaderTitle.scss";

const BlogHeaderTitle = ({ text }) => {
    return (
        <Link to="/" className="blog__header-title">
            {text}
        </Link>
    );
};

export default BlogHeaderTitle;
