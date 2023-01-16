import { createContext, useReducer } from "react";

const initialState = {
    posts: [],
    categories: [],
    logged: false,
    accessToken: null,
    userInfo: {},
    countOfListingPosts: "9",
    listingOfPostsEnded: false,
};

const reducer = (state, action) => {
    switch (action.type) {
        case "POSTS_LOADED":
            return {
                ...state,
                posts: [...state.posts, ...action.payload],
            };
        case "CATEGORIES_LOADED":
            return {
                ...state,
                categories: action.payload,
            };
        case "COUNT_OF_POSTS_CHANGED": {
            return {
                ...state,
                countOfListingPosts: action.payload,
            };
        }
        case "LISTING_ENDED": {
            return {
                ...state,
                listingOfPostsEnded: true,
            };
        }
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
