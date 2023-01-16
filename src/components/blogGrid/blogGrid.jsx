import React, { useContext, useEffect, useState } from "react";
import getPosts from "../../services/getPosts";
import BigLoading from "../bigLoading/bigLoading";
import BlogCard from "./blogCard/blogCard";
import SelectCount from "./selectCount/selectCount";
import LoadMore from "./loadMore/loadMore";

import usePrevious from "../../customHooks/usePrevious";
// import getCategories from "../../services/getCategories";

import "./blogGrid.scss";
import { BlogContext } from "../../context/context";
import logout from "../../services/logout";

const BlogGrid = () => {
    const [blogState, dispatch] = useContext(BlogContext);

    let [loading, setLoading] = useState(false);
    // let [ended, setEnded] = useState(false);

    let previousCount = usePrevious(blogState.countOfListingPosts);

    ///Логика расположения больших элементов на сетке
    let [bigPositions, setBigPositions] = useState();
    useEffect(() => {
        let protoBigPositions = [];
        for (let i = 0; i < blogState.posts.length; i = i + 11) {
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
    }, [blogState.posts]);

    useEffect(() => {
        logout();
    }, []);

    useEffect(() => {
        if (previousCount) {
            if (
                +blogState.countOfListingPosts > previousCount &&
                blogState.posts.length < blogState.countOfListingPosts
            ) {
                setLoading(true);
                setTimeout(() => {
                    getPosts(
                        blogState.posts.length,
                        blogState.countOfListingPosts
                    )
                        .then((res) => {
                            if (
                                res.length + blogState.posts.length <
                                blogState.countOfListingPosts
                            ) {
                                dispatch({ type: "LISTING_ENDED" });
                            }
                            return res;
                        })
                        .then((res) =>
                            dispatch({ type: "POSTS_LOADED", payload: res })
                        )
                        .then(() => setLoading(false))
                        .catch((err) => console.log(err));
                }, 1000);
            }
        }
    }, [blogState.countOfListingPosts]);

    const handleChangeCountPosts = (count) => {
        dispatch({ type: "COUNT_OF_POSTS_CHANGED", payload: count });
    };

    const loadMorePosts = () => {
        setLoading(true);
        setTimeout(() => {
            getPosts(
                blogState.posts.length,
                blogState.posts.length + +blogState.countOfListingPosts
            )
                .then((res) => {
                    if (res.length < blogState.countOfListingPosts) {
                        dispatch({ type: "LISTING_ENDED" });
                    }
                    return res;
                })
                .then((res) => dispatch({ type: "POSTS_LOADED", payload: res }))
                .then(() => setLoading(false))
                .catch((err) => console.log(err));
        }, 1000);
    };

    return (
        <>
            {blogState.posts.length === 0 || loading ? <BigLoading /> : null}
            <SelectCount
                count={blogState.countOfListingPosts}
                onChange={handleChangeCountPosts}
            />
            <div className="blog-grid">
                {[...blogState.posts].map((post, i) => {
                    return (
                        <BlogCard
                            key={post.id}
                            {...post}
                            categoryStyles={{
                                ...blogState.categories.find(
                                    (cat) => cat.name === post.category
                                ),
                            }}
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
            {blogState.posts.length && !blogState.listingOfPostsEnded ? (
                <LoadMore onClick={loadMorePosts} />
            ) : null}
        </>
    );
};

export default BlogGrid;
