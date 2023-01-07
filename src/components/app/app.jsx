import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import BlogHeader from "../blogHeader/blogHeader";
import BlogContent from "../blogContent/blogContent";
import LoginPanel from "../loginPanel/loginPanel";

const App = () => {
    return (
        <>
            <BlogHeader />
            <Routes>
                <Route
                    path="posts/:postId?"
                    element={<BlogContent page={"Статьи"} />}
                />
                <Route path="login-panel/:type?" element={<LoginPanel />} />
                <Route path="" element={<Navigate to="posts" />} />
            </Routes>
        </>
    );
};

export default App;
