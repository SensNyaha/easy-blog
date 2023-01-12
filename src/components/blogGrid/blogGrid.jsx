import React, { useEffect, useState } from "react";
import getPosts from "../../services/getPosts";
import BigLoading from "../bigLoading/bigLoading";
import BlogCard from "./blogCard/blogCard";

import usePrevious from "../../customHooks/usePrevious";

import "./blogGrid.scss";
import SelectCount from "./selectCount/selectCount";
import LoadMore from "./loadMore/loadMore";

const BlogGrid = ({ onChangeLogged }) => {
    let [posts, setPosts] = useState([]);
    let [countOfPosts, setCountOfPosts] = useState("9");
    let [loading, setLoading] = useState(false);
    let [error, setError] = useState(false);
    let [ended, setEnded] = useState(false);

    let previousCount = usePrevious(countOfPosts);

    ///Логика расположения больших элементов на сетке
    let [bigPositions, setBigPositions] = useState();
    useEffect(() => {
        let protoBigPositions = [];
        for (let i = 0; i < posts.length; i = i + 11) {
            if (i === 0) {
                protoBigPositions.push({ col: "1/3", row: "1/3" });
            } else {
                let newPositionRow = protoBigPositions[
                    protoBigPositions.length - 1
                ].row
                    .split("/")
                    .map((point) => +point + 3)
                    .join("/");
                let newPositionCol;

                let divider = (i + 1) / 12;

                if (divider % 2 === 1) {
                    newPositionCol = "3/5";
                } else {
                    newPositionCol = "1/3";
                }
                let newBigPositions = {
                    col: newPositionCol,
                    row: newPositionRow,
                };

                protoBigPositions.push(newBigPositions);
            }
        }
        setBigPositions(protoBigPositions);
    }, [posts]);

    useEffect(() => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
    }, []);
    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            getPosts(posts.length, countOfPosts)
                .then((res) => setPosts(res))
                .then(() => setLoading(false))
                .catch((err) => console.log(err));
        }, 1000);
    }, []);

    useEffect(() => {
        if (previousCount) {
            if (+countOfPosts > previousCount && posts.length < countOfPosts) {
                setLoading(true);
                setTimeout(() => {
                    getPosts(posts.length, countOfPosts)
                        .then((res) => {
                            if (res.length + posts.length < countOfPosts) {
                                setEnded(true);
                            }
                            return res;
                        })
                        .then((res) => setPosts((prev) => [...prev, ...res]))
                        .then(() => setLoading(false))
                        .catch((err) => console.log(err));
                }, 1000);
            }
        }
    }, [countOfPosts]);

    const handleChangeCountPosts = (count) => {
        setCountOfPosts(count);
    };

    const loadMorePosts = () => {
        setLoading(true);
        setTimeout(() => {
            getPosts(posts.length, posts.length + +countOfPosts)
                .then((res) => {
                    if (res.length < countOfPosts) {
                        setEnded(true);
                    }
                    return res;
                })
                .then((res) => setPosts((prev) => [...prev, ...res]))
                .then(() => setLoading(false))
                .catch((err) => console.log(err));
        }, 1000);
    };

    return (
        <>
            {loading ? <BigLoading /> : null}
            <SelectCount
                count={countOfPosts}
                onChange={handleChangeCountPosts}
            />
            <div className="blog-grid">
                {[...posts].map((post, i) => {
                    return (
                        <BlogCard
                            key={post.id}
                            {...post}
                            bigStyles={
                                i === 0 && bigPositions
                                    ? bigPositions[i]
                                    : (i + 1) % 12 === 0 && bigPositions
                                    ? bigPositions[(i + 1) / 12]
                                    : null
                            }
                        />
                    );
                })}
            </div>
            {posts.length && !ended ? (
                <LoadMore onClick={loadMorePosts} />
            ) : null}
        </>
    );
};

export default BlogGrid;
