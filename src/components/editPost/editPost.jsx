import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import getCategories from "../../services/getCategories";
import getPostAuth from "../../services/getPostAuth";
import logout from "../../services/logout";
import putPostAuth from "../../services/putPostAuth";
import BigLoading from "../bigLoading/bigLoading";

import "./editPost.scss";

const EditPost = () => {
    const { postId } = useParams();
    const navigate = useNavigate();

    const [content, setContent] = useState(null);
    const [categories, setCategories] = useState(null);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        getPostAuth(
            postId,
            JSON.parse(localStorage.getItem("user")).email,
            localStorage.getItem("accessToken")
        ).then((res) => setContent(res[0]));

        getCategories().then((res) => setCategories(res));
    }, []);

    if (!content) {
        return <BigLoading />;
    }

    const handleSaveCorrectedPost = async () => {
        putPostAuth(
            content.id,
            JSON.parse(localStorage.getItem("user")).email,
            localStorage.getItem("accessToken"),
            content
        ).then((res) => {
            if (res.title === content.title) {
                setSuccess(true);
            } else {
                setError(true);
            }
        });
    };

    try {
        return (
            <div className="edit">
                <Link className="edit__back" to="/me">
                    Назад к моим постам
                </Link>
                <div className="edit__form">
                    <div className="edit__form-block">
                        <label
                            htmlFor="edit__title"
                            className="edit__label edit__label-title"
                        >
                            Заголовок статьи
                        </label>
                        <textarea
                            value={content.title}
                            type="text"
                            className="edit__title edit__textarea"
                            id="edit__title"
                            onChange={(e) =>
                                setContent((prev) => {
                                    return { ...prev, title: e.target.value };
                                })
                            }
                        />
                    </div>
                    <div className="edit__form-block">
                        <label
                            htmlFor="edit__thumbnail"
                            className="edit__label edit__label-thumbnail"
                        >
                            Стартовая картинка статьи
                        </label>
                        <input
                            value={content.thumbnail}
                            type="text"
                            className="edit__thumbnail edit__input"
                            id="edit__thumbnail"
                            onChange={(e) =>
                                setContent((prev) => {
                                    return {
                                        ...prev,
                                        thumbnail: e.target.value,
                                    };
                                })
                            }
                        />
                        <img
                            src={content.thumbnail}
                            alt="thumbnail"
                            className="edit__thumbnail-img"
                        />
                    </div>
                    <div className="edit__form-block">
                        <label
                            htmlFor="edit__published"
                            className="edit__label edit__label-published"
                        >
                            Дата публикации
                        </label>
                        <input
                            value={content.published
                                .split(".")
                                .reverse()
                                .join("-")}
                            type="date"
                            className="edit__published edit__input"
                            id="edit__published"
                            onChange={(e) =>
                                setContent((prev) => {
                                    return {
                                        ...prev,
                                        published: e.target.value
                                            .split("-")
                                            .reverse()
                                            .join("."),
                                    };
                                })
                            }
                        />
                    </div>
                    <div className="edit__form-block">
                        <label
                            htmlFor="edit__categories"
                            className="edit__label edit__label-categories"
                        >
                            Категория поста
                        </label>
                        {!categories ? (
                            "Не удалось загрузить категории для постов. Попробуйте позже"
                        ) : (
                            <select
                                id="edit__categories"
                                className="edit__categories edit__select"
                                value={content.category}
                                onChange={(e) =>
                                    setContent((prev) => {
                                        return {
                                            ...prev,
                                            category: e.target.value,
                                        };
                                    })
                                }
                            >
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                    <div className="edit__form-block">
                        <label
                            htmlFor="edit__text"
                            className="edit__label edit__label-text"
                        >
                            Содержимое поста
                        </label>
                        <textarea
                            value={content.text.split("\n").join("\n\n")}
                            type="text"
                            className="edit__text edit__textarea"
                            id="edit__text"
                            onChange={(e) =>
                                setContent((prev) => {
                                    return {
                                        ...prev,
                                        text: e.target.value
                                            .split("\n\n")
                                            .join("\n"),
                                    };
                                })
                            }
                        />
                    </div>
                </div>
                {success ? (
                    <div className="edit__success">Пост успешно изменен!</div>
                ) : error ? (
                    <div className="edit__error">Что-то пошло не так</div>
                ) : null}
                <button
                    onClick={handleSaveCorrectedPost}
                    className="edit__save"
                >
                    Сохранить данные
                </button>
            </div>
        );
    } catch {
        logout();
        navigate("/login");
    }
};

export default EditPost;
