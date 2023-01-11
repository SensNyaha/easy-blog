import { useEffect } from "react";
import { useLocation } from "react-router";

const CheckAuth = (props) => {
    const location = useLocation();
    useEffect(() => {
        props.onChangeLogged();
    }, [location]);
    return <>{props.children}</>;
};

export default CheckAuth;
