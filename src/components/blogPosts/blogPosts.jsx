import React, { useEffect, useState } from "react";
import { fetchAllPosts, fetchCountOfPosts } from "../../api";

import BlogPostsItem from "./blogPostsItem/blogPostsItem";

import "./blogPosts.scss";

const BlogPosts = () => {
    let [count, setCount] = useState("3");
    let [startIndex, setStartIndex] = useState(0);
    let [content, setContent] = useState([]);
    let [ended, setEnded] = useState(false);

    let handleSelectChange = ({ target }) => {
        setStartIndex(0);
        setCount(target.value);
    };

    let handleMoreButton = () => {
        const fetched = fetchCountOfPosts(startIndex, startIndex + +count);
        setContent((prevContent) => {
            return [...prevContent, ...fetched.content];
        });
        setEnded(fetched.ended);
    };

    useEffect(() => {
        if (count === "all") {
            setContent(fetchAllPosts());
            setEnded(true);
        } else {
            const fetched = fetchCountOfPosts(startIndex, startIndex + +count);
            setContent(fetched.content);
            setEnded(fetched.ended);
        }
    }, [count]);

    useEffect(() => {
        setStartIndex(content.length);
    }, [content]);

    return (
        <>
            <select
                name="countOfPosts"
                className="blog__select"
                value={count}
                onChange={handleSelectChange}
            >
                <option value="3">По 3 статьи</option>
                <option value="6">По 6 статей</option>
                <option value="all">Все сразу</option>
            </select>
            <div className="blog__posts">
                {content.map(({ id }) => {
                    return <BlogPostsItem content={content} id={id} key={id} />;
                })}
            </div>
            {!ended ? (
                <button className="blog__more" onClick={handleMoreButton}>
                    Загрузить еще
                </button>
            ) : null}
        </>
    );
};

export default BlogPosts;
