import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import getCategories from "../../services/getCategories";
import getPostAuth from "../../services/getPostAuth";
import logout from "../../services/logout";
import postCategory from "../../services/postCategory";
import postPostAuth from "../../services/postPostAuth";
import putPostAuth from "../../services/putPostAuth";
import BigLoading from "../bigLoading/bigLoading";

import "./editPost.scss";

const EditPost = ({ toDo }) => {
    const { postId } = useParams();
    const navigate = useNavigate();

    const [content, setContent] = useState(null);
    const [user, setUser] = useState(null);
    const [categories, setCategories] = useState(null);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [addCategory, setAddCategory] = useState({
        active: false,
        name: "",
        background: "#fff",
        color: "#000",
    });

    useEffect(() => {
        setUser(JSON.parse(localStorage.getItem("user")));

        if (toDo === "edit") {
            getPostAuth(
                postId,
                user?.email,
                localStorage.getItem("accessToken")
            ).then((res) => setContent(res[0]));
        }

        getCategories().then((res) => setCategories(res));
    }, []);
    useEffect(() => {
        if (toDo === "create") {
            setContent({ userId: user?.id });
        }
    }, [toDo, user]);
    useEffect(() => {
        if (categories) {
            if (toDo === "create") {
                setContent((prev) => {
                    return {
                        ...prev,
                        category: categories[0].name,
                        published: "2023-01-01",
                    };
                });
            }
        }
    }, [categories]);
    useEffect(() => {
        if (success === true) {
            setTimeout(() => navigate("/me"), 2000);
        }
    }, [success]);

    if (!content && toDo === "edit") {
        return <BigLoading />;
    }

    const handleSaveCorrectedPost = () => {
        if (toDo === "edit") {
            putPostAuth(
                content.id,
                user?.email,
                localStorage.getItem("accessToken"),
                content
            ).then((res) => {
                if (res.title === content.title) {
                    setSuccess(true);
                } else {
                    setError(true);
                }
            });
        } else if (toDo === "create") {
            postPostAuth(
                user?.email,
                localStorage.getItem("accessToken"),
                content
            ).then((res) => {
                if (res.title === content.title) {
                    setSuccess(true);
                } else {
                    setError(true);
                }
            });
        }
    };

    const createNewCategory = (e) => {
        const body = { ...addCategory };
        delete body.active;
        postCategory(body)
            .then((res) => {
                if (res.name) {
                    setAddCategory({
                        active: false,
                        name: "",
                        background: "#fff",
                        color: "#000",
                    });
                    getCategories().then((res) => setCategories(res));
                } else {
                    e.target.parentElement.append(
                        "Что-то пошло не так. Попробуйте позже."
                    );
                }
            })
            .catch(console.log);
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
                            value={content?.title || ""}
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
                            value={content?.thumbnail || ""}
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
                        {content?.thumbnail ? (
                            <img
                                src={content.thumbnail}
                                alt="thumbnail"
                                className="edit__thumbnail-img"
                            />
                        ) : null}
                    </div>
                    <div className="edit__form-block">
                        <label
                            htmlFor="edit__published"
                            className="edit__label edit__label-published"
                        >
                            Дата публикации
                        </label>
                        <input
                            value={
                                content?.published
                                    ?.split(".")
                                    ?.reverse()
                                    ?.join("-") || ""
                            }
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
                                value={content?.category}
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
                                    <option key={cat.name} value={cat}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        )}
                        <div className="edit__categories-create">
                            <div className="checkbox-wrapper">
                                <input
                                    type="checkbox"
                                    className="edit__categories-checkbox"
                                    id="edit__categories-checkbox"
                                    checked={addCategory.active}
                                    onChange={() => {
                                        setAddCategory((prev) => ({
                                            ...prev,
                                            active: !prev.active,
                                        }));
                                    }}
                                />
                                <label htmlFor="edit__categories-checkbox">
                                    Добавить свою категорию
                                </label>
                            </div>
                            {addCategory.active ? (
                                <div className="edit__categories-new">
                                    <label htmlFor="edit__categories-name">
                                        Название новой категории
                                    </label>
                                    <input
                                        type="text"
                                        className="edit__categories-name"
                                        id="edit__categories-name"
                                        value={addCategory.name}
                                        onChange={(e) => {
                                            setAddCategory((prev) => ({
                                                ...prev,
                                                name: e.target.value,
                                            }));
                                        }}
                                    />
                                    <label htmlFor="edit__categories-background">
                                        Задний фон плашки
                                    </label>
                                    <input
                                        type="color"
                                        className="edit__categories-background"
                                        id="edit__categories-background"
                                        value={addCategory.background}
                                        onChange={(e) => {
                                            setAddCategory((prev) => ({
                                                ...prev,
                                                background: e.target.value,
                                            }));
                                        }}
                                    />
                                    <label htmlFor="edit__categories-color">
                                        Цвет текста на плашке
                                    </label>
                                    <input
                                        type="color"
                                        className="edit__categories-color"
                                        id="edit__categories-color"
                                        value={addCategory.color}
                                        onChange={(e) => {
                                            setAddCategory((prev) => ({
                                                ...prev,
                                                color: e.target.value,
                                            }));
                                        }}
                                    />
                                    <button
                                        onClick={createNewCategory}
                                        className="edit__categories-send"
                                    >
                                        Сохранить новую категорию
                                    </button>
                                </div>
                            ) : null}
                        </div>
                    </div>
                    <div className="edit__form-block">
                        <label
                            htmlFor="edit__text"
                            className="edit__label edit__label-text"
                        >
                            Содержимое поста
                        </label>
                        <textarea
                            value={
                                content?.text?.split("\n")?.join("\n\n") || ""
                            }
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
                    disabled={success}
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
