import React, { useContext, useEffect, useReducer, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import { BlogContext } from "../../context/context";
import deletePostAuth from "../../services/deletePostAuth";
import getCategories from "../../services/getCategories";
import getPostAuth from "../../services/getPostAuth";
import logout from "../../services/logout";
import postCategory from "../../services/postCategory";
import postPostAuth from "../../services/postPostAuth";
import putPostAuth from "../../services/putPostAuth";
import BigLoading from "../bigLoading/bigLoading";
import EditHint from "./editHint/editHint";

import "./editPost.scss";

const initialState = {
    content: {},
    user: {},
    categories: [],
    success: false,
    error: false,
    addCategoryMenuState: {
        active: false,
        name: "",
        background: "#fff",
        color: "#000",
    },
};
const reducer = (state, action) => {
    switch (action.type) {
        case "CONTENT_SET":
            return {
                ...state,
                content: { ...state.content, ...action.payload },
            };
        case "CATEGORIES_SET":
            return {
                ...state,
                categories: action.payload,
            };
        case "USER_SET": {
            return {
                ...state,
                user: { ...action.payload },
            };
        }
        case "SUCCESS_EDIT": {
            return {
                ...state,
                success: true,
            };
        }
        case "ERROR_EDIT": {
            return {
                ...state,
                error: true,
            };
        }
        case "RESET_CATEGORY_ADDING_MENU":
            return {
                ...state,
                addCategoryMenuState: initialState,
            };
        case "CHANGE_CATEGORY_ADDING_MENU":
            return {
                ...state,
                addCategoryMenuState: {
                    ...state.addCategoryMenuState,
                    ...action.payload,
                },
            };

        default:
            return state;
    }
};

const EditPost = ({ toDo }) => {
    const [editState, dispatchEdit] = useReducer(reducer, initialState);
    const [, dispatch] = useContext(BlogContext);

    const { postId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        dispatchEdit({
            type: "USER_SET",
            payload: JSON.parse(localStorage.getItem("user")),
        });

        if (toDo === "edit") {
            getPostAuth(
                postId,
                editState.user?.email,
                localStorage.getItem("accessToken")
            ).then((res) =>
                dispatchEdit({ type: "CONTENT_SET", payload: res[0] })
            );
        }

        getCategories().then((res) =>
            dispatchEdit({ type: "CATEGORIES_SET", payload: res })
        );
    }, []);
    useEffect(() => {
        if (toDo === "create") {
            dispatchEdit({
                type: "CONTENT_SET",
                payload: { userId: editState.user?.id },
            });
        }
    }, [toDo, editState.user]);
    useEffect(() => {
        if (editState.categories) {
            if (toDo === "create") {
                dispatchEdit({
                    type: "CONTENT_SET",
                    payload: {
                        category: editState.categories[0]?.name,
                        published: "2023-01-01",
                    },
                });
            }
        }
    }, [editState.categories]);
    useEffect(() => {
        if (editState.success === true) {
            setTimeout(() => navigate("/me"), 2000);
        }
    }, [editState.success]);

    if (!editState.content && toDo === "edit") {
        return <BigLoading />;
    }

    const handleSaveCorrectedPost = () => {
        if (toDo === "edit") {
            putPostAuth(
                editState.content.id,
                editState.user?.email,
                localStorage.getItem("accessToken"),
                editState.content
            ).then((res) => {
                if (res.title === editState.content.title) {
                    dispatchEdit({ type: "SUCCESS_EDIT" });
                } else {
                    dispatchEdit({ type: "ERROR_EDIT" });
                }
            });
        } else if (toDo === "create") {
            postPostAuth(
                editState.user?.email,
                localStorage.getItem("accessToken"),
                editState.content
            ).then((res) => {
                if (res.title === editState.content.title) {
                    dispatchEdit({ type: "SUCCESS_EDIT" });
                } else {
                    dispatchEdit({ type: "ERROR_EDIT" });
                }
            });
        }
        dispatch({ type: "POSTS_RESET" });
    };
    const handleDeletePost = () => {
        deletePostAuth(
            postId,
            editState.user.email,
            localStorage.getItem("accessToken")
        )
            .then((res) => {
                if (typeof res !== "object") {
                    throw new Error("Bad request");
                }
                navigate("/me");
            })
            .then(() => dispatch({ type: "POSTS_RESET" }))
            .catch(() => dispatchEdit({ type: "ERROR_EDIT" }));
    };
    const createNewCategory = (e) => {
        const body = { ...editState.addCategoryMenuState };
        delete body.active;
        postCategory(body)
            .then((res) => {
                if (res.name) {
                    dispatchEdit({
                        type: "RESET_CATEGORY_ADDING_MENU",
                    });
                    getCategories().then((res) => {
                        dispatchEdit({ type: "CATEGORIES_SET", payload: res });
                        dispatch({ type: "CATEGORIES_LOADED", payload: res });
                    });
                } else {
                    e.target.parentElement.append(
                        "??????-???? ?????????? ???? ??????. ???????????????????? ??????????."
                    );
                }
            })
            .catch(console.log);
    };

    try {
        return (
            <div className="edit">
                <Link className="edit__back" to="/me">
                    ?????????? ?? ???????? ????????????
                </Link>
                <div className="edit__form">
                    <div className="edit__form-block">
                        <label
                            htmlFor="edit__title"
                            className="edit__label edit__label-title"
                        >
                            ?????????????????? ????????????
                        </label>
                        <textarea
                            value={editState.content?.title || ""}
                            type="text"
                            className="edit__title edit__textarea"
                            id="edit__title"
                            onChange={(e) =>
                                dispatchEdit({
                                    type: "CONTENT_SET",
                                    payload: { title: e.target.value },
                                })
                            }
                        />
                    </div>
                    <div className="edit__form-block">
                        <label
                            htmlFor="edit__thumbnail"
                            className="edit__label edit__label-thumbnail"
                        >
                            ?????????????????? ???????????????? ????????????
                        </label>
                        <input
                            value={editState.content?.thumbnail || ""}
                            type="text"
                            className="edit__thumbnail edit__input"
                            id="edit__thumbnail"
                            onChange={(e) =>
                                dispatchEdit({
                                    type: "CONTENT_SET",
                                    payload: { thumbnail: e.target.value },
                                })
                            }
                        />
                        {editState.content?.thumbnail ? (
                            <img
                                src={editState.content.thumbnail}
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
                            ???????? ????????????????????
                        </label>
                        <input
                            value={
                                editState.content?.published
                                    ?.split(".")
                                    ?.reverse()
                                    ?.join("-") || ""
                            }
                            type="date"
                            className="edit__published edit__input"
                            id="edit__published"
                            onChange={(e) =>
                                dispatchEdit({
                                    type: "CONTENT_SET",
                                    payload: {
                                        published: e.target.value
                                            .split("-")
                                            .reverse()
                                            .join("."),
                                    },
                                })
                            }
                        />
                    </div>
                    <div className="edit__form-block">
                        <label
                            htmlFor="edit__categories"
                            className="edit__label edit__label-categories"
                        >
                            ?????????????????? ??????????
                        </label>
                        {!editState.categories ? (
                            "???? ?????????????? ?????????????????? ?????????????????? ?????? ????????????. ???????????????????? ??????????"
                        ) : (
                            <select
                                id="edit__categories"
                                className="edit__categories edit__select"
                                value={editState.content?.category}
                                onChange={(e) =>
                                    dispatchEdit({
                                        type: "CONTENT_SET",
                                        payload: { category: e.target.value },
                                    })
                                }
                            >
                                {editState.categories.map((cat) => (
                                    <option key={cat.name} value={cat.name}>
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
                                    checked={
                                        editState.addCategoryMenuState.active
                                    }
                                    onChange={() => {
                                        dispatchEdit({
                                            type: "CHANGE_CATEGORY_ADDING_MENU",
                                            payload: {
                                                active: !editState
                                                    .addCategoryMenuState
                                                    .active,
                                            },
                                        });
                                    }}
                                />
                                <label htmlFor="edit__categories-checkbox">
                                    ???????????????? ???????? ??????????????????
                                </label>
                            </div>
                            {editState.addCategoryMenuState.active ? (
                                <div className="edit__categories-new">
                                    <label htmlFor="edit__categories-name">
                                        ???????????????? ?????????? ??????????????????
                                    </label>
                                    <input
                                        type="text"
                                        className="edit__categories-name"
                                        id="edit__categories-name"
                                        value={
                                            editState.addCategoryMenuState.name
                                        }
                                        onChange={(e) => {
                                            dispatchEdit({
                                                type: "CHANGE_CATEGORY_ADDING_MENU",
                                                payload: {
                                                    name: e.target.value,
                                                },
                                            });
                                        }}
                                    />
                                    <label htmlFor="edit__categories-background">
                                        ???????????? ?????? ????????????
                                    </label>
                                    <input
                                        type="color"
                                        className="edit__categories-background"
                                        id="edit__categories-background"
                                        value={
                                            editState.addCategoryMenuState
                                                .background
                                        }
                                        onChange={(e) => {
                                            dispatchEdit({
                                                type: "CHANGE_CATEGORY_ADDING_MENU",
                                                payload: {
                                                    background: e.target.value,
                                                },
                                            });
                                        }}
                                    />
                                    <label htmlFor="edit__categories-color">
                                        ???????? ???????????? ???? ????????????
                                    </label>
                                    <input
                                        type="color"
                                        className="edit__categories-color"
                                        id="edit__categories-color"
                                        value={
                                            editState.addCategoryMenuState.color
                                        }
                                        onChange={(e) => {
                                            dispatchEdit({
                                                type: "CHANGE_CATEGORY_ADDING_MENU",
                                                payload: {
                                                    color: e.target.value,
                                                },
                                            });
                                        }}
                                    />
                                    <button
                                        onClick={createNewCategory}
                                        className="edit__categories-send"
                                    >
                                        ?????????????????? ?????????? ??????????????????
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
                            ???????????????????? ??????????
                        </label>
                        <EditHint />
                        <textarea
                            value={
                                editState.content?.text
                                    ?.split("\n")
                                    ?.join("\n\n") || ""
                            }
                            type="text"
                            className="edit__text edit__textarea"
                            id="edit__text"
                            onChange={(e) =>
                                dispatchEdit({
                                    type: "CONTENT_SET",
                                    payload: {
                                        text: e.target.value
                                            .split("\n\n")
                                            .join("\n"),
                                    },
                                })
                            }
                        />
                    </div>
                </div>

                {editState.success ? (
                    <div className="edit__success">???????? ?????????????? ??????????????!</div>
                ) : editState.error ? (
                    <div className="edit__error">??????-???? ?????????? ???? ??????</div>
                ) : null}
                <button
                    onClick={handleSaveCorrectedPost}
                    className="edit__save"
                    disabled={editState.success}
                >
                    ?????????????????? ????????????
                </button>
                <button
                    onClick={handleDeletePost}
                    className="edit__delete"
                    disabled={editState.success}
                >
                    ?????????????? ????????
                </button>
            </div>
        );
    } catch {
        logout();
        navigate("/login");
    }
};

export default EditPost;
