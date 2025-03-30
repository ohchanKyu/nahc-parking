import React from 'react'
import KeywordForm from '../components/SearchPageComponents/KeywordForm';
import classes from "./SearchPage.module.css";
import { motion } from 'framer-motion';
import { IoIosSettings } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";
import { useSearchParams, useNavigate } from 'react-router-dom';

const SearchPage = () => {

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const latitude = searchParams.get('latitude');
    const longitude = searchParams.get('longitude');
    
    const goMainPageHandler = () => {
        const params = new URLSearchParams({
            latitude,
            longitude
        }).toString();
        navigate(`/?${params}`);
    };

    return (
        <React.Fragment>
             <div className={classes.header}>
                <motion.div whileHover={{ scale : 1.1 }}>
                    <IoIosArrowBack 
                        className={classes.back_icon}
                        onClick={goMainPageHandler}/>
                </motion.div>
                <h3 className={classes.header_text}># 장소 검색</h3>
                <motion.div whileHover={{ scale : 1.1 }}>
                    <IoIosSettings 
                        className={classes.back_icon}/>
                </motion.div>
            </div>
            <KeywordForm/>
        </React.Fragment>
    )
};

export default SearchPage;