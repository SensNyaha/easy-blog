import React from "react";

import BlogPostsItem from "./blogPostsItem/blogPostsItem";

import "./blogPosts.scss";

const BlogPosts = ({ content }) => {
    return (
        <div className="blog__posts">
            {content.map(({ id }) => {
                return <BlogPostsItem content={content} id={id} key={id} />;
            })}
        </div>
    );
};

export default BlogPosts;
