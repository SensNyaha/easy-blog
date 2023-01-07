import React, { useEffect, useState } from "react";
import { fetchCountOfPosts } from "../../api";
import usePrevious from "../../customHooks/usePrevious";
import Loading from "../loading/loading";

import BlogPostsItem from "./blogPostsItem/blogPostsItem";

import "./blogPosts.scss";

const BlogPosts = () => {
    let [count, setCount] = useState(3);
    let [startIndex, setStartIndex] = useState(0);
    let [content, setContent] = useState([]);
    let [ended, setEnded] = useState(false);
    let [loading, setLoading] = useState(false);
    let [maxLoadedPosts, setMaxLoadedPosts] = useState(0);

    let handleSelectChange = ({ target }) => {
        setStartIndex(0);
        setCount(+target.value);
    };

    let handleMoreButton = () => {
        setLoading(true);
        fetchCountOfPosts(startIndex, startIndex + count)
            .then(({ content, ended }) => {
                setContent((prevContent) => {
                    return [...prevContent, ...content];
                });
                setEnded(ended);
            })
            .then(() => setLoading(false));
    };

    let previousCount = usePrevious(count);

    useEffect(() => {
        setStartIndex(content.length);
        if (content.length > maxLoadedPosts) {
            setMaxLoadedPosts(content.length);
        }
        if (maxLoadedPosts > content.length - 1) {
            setEnded(false);
        }
    }, [content]);

    useEffect(() => {
        if ((!previousCount || previousCount < count) && !ended) {
            setLoading(true);
            fetchCountOfPosts(startIndex, startIndex + count)
                .then(({ content, ended }) => {
                    setContent(content);
                    setEnded(ended);
                })
                .then(() => setLoading(false));
        } else if (previousCount > count) {
            setContent((prevContent) => [...prevContent].slice(0, count));
        }
    }, [count]);

    return (
        <>
            <select
                name="countOfPosts"
                className="blog__select"
                value={count}
                onChange={handleSelectChange}
            >
                <option value={3}>По 3 статьи</option>
                <option value={6}>По 6 статей</option>
                <option value={20}>По 20 статей</option>
            </select>
            <div className="blog__posts">
                {content.map(({ id }) => {
                    return <BlogPostsItem content={content} id={id} key={id} />;
                })}
            </div>
            {loading ? <Loading /> : null}
            {!ended && !loading ? (
                <button className="blog__more" onClick={handleMoreButton}>
                    Загрузить еще
                </button>
            ) : null}
        </>
    );
};

export default BlogPosts;
