import React, { useContext } from "react";
import classes from "./BookmarkPage.module.css";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import loginContext from "../store/login-context";
import BookmarkList from "../components/BookmarkPageComponents/BookmarkList";
import { useGeoLocation } from "../hooks/useGeoLocation";
import { IoIosSettings } from "react-icons/io";
import { motion } from "framer-motion";

const geolocationOptions = {
    enableHighAccuracy: true,
    timeout: 1000 * 10,
    maximumAge: 1000 * 3600 * 24,
}

const BookmarkPage = () => {

    const navigate = useNavigate();
    const loginCtx = useContext(loginContext);
    const { location } = useGeoLocation(geolocationOptions);

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
                <h3 className={classes.header_text}>즐겨찾기</h3>
                <motion.div 
                    onClick={goSettingsPageHandler}
                    whileHover={{ scale : 1.1 }}>
                    <IoIosSettings 
                        className={classes.back_icon}/>
                </motion.div>
            </div>
            <div className={classes.description_container}>
                <p className={classes.description}>
                    {loginCtx.name}님이 등록하신 즐겨찾기 목록입니다. <br/>
                    해당 주차장을 클릭하여 자세한 정보를 살펴보세요!
                </p>
            </div>
            {loginCtx.memberId && location && <BookmarkList location={location}/>}
        </React.Fragment>

    )

};

export default BookmarkPage;