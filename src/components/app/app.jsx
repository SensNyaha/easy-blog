import React, { useState } from "react";
import BlogGrid from "../blogGrid/blogGrid";
import Header from "../header/header";

const App = () => {
    const [logged, setLogged] = useState(false);

    return (
        <>
            <Header logged={logged} />
            <BlogGrid />
        </>
    );
};

export default App;
