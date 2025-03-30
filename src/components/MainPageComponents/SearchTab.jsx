import React from "react";
import classes from "./SearchTab.module.css";
import { CiSearch } from "react-icons/ci";
import { useNavigate } from "react-router-dom";

const Search = (props) => {

    const navigate = useNavigate();

    const goSearchPageHandler = () => {
        const params = new URLSearchParams({
            latitude : props.location.latitude,
            longitude: props.location.longitude
        }).toString();
        navigate(`/search?${params}`);
    };

    return (
        <div className={classes.container} onClick={goSearchPageHandler}>
            <input type='text' name='place'
            placeholder="목적지 및 필터 검색"
            className={classes.input} />
            <CiSearch className={classes.search_icon}/>
        </div>
    );
};

export default Search;