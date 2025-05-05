import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import parkingImage from "../../assets/placeholder.png";
import { CustomOverlayMap } from "react-kakao-maps-sdk";
import classes from "./KakaoMap.module.css";
import { motion } from "framer-motion";

const isPublicHoliday = (date) => {
    const holidays = [
        "01-01", "03-01", "05-05", "06-06", "08-15", "10-03", "10-09", "12-25"
    ];
    const formattedDate = `${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
    return holidays.includes(formattedDate);
};

const getOperatingStatus = (parkingData) => {
    const now = new Date();
    const day = now.getDay();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    let startTime, endTime;
    if (day === 0 || isPublicHoliday(now)) {
        startTime = parkingData.holidayStartTime;
        endTime = parkingData.holidayEndTime;
    } else if (day >= 1 && day <= 5) {
        startTime = parkingData.weekdayStartTime;
        endTime = parkingData.weekdayEndTime;
    } else {
        startTime = parkingData.weekendStartTime;
        endTime = parkingData.weekendEndTime;
    }
    if (startTime === "00:00" && endTime === "00:00") return "운영 중";
    const startMinutes = parseInt(startTime.split(":")[0]) * 60 + parseInt(startTime.split(":")[1]);
    const endMinutes = parseInt(endTime.split(":")[0]) * 60 + parseInt(endTime.split(":")[1]);
    return currentTime >= startMinutes && currentTime <= endMinutes ? "운영 중" : "운영 종료";
};

const EventMarkerContainer = ({ position, parkingData }) => {
    
    const [isVisible,setIsVisible] = useState(false);
    const navigate = useNavigate();

    const goDetailPlaceHandler = async (parkingInfo) => {
        const params = new URLSearchParams({
            latitude : parkingInfo.latitude,
            longitude : parkingInfo.longitude,
            id : parkingInfo.id,
        }).toString();
        navigate(`/detail?${params}`);
    };

    const toggleHandler = () => {
        setIsVisible(prevState => !prevState);
    };
    
    return (
        <>
            <CustomOverlayMap position={position} zIndex={900}>
                <motion.div 
                    initial={{ opacity: 0, scale: 0.5, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    exit={{ opacity: 0, scale: 0.5, y: 10 }}
                    onClick={toggleHandler}
                    className={classes.marker_image_box}
                >
                    <img src={parkingImage} className={classes.marker_image}/>
                </motion.div>
            </CustomOverlayMap>
            <CustomOverlayMap
                zIndex={1000}
                position={position}>
                {isVisible && (
                    <div style={{ zIndex : 1000 }} className={classes.customoverlay}>
                        <p onClick={() => goDetailPlaceHandler(parkingData)}>
                            <span className={classes.title}>{parkingData.name}</span>
                            <span className={classes.capacity}>{`현재 주차 가능 대수 : ${parkingData.currentInfo}`}</span>
                            <span className={`${classes.operatingStatus} ${getOperatingStatus(parkingData) === '운영 중' ? classes.open : classes.closed}`}>{getOperatingStatus(parkingData)}</span>                 </p>
                    </div>
                )}
            </CustomOverlayMap>
        </>
        
    )
};
export default EventMarkerContainer;