import React from "react";

import logo from "./logo.svg";
import "./logo.scss";

const Logo = () => {
    return (
        <div className="logo">
            <img src={logo} alt="logo" /> easy blog
        </div>
    );
};

export default Logo;
