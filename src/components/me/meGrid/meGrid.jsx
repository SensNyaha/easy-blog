import React from "react";
import { Link } from "react-router-dom";
import BigLoading from "../../bigLoading/bigLoading";

import "./meGrid.scss";

const MeGrid = ({ content, contentEnded }) => {
    if (!content) {
        return <BigLoading />;
    }
    if (content.length === 0 && contentEnded) {
        return (
            <div className="me__grid">
                Пока что Вы ничего не запостили. Создайте новый пост прямо
                сейчас!
            </div>
        );
    }

    return (
        <>
            <div className="me__title">Твои посты</div>
            <div className="me__grid">
                {content.map((item) => {
                    return (
                        <Link
                            to={`edit/${item.id}`}
                            key={item.id}
                            className="me__post"
                        >
                            <h4 className="me__post-title">{item.title}</h4>
                            <img
                                src={item.thumbnail}
                                alt="thumnbail"
                                className="me__post-bg"
                            />
                        </Link>
                    );
                })}
            </div>
        </>
    );
};

export default MeGrid;
