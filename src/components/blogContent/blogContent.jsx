import React from "react";

import { useParams } from "react-router";
import { fetchPost } from "../../api";

import BlogTitle from "../blogTitle/blogTitle";
import BlogPosts from "../blogPosts/blogPosts";
import BlogPost from "../blogPost/blogPost";

import "./blogContent.scss";

const BlogContent = ({ page }) => {
    let params = useParams();
    switch (page) {
        case "Статьи":
            let postNum = +params.postId;

            if (postNum) {
                let postContent = fetchPost(postNum);
                if (!postContent) {
                    return (
                        <>
                            <h2>Некорретный запрос к номеру поста</h2>
                            <h5>Возможно, такого поста еще не существует</h5>
                        </>
                    );
                } else {
                    return (
                        <div className="blog__content">
                            <BlogTitle text={postContent.title} />
                            <BlogPost content={postContent} />
                        </div>
                    );
                }
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
