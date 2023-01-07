import React from "react";
import { Link } from "react-router-dom";

import "./button.scss";

const Button = ({ text, to }) => {
    return (
        <Link className="button" to={to}>
            {text}
        </Link>
    );
};

export default Button;
