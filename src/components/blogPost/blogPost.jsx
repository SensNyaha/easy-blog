import React from "react";

import "./blogPost.scss";

const BlogPost = ({ content: { description, thumbnail } }) => {
    let paragrArr = description.split("\n");
    let descriptionHTML = paragrArr.map((p, index) => {
        const RegExp =
            /((ftp|http|https):\/\/)?(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9\-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-\/])*)?/;

        function returnAnchorLinks(reactTextElement) {
            if (RegExp.test(reactTextElement)) {
                let startIndex = reactTextElement.search(RegExp);
                let match = reactTextElement.match(RegExp)[0];

                return (
                    <>
                        {reactTextElement.slice(0, startIndex)}
                        <a className="blog__post-anchor" href={match}>
                            {match}
                        </a>
                        {reactTextElement.slice(startIndex + match.length)}
                    </>
                );
            }
            return reactTextElement;
        }

        return (
            <p key={index} className="blog__post-para">
                {returnAnchorLinks(p)}
            </p>
        );
    });

    return (
        <div className="blog__post">
            {descriptionHTML}
            <img src={thumbnail} alt="thumbail" className="blog__post-img" />
        </div>
    );
};

export default BlogPost;
