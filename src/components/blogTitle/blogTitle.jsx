import React from "react";

import "./blogTitle.scss";

const BlogTitle = ({ text }) => {
    return <h1 className="blog__title">{text}</h1>;
};

export default BlogTitle;
