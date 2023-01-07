import React from "react";

import "./loading.scss";

const Loading = () => {
    return (
        <div className="loading">
            <svg
                width="211px"
                height="211px"
                viewBox="0 0 100 100"
                preserveAspectRatio="xMidYMid"
            >
                <circle
                    cx="50"
                    cy="50"
                    fill="none"
                    stroke="#cecece"
                    strokeWidth="29"
                    r="14"
                    strokeDasharray="65.97344572538566 23.991148575128552"
                >
                    <animateTransform
                        attributeName="transform"
                        type="rotate"
                        repeatCount="indefinite"
                        dur="0.1s"
                        values="0 50 50;360 50 50"
                        keyTimes="0;1"
                    ></animateTransform>
                </circle>
            </svg>
        </div>
    );
};

export default Loading;
