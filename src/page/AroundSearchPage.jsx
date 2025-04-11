import React from "react";
import classes from "./AroundSearchPage.module.css";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import AroundSearchList from "../components/AroundSearchPageComponents/AroundSearchList";
import { useSearchParams } from 'react-router-dom';
import { motion } from "framer-motion";
import { IoIosSettings } from "react-icons/io";

const AroundSearchPage = () => {

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const latitude = searchParams.get('latitude');
    const longitude = searchParams.get('longitude');
    const location = {
        latitude,
        longitude
    }

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
                <h3 className={classes.header_text}>주변탐색</h3>
                <motion.div 
                    onClick={goSettingsPageHandler}
                    whileHover={{ scale : 1.1 }}>
                    <IoIosSettings 
                        className={classes.back_icon}/>
                </motion.div>
            </div>
            <div className={classes.description_container}>
                <p className={classes.description}>
                    현재 위치 주변에 위치한 주차장입니다. <br/>
                    해당 주차장을 클릭하여 자세한 정보를 살펴보세요!
                </p>
            </div>
            {latitude && <AroundSearchList location={location}/>}
        </React.Fragment>
    )
};

export default AroundSearchPage;