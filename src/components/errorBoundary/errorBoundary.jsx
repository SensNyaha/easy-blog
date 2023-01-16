import React from "react";

import { Link } from "react-router-dom";

import "./error.scss";
import error from "./error.gif";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="error">
                    <h1>В приложении произошла критическая ошибка</h1>
                    <img src={error} alt="error" />
                    <Link
                        onClick={() => this.setState({ hasError: false })}
                        to="/"
                    >
                        Вернуться на главный экран
                    </Link>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
