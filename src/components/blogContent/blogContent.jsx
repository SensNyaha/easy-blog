import React from "react";

import { useParams } from "react-router";

import BlogTitle from "../blogTitle/blogTitle";
import BlogPosts from "../blogPosts/blogPosts";
import BlogPostWrapper from "../blogPostWrapper/blogPostWrapper";

import "./blogContent.scss";

const BlogContent = ({ page }) => {
    let params = useParams();
    switch (page) {
        case "Статьи":
            let postNum = +params.postId;

            if (postNum) {
                return <BlogPostWrapper postNum={postNum} />;
            }

            return (
                <div className="blog__content">
                    <BlogTitle text={"Статьи"} />
                    <BlogPosts />
                </div>
            );
        default:
            return <h1>Такая страница не доступна</h1>;
    }
};

export default BlogContent;
