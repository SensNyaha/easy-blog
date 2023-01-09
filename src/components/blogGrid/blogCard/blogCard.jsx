import React from "react";

import "./blogCard.scss";

const BlogCard = ({ id, title, thumbnail, category, bigStyles }) => {
    let bigPositions = {};
    if (bigStyles) {
        bigPositions["grid-column"] = bigStyles.col;
        bigPositions["grid-row"] = bigStyles.row;
    }

    let categoryClass = `blog-card__category `;

    switch (category) {
        case "Внеземное": {
            categoryClass += "blog-card__category--cosmo";
            break;
        }
        case "Что было раньше": {
            categoryClass += "blog-card__category--before";
            break;
        }
        case "Кибервсё": {
            categoryClass += "blog-card__category--cyber";
            break;
        }
        case "Космическая гонка": {
            categoryClass += "blog-card__category--cosmo";
            break;
        }
        case "Устройство человека": {
            categoryClass += "blog-card__category--human";
            break;
        }
        case "Стиль жизни": {
            categoryClass += "blog-card__category--human";
            break;
        }
        case "Будущее уже здесь": {
            categoryClass += "blog-card__category--inno";
            break;
        }
        case "Физика всего": {
            categoryClass += "blog-card__category--inno";
            break;
        }
        default: {
            categoryClass += "blog-card__category--undef";
        }
    }

    return (
        <div
            className={`blog-card${
                bigPositions["grid-column"] && bigPositions["grid-row"]
                    ? " blog-card--big"
                    : ""
            }`}
            style={bigPositions}
        >
            <div className={categoryClass}>{category}</div>
            <div className="blog-card__title">{title}</div>
            <img src={thumbnail} alt="title" className="blog-card__bg" />
        </div>
    );
};

export default BlogCard;
