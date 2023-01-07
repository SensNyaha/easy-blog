import React, { useEffect, useState } from "react";
import { fetchPost } from "../../api";
import BlogPost from "../blogPost/blogPost";
import BlogTitle from "../blogTitle/blogTitle";
import Loading from "../loading/loading";

const BlogPostWrapper = ({ postNum }) => {
    let [loading, setLoading] = useState(false);
    let [content, setContent] = useState(null);
    let [error, setError] = useState(false);

    useEffect(() => {
        setLoading(true);
        fetchPost(postNum)
            .then((res) => setContent(res))
            .then(() => setLoading(false))
            .catch(() => setError(true));
    }, [postNum]);

    if (error) {
        return (
            <>
                <h2>Некорретный запрос к номеру поста</h2>
                <h5>Возможно, такого поста еще не существует</h5>
            </>
        );
    }
    if (loading) {
        return <Loading />;
    }
    if (content) {
        return (
            <div className="blog__content">
                <BlogTitle text={content.title} />
                <BlogPost content={content} />
            </div>
        );
    }
};

export default BlogPostWrapper;
