import React from "react";

import "./blogHeaderTitle.scss";

const BlogHeaderTitle = ({ text }) => {
    return <h1 className="blog__header-title">{text}</h1>;
};

export default BlogHeaderTitle;
