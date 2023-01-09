import React from "react";
import LoginKey from "./loginKey/loginKey";
import Logo from "./logo/logo";

import "./header.scss";

const Header = ({ logged }) => {
    return (
        <div className="header">
            <Logo />
            {logged ? null : <LoginKey />}
        </div>
    );
};

export default Header;
