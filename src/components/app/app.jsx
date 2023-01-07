import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import api from "../../api/index";

import BlogHeader from "../blogHeader/blogHeader";
import BlogContent from "../blogContent/blogContent";

const App = () => {
    let [blogPosts, setBlogPosts] = useState(api());
    return (
        <>
            <BlogHeader />
            <Routes>
                <Route
                    path="posts/:postId?"
                    element={
                        <BlogContent page={"Статьи"} content={blogPosts} />
                    }
                />
                <Route path="" element={<Navigate to="posts" />} />
            </Routes>
        </>
    );
};

export default App;
