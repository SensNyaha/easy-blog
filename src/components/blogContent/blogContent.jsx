import React from "react";

import { useParams } from "react-router";

import BlogTitle from "../blogTitle/blogTitle";
import BlogPosts from "../blogPosts/blogPosts";
import BlogPost from "../blogPost/blogPost";

import "./blogContent.scss";

const BlogContent = ({ page, content }) => {
    let params = useParams();
    switch (page) {
        case "Статьи":
            let postNum = +params.postId;

            if (postNum) {
                if (!content.some((post) => post.id === postNum)) {
                    return (
                        <>
                            <h2>Некорретный запрос к номеру поста</h2>
                            <h5>Возможно, такого поста еще не существует</h5>
                        </>
                    );
                } else {
                    return (
                        <div className="blog__content">
                            <BlogTitle text={content[postNum - 1].title} />
                            <BlogPost content={content[postNum - 1]} />
                        </div>
                    );
                }
            }

            return (
                <div className="blog__content">
                    <BlogTitle text={"Статьи"} />
                    <BlogPosts content={content} />
                </div>
            );
        default:
            return <h1>Такая страница не доступна</h1>;
    }
};

export default BlogContent;
