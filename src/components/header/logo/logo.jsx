import React from "react";

import logo from "./logo.svg";
import "./logo.scss";
import { Link } from "react-router-dom";

const Logo = () => {
    return (
        <div className="logo">
            <img src={logo} alt="logo" /> <Link to="/">easy blog</Link>
        </div>
    );
};

export default Logo;
