import React from "react";

import "./blogPostsItem.scss";
import BlogPostsItemTitle from "./blogPostsItemTitle/blogPostsItemTitle";
import BlogPostsItemDescr from "./blogPostsItemDescr/blogPostsItemDescr";
import Button from "../../button/button";

const BlogPostsItem = ({ id, content }) => {
    const { title, description, thumbnail } = content.find(
        (elem) => elem.id === id
    );
    return (
        <h1 className="blog__posts-item">
            <BlogPostsItemTitle text={title} />
            <BlogPostsItemDescr text={description} />
            <Button action={"postopen"} to={`/posts/${id}`} text={"Открыть"} />

            <img
                src={thumbnail}
                alt="thumbnail"
                className="blog__post-thumbnail"
            />
        </h1>
    );
};

export default BlogPostsItem;
