import React from "react";
import { Link } from "react-router-dom";

import "./blogCard.scss";

const BlogCard = ({
    id,
    title,
    thumbnail,
    category,
    categoryStyles,
    bigStyles,
}) => {
    let bigPositions = {};
    if (bigStyles) {
        bigPositions["gridColumn"] = bigStyles.col;
        bigPositions["gridRow"] = bigStyles.row;
    }

    return (
        <div
            className={`blog-card${
                bigPositions["gridColumn"] && bigPositions["gridRow"]
                    ? " blog-card--big"
                    : ""
            }`}
            style={bigPositions}
        >
            <Link className="blog-card__link" to={`posts/${id}`}>
                <div style={categoryStyles} className="blog-card__category">
                    {category}
                </div>
                <div className="blog-card__title">{title}</div>
                <img src={thumbnail} alt="title" className="blog-card__bg" />
            </Link>
        </div>
    );
};

export default BlogCard;
