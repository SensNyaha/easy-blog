import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";

import ScrollToTop from "../scrollWrapper/scrollWrapper";

import Container from "../container/container";
import BlogGrid from "../blogGrid/blogGrid";
import Header from "../header/header";
import BlogPost from "../blogPost/blogPost";
import Login from "../login/login";
import CheckAuth from "../checkAuth/checkAuth";
import Me from "../me/me";
import EditPost from "../editPost/editPost";
import ErrorBoundary from "../errorBoundary/errorBoundary";

const App = () => {
    const [logged, setLogged] = useState(false);

    const onChangeLogged = () => {
        setLogged(localStorage.getItem("accessToken"));
    };

    return (
        <ErrorBoundary>
            <ScrollToTop>
                <Container>
                    <Header logged={logged} />
                    <CheckAuth onChangeLogged={onChangeLogged}>
                        <Routes>
                            <Route
                                path="posts/:postId?"
                                element={<BlogPost />}
                            />
                            <Route path="login" element={<Login />} />
                            <Route path="me" element={<Me />} />
                            <Route
                                path="me/edit/:postId"
                                element={<EditPost toDo="edit" />}
                            />
                            <Route
                                path="me/create"
                                element={<EditPost toDo="create" />}
                            />
                            <Route path="/" element={<BlogGrid />} />
                        </Routes>
                    </CheckAuth>
                </Container>
            </ScrollToTop>
        </ErrorBoundary>
    );
};

export default App;
