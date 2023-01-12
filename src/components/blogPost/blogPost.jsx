import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import getPost from "../../services/getPost";
import getAllPosts from "../../services/getAllPosts";
import parseBlogText from "../../services/parseBlogText";

import BigLoading from "../bigLoading/bigLoading";

import "./blogPost.scss";
import { Link } from "react-router-dom";

const BlogPost = () => {
    const { postId } = useParams();
    const navigate = useNavigate();

    if (postId === undefined) {
        navigate("/");
    }

    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState(null);
    const [wrongId, setWrongId] = useState(false);
    const [error, setError] = useState(false);
    const [nextprev, setNextprev] = useState({ prev: null, next: null });

    useEffect(() => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
    }, []);
    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            getPost(postId)
                .then((res) => {
                    if (res.length === 0) {
                        setWrongId(true);
                        setLoading(false);
                        throw new Error("Wrong ID");
                    } else {
                        return res;
                    }
                })
                .then((res) => setContent(res[0]))
                .then(() => setLoading(false))
                .catch(() => setError(true));
        }, 1000);
    }, [postId]);
    useEffect(() => {
        getAllPosts().then((res) => {
            if (Array.isArray(res)) {
                let index = res.findLastIndex((elem) => +elem.id === +postId);
                if (index !== -1) {
                    setNextprev({
                        prev: res[index - 1]?.id,
                        next: res[index + 1]?.id,
                    });
                }
            }
        });
    }, [postId]);

    if (error) {
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
        } else {
            return (
                <div className="blog-post">
                    <h1
                        className="blog-post__error"
                        style={{ textAlign: "center" }}
                    >
                        Произошла ошибка при получении данных с сервера
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
    }

    if (loading) {
        return <BigLoading />;
    }

    let categoryClass = `blog-post__category `;
    switch (content.category) {
        case "Внеземное": {
            categoryClass += "blog-post__category--cosmo";
            break;
        }
        case "Что было раньше": {
            categoryClass += "blog-post__category--before";
            break;
        }
        case "Кибервсё": {
            categoryClass += "blog-post__category--cyber";
            break;
        }
        case "Космическая гонка": {
            categoryClass += "blog-post__category--cosmo";
            break;
        }
        case "Устройство человека": {
            categoryClass += "blog-post__category--human";
            break;
        }
        case "Стиль жизни": {
            categoryClass += "blog-post__category--human";
            break;
        }
        case "Будущее уже здесь": {
            categoryClass += "blog-post__category--inno";
            break;
        }
        case "Физика всего": {
            categoryClass += "blog-post__category--inno";
            break;
        }
        default: {
            categoryClass += "blog-post__category--undef";
        }
    }

    return (
        <div className="blog-post">
            <div className="blog-post__intro">
                <div className="blog-post__info">
                    <h3 className="blog-post__title">{content.title}</h3>
                    <div className={categoryClass}>{content.category}</div>
                    <div className="blog-post__published">
                        {content.published}
                    </div>
                </div>
                <div className="blog-post__thumbnail">
                    <img src={content.thumbnail} alt="thumbnail" />
                </div>
            </div>

            <div className="blog-post__content">
                {parseBlogText(content.text)}
            </div>

            <div className="blog-post__links">
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
            </div>
        </div>
    );
};

export default BlogPost;
