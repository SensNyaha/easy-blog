import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";

import ScrollToTop from "../scrollWrapper/scrollWrapper";

import Container from "../container/container";
import BlogGrid from "../blogGrid/blogGrid";
import Header from "../header/header";
import BlogPost from "../blogPost/blogPost";

const App = () => {
    const [logged, setLogged] = useState(false);

    return (
        <ScrollToTop>
            <Container>
                <Header logged={logged} />
                <Routes>
                    <Route path="posts/:postId" element={<BlogPost />} />
                    <Route path="/" element={<BlogGrid />} />
                </Routes>
            </Container>
        </ScrollToTop>
    );
};

export default App;
