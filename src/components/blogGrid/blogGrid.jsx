import React, { useEffect, useState } from "react";
import getPosts from "../../services/getPosts";
import BigLoading from "../bigLoading/bigLoading";
import BlogCard from "./blogCard/blogCard";

import usePrevious from "../../customHooks/usePrevious";

import "./blogGrid.scss";
import SelectCount from "./selectCount/selectCount";

const BlogGrid = () => {
    let [posts, setPosts] = useState([]);
    let [countOfPosts, setCountOfPosts] = useState("9");
    let [loading, setLoading] = useState(false);
    let [error, setError] = useState(false);

    let previousCount = usePrevious(countOfPosts);
    //Реализовать реакцию интерфейса на смену числа выводимых элементов
    //Подгружать элементы, если число элементов от сервера больше показываемого числа элементов
    //Не подгружать элементы, если сейчас выведено элементов больше, чем выбирается и ставится в countOfPosts, но все равно изменить countOfPosts и подгружать элементы далее от кнопки именно в таком количестве
    //Реализлвать кнопку подгрузки элементов согласно countOfPosts

    let [bigPositions, setBigPositions] = useState();
    useEffect(() => {
        for (let i = 0; i < posts.length; i = i + 11) {
            if (i === 0) {
                setBigPositions([{ col: "1/3", row: "1/3" }]);
            } else {
                if (bigPositions && bigPositions[bigPositions.length - 1]) {
                    let newPositionRow = bigPositions[
                        bigPositions.length - 1
                    ].row
                        .split("/")
                        .map((point) => +point + 3)
                        .join("/");
                    let newPositionCol;

                    let divider = (i + 1) / 12;

                    if (divider % 2 === 1) {
                        newPositionCol = "3/5";
                    } else {
                        newPositionCol = "1/3";
                    }
                    let newBigPositions = {
                        col: newPositionCol,
                        row: newPositionRow,
                    };

                    setBigPositions((prevArr) => [...prevArr, newBigPositions]);
                }
            }
        }
    }, [posts]);

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            getPosts(posts.length, countOfPosts)
                .then((res) => setPosts(res))
                .then(() => setLoading(false))
                .catch((err) => console.log(err));
        }, 0);
    }, []);

    const handleChangeCountPosts = (count) => {
        setCountOfPosts(count);
    };

    if (loading) {
        return <BigLoading />;
    }

    return (
        <>
            <SelectCount
                count={countOfPosts}
                onChange={handleChangeCountPosts}
            />
            <div className="blog-grid">
                {[...posts].map((post, i) => {
                    return (
                        <BlogCard
                            key={post.id}
                            {...post}
                            bigStyles={
                                i === 0 && bigPositions
                                    ? bigPositions[i]
                                    : i % 11 === 0 && bigPositions
                                    ? bigPositions[(i + 1) / 12]
                                    : null
                            }
                        />
                    );
                })}
            </div>
        </>
    );
};

export default BlogGrid;
