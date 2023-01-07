import React from "react";

import BlogHeaderTitle from "./blogHeaderTitle/blogHeaderTitle";
import BlogHeaderSign from "./blogHeaderSign/blogHeaderSign";

import "./blogHeader.scss";

const BlogHeader = () => {
    return (
        <header className="blog__header">
            <BlogHeaderTitle text={"Наш блог"} />
            <BlogHeaderSign />
        </header>
    );
};

export default BlogHeader;
