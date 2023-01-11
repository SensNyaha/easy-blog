import React from "react";

import "./loginError.scss";

const LoginError = ({ text }) => {
    return <div className="login__error">{text}</div>;
};

export default LoginError;
