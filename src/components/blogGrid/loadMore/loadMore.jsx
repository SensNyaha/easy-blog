import React from "react";

import "./loadMore.scss";

const LoadMore = ({ onClick }) => {
    return (
        <button onClick={onClick} className="load-more">
            Загрузить больше постов
        </button>
    );
};

export default LoadMore;
