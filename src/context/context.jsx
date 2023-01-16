import { createContext, useReducer } from "react";

const initialState = {
    posts: [],
    allPosts: false,
    categories: [],
    logged: false,
    accessToken: null,
    userInfo: {},
};

const reducer = (state, action) => {
    switch (action.type) {
        case "LOGIN":
            return {
                ...state,
                accessToken: action.payload.token,
                userInfo: action.payload.user,
            };
        case "LOGOUT":
            return {
                ...state,
                accessToken: null,
                userInfo: {},
            };
        case "POSTS_LOADED":
            if (state.allPosts) {
                return {
                    state,
                };
            }
            return {
                ...state,
                posts: [...state.posts, ...action.payload],
            };
        case "ALL_POSTS_LOADED":
            return {
                ...state,
                allPosts: true,
            };
        case "CATEGORIES_LOADED":
            return {
                ...state,
                categories: action.payload,
            };
        default:
            return state;
    }
};

export const BlogContext = createContext();

export const BlogProvider = ({ children }) => {
    const value = useReducer(reducer, initialState);
    return (
        <BlogContext.Provider value={value}>{children}</BlogContext.Provider>
    );
};
