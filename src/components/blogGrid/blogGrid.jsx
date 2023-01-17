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
    const [{ posts, categories }, dispatch] = useContext(BlogContext);
    const [blogGridState, dispatchGrid] = useReducer(reducer, intitialState);

    const {
        loading,
        showingPosts,
        countOfListingPosts,
        neededPostsToShow,
        listingOfPostsEnded,
    } = blogGridState;

    const previousCount = usePrevious(blogGridState.countOfListingPosts);

    ///Логика расположения больших элементов на сетке
    let [bigPositions, setBigPositions] = useState();
    useEffect(() => {
        let protoBigPositions = [];
        for (let i = 0; i < showingPosts.length; i = i + 9) {
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
    }, [showingPosts]);

    useEffect(() => {
        dispatchGrid({
            type: "CHANGE_NEEDS",
            payload: countOfListingPosts,
        });
    }, []);
    useEffect(() => {
        dispatchGrid({ type: "START_LOADING" });
        if (posts.length === 0) {
            getPosts(0, countOfListingPosts).then((res) => {
                dispatch({ type: "POSTS_LOADED", payload: res });
                dispatchGrid({
                    type: "CHANGE_NEEDS",
                    payload: showingPosts.length + res.length,
                });
            });
        } else if (posts.length >= countOfListingPosts) {
            dispatchGrid({
                type: "CHANGE_NEEDS",
                payload: countOfListingPosts,
            });
        } else {
            getPosts(posts.length, countOfListingPosts).then((res) => {
                dispatch({ type: "POSTS_LOADED", payload: res });
                dispatchGrid({
                    type: "CHANGE_NEEDS",
                    payload: showingPosts.length + res.length,
                });
            });
        }

        if (posts.length === 0) {
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
            payload: posts.slice(0, neededPostsToShow),
        });
    }, [neededPostsToShow]);
    useEffect(() => {
        if (previousCount) {
            if (
                +countOfListingPosts > previousCount &&
                showingPosts.length < +countOfListingPosts
            ) {
                dispatchGrid({ type: "START_LOADING" });
                if (posts.length > showingPosts.length) {
                    if (
                        posts.length >
                        showingPosts.length + +countOfListingPosts
                    ) {
                        dispatchGrid({
                            type: "CHANGE_NEEDS",
                            payload: showingPosts.length + +countOfListingPosts,
                        });
                    } else {
                        getPosts(showingPosts.length, countOfListingPosts).then(
                            (res) => {
                                dispatch({
                                    type: "POSTS_LOADED",
                                    payload: res,
                                });
                                dispatchGrid({
                                    type: "CHANGE_NEEDS",
                                    payload: showingPosts.length + res.length,
                                });
                            }
                        );
                    }
                } else {
                    getPosts(posts.length, countOfListingPosts).then((res) => {
                        dispatch({ type: "POSTS_LOADED", payload: res });
                        dispatchGrid({
                            type: "CHANGE_NEEDS",
                            payload: showingPosts.length + res.length,
                        });
                    });
                }
                dispatchGrid({ type: "STOP_LOADING" });
            }
        }
    }, [countOfListingPosts]);

    const handleChangeCountPosts = (count) => {
        dispatchGrid({ type: "SET_COUNT", payload: count });
    };

    const loadMorePosts = () => {
        dispatchGrid({ type: "START_LOADING" });
        if (posts.length > showingPosts.length) {
            if (posts.length > showingPosts.length + +countOfListingPosts) {
                dispatchGrid({
                    type: "CHANGE_NEEDS",
                    payload: showingPosts.length + +countOfListingPosts,
                });
            } else {
                getPosts(
                    posts.length,
                    showingPosts.length + +countOfListingPosts
                )
                    .then((res) => {
                        if (res.length < countOfListingPosts) {
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
                            payload: showingPosts.length + res.length,
                        });
                    });
            }
        } else {
            getPosts(posts.length, posts.length + +countOfListingPosts)
                .then((res) => {
                    if (res.length < +countOfListingPosts) {
                        dispatchGrid({ type: "LIST_ENDED" });
                    }
                    return res;
                })
                .then((res) => {
                    dispatch({ type: "POSTS_LOADED", payload: res });
                    dispatchGrid({
                        type: "CHANGE_NEEDS",
                        payload: showingPosts.length + res.length,
                    });
                });
        }
        dispatchGrid({ type: "STOP_LOADING" });
    };

    return (
        <>
            <SelectCount
                count={countOfListingPosts}
                onChange={handleChangeCountPosts}
            />
            {!showingPosts.length || loading ? (
                <BigLoading />
            ) : (
                <div className="blog-grid">
                    {[...showingPosts].map((post, i) => {
                        return (
                            <BlogCard
                                key={post.id}
                                {...post}
                                categoryStyles={{
                                    ...categories.find(
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

            {showingPosts && !listingOfPostsEnded ? (
                <LoadMore onClick={loadMorePosts} />
            ) : null}
        </>
    );
};

export default BlogGrid;
