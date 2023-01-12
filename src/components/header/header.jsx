import React from "react";
import LoginKey from "./loginKey/loginKey";
import Logo from "./logo/logo";

import "./header.scss";
import ExitKey from "./exitKey/exitKey";

const Header = ({ logged }) => {
    return (
        <div className="header">
            <Logo />
            {logged ? (
                <>
                    <ExitKey />
                </>
            ) : (
                <LoginKey />
            )}
        </div>
    );
};

export default Header;
