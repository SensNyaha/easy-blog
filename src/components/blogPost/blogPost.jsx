import React, { useEffect, useState } from "react";
import { useParams } from "react-router";

import getPost from "../../services/getPost";
import parseBlogText from "../../services/parseBlogText";

import BigLoading from "../bigLoading/bigLoading";

import "./blogPost.scss";

const BlogPost = () => {
    const { postId } = useParams();

    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState(null);
    const [wrongId, setWrongId] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            getPost(postId)
                .then((res) => {
                    if (res.length === 0) {
                        setWrongId(true);
                        setLoading(false);
                        throw new Error("Wrong ID");
                    } else {
                        return res;
                    }
                })
                .then((res) => setContent(res[0]))
                .then(() => setLoading(false))
                .catch(() => setError(true));
        }, 1000);
    }, []);

    //если после фетчинга по айди поста пришел undefined показать заглушку 404

    if (error) {
        if (wrongId) {
            return <h1>Несуществующий айди</h1>;
        } else {
            return <h1>Произошла ошибка при получении данных с сервера</h1>;
        }
    }

    if (loading) {
        return <BigLoading />;
    }

    let categoryClass = `blog-post__category `;

    switch (content.category) {
        case "Внеземное": {
            categoryClass += "blog-post__category--cosmo";
            break;
        }
        case "Что было раньше": {
            categoryClass += "blog-post__category--before";
            break;
        }
        case "Кибервсё": {
            categoryClass += "blog-post__category--cyber";
            break;
        }
        case "Космическая гонка": {
            categoryClass += "blog-post__category--cosmo";
            break;
        }
        case "Устройство человека": {
            categoryClass += "blog-post__category--human";
            break;
        }
        case "Стиль жизни": {
            categoryClass += "blog-post__category--human";
            break;
        }
        case "Будущее уже здесь": {
            categoryClass += "blog-post__category--inno";
            break;
        }
        case "Физика всего": {
            categoryClass += "blog-post__category--inno";
            break;
        }
        default: {
            categoryClass += "blog-post__category--undef";
        }
    }

    return (
        <div className="blog-post">
            <div className="blog-post__intro">
                <div className="blog-post__info">
                    <h3 className="blog-post__title">{content.title}</h3>
                    <div className={categoryClass}>{content.category}</div>
                    <div className="blog-post__published">
                        {content.published}
                    </div>
                </div>
                <div className="blog-post__thumbnail">
                    <img src={content.thumbnail} alt="thumbnail" />
                </div>
            </div>

            <div className="blog-post__content">
                {parseBlogText(content.text)}
            </div>
        </div>
    );
};

export default BlogPost;
