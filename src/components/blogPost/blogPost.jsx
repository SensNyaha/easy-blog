import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import parseBlogText from "../../services/parseBlogText";

import BigLoading from "../bigLoading/bigLoading";

import "./blogPost.scss";
import { Link } from "react-router-dom";
import { BlogContext } from "../../context/context";
import logout from "../../services/logout";
import getPosts from "../../services/getPosts";
import getCategories from "../../services/getCategories";

const BlogPost = () => {
    const [blogState, dispatch] = useContext(BlogContext);
    const { postId } = useParams();
    const navigate = useNavigate();

    const [currentPost, setCurrentPost] = useState({});
    const [categoryStyles, setCategoryStyles] = useState({});

    if (postId === undefined) {
        navigate("/");
    }

    const [loading, setLoading] = useState(false);
    const [wrongId, setWrongId] = useState(false);
    // const [nextprev, setNextprev] = useState({ prev: null, next: null });

    useEffect(() => {
        if (!blogState.categories.length) {
            getCategories().then((res) =>
                dispatch({ type: "CATEGORIES_LOADED", payload: res })
            );
        }

        logout();
        dispatch({ type: "LOGOUT" });
    }, []);

    useEffect(() => {
        setLoading(true);
        if (blogState.posts.length === 0) {
            getPosts(blogState.posts.length, blogState.posts.length + 50)
                .then((res) => {
                    if (res.length < 50) {
                        dispatch({ type: "ALL_POSTS_LOADED" });
                        setWrongId(true);
                        throw new Error("Post didnt find");
                    } else {
                        return res;
                    }
                })
                .then((res) => dispatch({ type: "POSTS_LOADED", payload: res }))
                .catch((err) => console.log(err.message))
                .finally(() => setLoading(false));
        }
    }, []);
    useEffect(() => {
        setLoading(true);
        const post = blogState.posts.find((post) => post.id === postId);
        if (post) {
            setCurrentPost(post);
            setLoading(false);
        } else {
            getPosts(blogState.posts.length, blogState.posts.length + 50)
                .then((res) => {
                    if (res.length < 50) {
                        dispatch({ type: "ALL_POSTS_LOADED" });
                        setWrongId(true);
                        throw new Error("Post didnt find");
                    } else {
                        return res;
                    }
                })
                .then((res) => dispatch({ type: "POSTS_LOADED", payload: res }))
                .catch((err) => dispatch({ type: "ALL_POSTS_LOADED" }))
                .finally(() => setLoading(false));
        }
    }, [blogState.posts]);

    useEffect(() => {
        if (currentPost.category) {
            const catStyle = blogState.categories.find(
                (cat) => cat.name === currentPost.category
            );

            setCategoryStyles(catStyle);
        }
    }, [currentPost.category]);

    ///ЗДЕСЬ СНАЧАЛА ПРОЙДЕМ ПО ТОМУ ЧТО ИМЕЕМ, если не найдем в массиве, подгрузим еще и сохраним сохраненное в blogState, там пошарим и в цикле пойдем, если пост - последний в БД то следующей кнопки не будет, если первый то предыдущий =  главная страница
    // useEffect(() => {
    //     getAllPosts().then((res) => {
    //         if (Array.isArray(res)) {
    //             let index = res.findLastIndex((elem) => +elem.id === +postId);
    //             if (index !== -1) {
    //                 setNextprev({
    //                     prev: res[index - 1]?.id,
    //                     next: res[index + 1]?.id,
    //                 });
    //             }
    //         }
    //     });
    // }, [postId]);
    // useEffect(() => {
    //     let post = blogState.posts.find((post) => post.id === postId);
    //     if (post) {
    //         setContent(post);
    //     } else {
    //         setLoading(true);
    //         getAllPosts()
    //             .then((posts) => {
    //                 dispatch({ type: "ALL_POSTS_LOADED", payload: posts });
    //                 return posts;
    //             })
    //             .then((posts) => {
    //                 const post = posts.find((post) => post.id === postId);
    //                 if (post === undefined) {
    //                     throw new Error("wrong post");
    //                 }
    //                 setContent(post);
    //             })
    //             .then(() => setLoading(false))
    //             .catch(() => setWrongId(true));
    //     }
    // }, [blogState, postId]);

    if (wrongId) {
        return (
            <div className="blog-post">
                <h1
                    className="blog-post__error"
                    style={{ textAlign: "center" }}
                >
                    Несуществующий пост
                </h1>
                <Link
                    style={{ display: "block", margin: "30px auto" }}
                    className="blog-post__link"
                    to="/"
                >
                    На главную
                </Link>
            </div>
        );
    }
    if (loading || !currentPost.text) {
        return <BigLoading />;
    }

    return (
        <div className="blog-post">
            <div className="blog-post__intro">
                <div className="blog-post__info">
                    <h3 className="blog-post__title">{currentPost.title}</h3>
                    <div
                        style={{
                            background: categoryStyles.background,
                            color: categoryStyles.color,
                        }}
                        className="blog-post__category"
                    >
                        {currentPost.category}
                    </div>
                    <div className="blog-post__published">
                        {currentPost.published}
                    </div>
                </div>
                <div className="blog-post__thumbnail">
                    <img src={currentPost.thumbnail} alt="thumbnail" />
                </div>
            </div>

            <div className="blog-post__content">
                {parseBlogText(currentPost.text)}
            </div>

            {/* <div className="blog-post__links">
                {nextprev.prev ? (
                    <Link
                        className="blog-post__link"
                        relative="path"
                        to={`../${nextprev.prev}`}
                    >
                        <svg viewBox="0 0 32 32">
                            <g data-name="Layer 2" id="Layer_2">
                                <path d="M20,25a1,1,0,0,1-.71-.29l-8-8a1,1,0,0,1,0-1.42l8-8a1,1,0,1,1,1.42,1.42L13.41,16l7.3,7.29a1,1,0,0,1,0,1.42A1,1,0,0,1,20,25Z" />
                            </g>
                        </svg>
                        Предыдущая статья
                    </Link>
                ) : (
                    <Link className="blog-post__link" to="/">
                        На главную
                    </Link>
                )}
                {nextprev.next ? (
                    <Link
                        className="blog-post__link"
                        to={`../${nextprev.next}`}
                        relative="path"
                    >
                        Следующая статья
                        <svg viewBox="0 0 32 32">
                            <g data-name="Layer 2" id="Layer_2">
                                <path d="M12,25a1,1,0,0,1-.71-.29,1,1,0,0,1,0-1.42L18.59,16l-7.3-7.29a1,1,0,1,1,1.42-1.42l8,8a1,1,0,0,1,0,1.42l-8,8A1,1,0,0,1,12,25Z" />
                            </g>
                        </svg>
                    </Link>
                ) : null}
            </div> */}
        </div>
    );
};

export default BlogPost;
