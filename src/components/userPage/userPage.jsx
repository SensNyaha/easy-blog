import React from "react";
import { useParams } from "react-router";

const UserPage = () => {
    let { userCode } = useParams();
    console.log(userCode);

    return <h1>User page</h1>;
};

export default UserPage;
