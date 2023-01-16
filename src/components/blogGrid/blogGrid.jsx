import React, { useContext, useEffect, useReducer, useState } from "react";
import getPosts from "../../services/getPosts";
import BigLoading from "../bigLoading/bigLoading";
import BlogCard from "./blogCard/blogCard";
import SelectCount from "./selectCount/selectCount";
import LoadMore from "./loadMore/loadMore";
import { BlogContext } from "../../context/context";
import getCategories from "../../services/getCategories";

import usePrevious from "../../customHooks/usePrevious";

import "./blogGrid.scss";
import logout from "../../services/logout";

const intitialState = {
    loading: false,
    showingPosts: [],
    countOfListingPosts: "9",
    neededPostsToShow: 0,
    listingOfPostsEnded: false,
};

const reducer = (state, action) => {
    switch (action.type) {
        case "START_LOADING":
            return {
                ...state,
                loading: true,
            };
        case "STOP_LOADING":
            return {
                ...state,
                loading: false,
            };
        case "SHOW_POSTS":
            return {
                ...state,
                showingPosts: action.payload,
            };
        case "SET_COUNT":
            return {
                ...state,
                countOfListingPosts: action.payload,
            };
        case "LIST_ENDED":
            return {
                ...state,
                listingOfPostsEnded: true,
            };
        case "CHANGE_NEEDS":
            return {
                ...state,
                neededPostsToShow: action.payload,
            };
        default:
            return state;
    }
};

