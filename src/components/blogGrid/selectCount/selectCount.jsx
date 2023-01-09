import React from "react";

import "./selectCount.scss";

const SelectCount = ({ count, onChange }) => {
    return (
        <div className="select-wrapper">
            <label htmlFor="postsCount">Выводится элементов</label>
            <select
                onChange={(e) => onChange(e.target.value)}
                value={count}
                className="selectCount"
                name="postsCount"
                id="postsCount"
            >
                <option value="9">По три строки</option>
                <option value="18">По шесть строк</option>
                <option value="27">По девять строк</option>
            </select>
        </div>
    );
};

export default SelectCount;
