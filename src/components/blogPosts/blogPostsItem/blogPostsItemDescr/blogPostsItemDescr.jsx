import React from "react";

import "./blogPostsItemDescr.scss";

const BlogPostsItemDescr = ({ text }) => {
    if (text) {
        return (
            <div className="blog__posts-item-descr">
                {text.length > 350 ? text.slice(0, 348) + "..." : text}
            </div>
        );
    }
};

export default BlogPostsItemDescr;