const BlogGrid = () => {
    const [blogState, dispatch] = useContext(BlogContext);
    const [blogGridState, dispatchGrid] = useReducer(reducer, intitialState);

    const previousCount = usePrevious(blogGridState.countOfListingPosts);

    ///Логика расположения больших элементов на сетке
    let [bigPositions, setBigPositions] = useState();
    useEffect(() => {
        let protoBigPositions = [];
        for (let i = 0; i < blogGridState.showingPosts.length; i = i + 9) {
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
                let divider = i / 9;
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
    }, [blogGridState.showingPosts]);

    useEffect(() => {
        dispatchGrid({
            type: "CHANGE_NEEDS",
            payload: blogGridState.countOfListingPosts,
        });
    }, []);
    useEffect(() => {
        dispatchGrid({ type: "START_LOADING" });
        if (blogState.posts.length === 0) {
            getPosts(0, blogGridState.countOfListingPosts).then((res) => {
                dispatch({ type: "POSTS_LOADED", payload: res });
                dispatchGrid({
                    type: "CHANGE_NEEDS",
                    payload: blogGridState.showingPosts.length + res.length,
                });
            });
        } else if (
            blogState.posts.length >= blogGridState.countOfListingPosts
        ) {
            dispatchGrid({
                type: "CHANGE_NEEDS",
                payload: blogGridState.countOfListingPosts,
            });
        } else {
            getPosts(
                blogState.posts.length,
                blogGridState.countOfListingPosts
            ).then((res) => {
                dispatch({ type: "POSTS_LOADED", payload: res });
                dispatchGrid({
                    type: "CHANGE_NEEDS",
                    payload: blogGridState.showingPosts.length + res.length,
                });
            });
        }

        if (blogState.posts.length === 0) {
            getCategories().then((res) =>
                dispatch({ type: "CATEGORIES_LOADED", payload: res })
            );
        }

        dispatchGrid({ type: "STOP_LOADING" });

        logout();
        dispatch({ type: "LOGOUT" });
    }, []);
    useEffect(() => {
        dispatchGrid({
            type: "SHOW_POSTS",
            payload: blogState.posts.slice(0, blogGridState.neededPostsToShow),
        });
    }, [blogGridState.neededPostsToShow]);
    useEffect(() => {
        if (previousCount) {
            if (
                +blogGridState.countOfListingPosts > previousCount &&
                blogGridState.showingPosts.length <
                    +blogGridState.countOfListingPosts
            ) {
                dispatchGrid({ type: "START_LOADING" });
                if (
                    blogState.posts.length > blogGridState.showingPosts.length
                ) {
                    if (
                        blogState.posts.length >
                        blogGridState.showingPosts.length +
                            +blogGridState.countOfListingPosts
                    ) {
                        dispatchGrid({
                            type: "CHANGE_NEEDS",
                            payload:
                                blogGridState.showingPosts.length +
                                +blogGridState.countOfListingPosts,
                        });
                    } else {
                        getPosts(
                            blogGridState.showingPosts.length,
                            blogGridState.countOfListingPosts
                        ).then((res) => {
                            dispatch({
                                type: "POSTS_LOADED",
                                payload: res,
                            });
                            dispatchGrid({
                                type: "CHANGE_NEEDS",
                                payload:
                                    blogGridState.showingPosts.length +
                                    res.length,
                            });
                        });
                    }
                } else {
                    getPosts(
                        blogState.posts.length,
                        blogGridState.countOfListingPosts
                    ).then((res) => {
                        dispatch({ type: "POSTS_LOADED", payload: res });
                        dispatchGrid({
                            type: "CHANGE_NEEDS",
                            payload:
                                blogGridState.showingPosts.length + res.length,
                        });
                    });
                }
                dispatchGrid({ type: "STOP_LOADING" });
            }
        }
    }, [blogGridState.countOfListingPosts]);

    const handleChangeCountPosts = (count) => {
        dispatchGrid({ type: "SET_COUNT", payload: count });
    };

    const loadMorePosts = () => {
        dispatchGrid({ type: "START_LOADING" });
        if (blogState.posts.length > blogGridState.showingPosts.length) {
            if (
                blogState.posts.length >
                blogGridState.showingPosts.length +
                    blogGridState.countOfListingPosts
            ) {
                dispatchGrid({
                    type: "SHOW_POSTS",
                    payload: blogState.posts.slice(
                        blogGridState.showingPosts.length,
                        blogGridState.showingPosts.length +
                            blogGridState.countOfListingPosts
                    ),
                });
            } else {
                getPosts(
                    blogState.posts.length,
                    blogGridState.showingPosts.length +
                        blogGridState.countOfListingPosts
                )
                    .then((res) => {
                        if (
                            res.length <
                            blogGridState.showingPosts.length +
                                blogGridState.countOfListingPosts -
                                blogState.posts.length
                        ) {
                            dispatchGrid({ type: "LIST_ENDED" });
                        }
                        return res;
                    })
                    .then((res) => {
                        dispatch({
                            type: "POSTS_LOADED",
                            payload: res,
                        });
                        dispatchGrid({
                            type: "CHANGE_NEEDS",
                            payload:
                                blogGridState.showingPosts.length + res.length,
                        });
                    });
            }
        } else {
            getPosts(
                blogState.posts.length,
                blogState.posts.length + +blogGridState.countOfListingPosts
            ).then((res) => {
                dispatch({ type: "POSTS_LOADED", payload: res });
                dispatchGrid({
                    type: "CHANGE_NEEDS",
                    payload: blogGridState.showingPosts.length + res.length,
                });
            });
        }
        dispatchGrid({ type: "STOP_LOADING" });
    };

    return (
        <>
            <SelectCount
                count={blogGridState.countOfListingPosts}
                onChange={handleChangeCountPosts}
            />
            {!blogGridState.showingPosts.length || blogGridState.loading ? (
                <BigLoading />
            ) : (
                <div className="blog-grid">
                    {[...blogGridState.showingPosts].map((post, i) => {
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
                                        : (i + 1) % 9 === 0 && bigPositions
                                        ? bigPositions[(i + 1) / 9]
                                        : null
                                }
                            />
                        );
                    })}
                </div>
            )}

            {blogGridState.showingPosts &&
            !blogGridState.listingOfPostsEnded ? (
                <LoadMore onClick={loadMorePosts} />
            ) : null}
        </>
    );
};

export default BlogGrid;
