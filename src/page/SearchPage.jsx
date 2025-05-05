import React, { useState } from 'react'
import KeywordForm from '../components/SearchPageComponents/KeywordForm';
import classes from "./SearchPage.module.css";
import { motion } from 'framer-motion';
import { IoIosSettings } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";
import { useSearchParams, useNavigate } from 'react-router-dom';
import FilterForm from "../components/SearchPageComponents/FilterForm";

const SearchPage = () => {

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [type,setType] = useState(0);

    const setTypeHandler = (type) => {
        setType(type);
    };
    const goMainPageHandler = () => {
        navigate(-1);
    };
    const goSettingsPageHandler = () => {
        navigate('/setting');
    }

    return (
        <React.Fragment>
             <div className={classes.header}>
                <motion.div whileHover={{ scale : 1.1 }}>
                    <IoIosArrowBack 
                        className={classes.back_icon}
                        onClick={goMainPageHandler}/>
                </motion.div>
                <h3 className={classes.header_text}>장소 및 필터 검색</h3>
                <motion.div 
                    onClick={goSettingsPageHandler}
                    whileHover={{ scale : 1.1 }}>
                    <IoIosSettings 
                        className={classes.back_icon}/>
                </motion.div>
            </div>
            <div className={classes.type_container}>
                <motion.button 
                    whileHover={{ scale : 1.1 }}
                    className={classes.type_button} onClick={() => setTypeHandler(0)}># 키워드 검색</motion.button>
                <motion.button 
                    whileHover={{ scale : 1.1 }}
                    className={classes.type_button} onClick={() => setTypeHandler(1)}># 필터 검색</motion.button>
            </div>
            {type === 0 && <KeywordForm/>}
            {type === 1 && (
                <>
                    <p className={classes.description}>
                        원하시는 요구조건에 맞게 골라주세요!
                    </p>
                    <FilterForm/>
                </>
            )}
        </React.Fragment>
    )
};

export default SearchPage;