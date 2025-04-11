import React from 'react';
import classes from "./AroundSearch.module.css";
import { useNavigate } from "react-router-dom";
import { FaLocationDot } from "react-icons/fa6";
import { FaPhoneAlt } from "react-icons/fa";
import { IoIosTime } from "react-icons/io";
import { MdAttachMoney } from "react-icons/md";
import { motion } from 'framer-motion';
import { IoArrowRedo } from "react-icons/io5";
import { MdNavigateNext } from "react-icons/md";

const naverMapURL = 'http://map.naver.com/index.nhn?';

const AroundSearch = (props) => {

    const navigate = useNavigate();

    const isPublicHoliday = (date) => {
        const holidays = [
            "01-01", "03-01", "05-05", "06-06", "08-15", "10-03", "10-09", "12-25"
        ];
        const formattedDate = `${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
        return holidays.includes(formattedDate);
    };

    const currentOperatingStatus = () => {
        const now = new Date();
        const day = now.getDay();
        let startTime, endTime;
        if (day === 0 || isPublicHoliday(now)) {
            startTime = props.parking.holidayStartTime;
            endTime = props.parking.holidayEndTime;
        } else if (day >= 1 && day <= 5) {
            startTime = props.parking.weekdayStartTime;
            endTime = props.parking.weekdayEndTime;
        } else {
            startTime = props.parking.weekendStartTime;
            endTime = props.parking.weekendEndTime;
        }
        return { startTime, endTime };
    }

    const getOperatingStatus = () => {
        
        const now = new Date();
        const day = now.getDay();
        const currentTime = now.getHours() * 60 + now.getMinutes();

        let startTime, endTime;
        if (day === 0 || isPublicHoliday(now)) {
            startTime = props.parking.holidayStartTime;
            endTime = props.parking.holidayEndTime;
        } else if (day >= 1 && day <= 5) {
            startTime = props.parking.weekdayStartTime;
            endTime = props.parking.weekdayEndTime;
        } else {
            startTime = props.parking.weekendStartTime;
            endTime = props.parking.weekendEndTime;
        }
        if (startTime === "00:00" && endTime === "00:00") return "운영 중";
        const startMinutes = parseInt(startTime.split(":")[0]) * 60 + parseInt(startTime.split(":")[1]);
        const endMinutes = parseInt(endTime.split(":")[0]) * 60 + parseInt(endTime.split(":")[1]);
        return currentTime >= startMinutes && currentTime <= endMinutes ? "운영 중" : "운영 종료";
    };

    const goPlaceDetailPage = (parkingInfo) => {
        const params = new URLSearchParams({
            latitude : parkingInfo.latitude,
            longitude : parkingInfo.longitude,
            id :  parkingInfo.id,
        }).toString();
        navigate(`/detail?${params}`);
    };

    const goRouteDetailHandler = () => {
        const slng = props.location.longitude
        const slat = props.location.latitude

        const elng = props.parking.longitude
        const elat = props.parking.latitude
        const etext = props.parking.name
        let url = `${naverMapURL}slng=${slng}&slat=${slat}&stext=${'현재 위치'}&elng=${elng}&elat=${elat}&pathType=0&showMap=true&etext=${etext}&menu=route`;
        window.open(url,'_blank');
    };
    return (
        <React.Fragment>
            <div 
                className={classes.container}>
                <div className={classes.traffic_container}>
                    <div className={classes.traffic_time}>
                        <p className={classes.car_time}>차량 소요 시간 <IoArrowRedo className={classes.arrow}/> {props.route ? `${props.route.time}` : 'NaN'}</p>
                        <p className={classes.road_time}>택시 예상 요금 <IoArrowRedo className={classes.arrow}/> {props.route ? `${props.route.taxiFare}` : 'NaN'}</p>
                    </div>
                    <div className={classes.traffic_info}>
                        <p className={classes.car_price}>톨게이트 비용 <IoArrowRedo className={classes.arrow}/> {props.route ? `${props.route.tollFare}` : 'NaN'}</p>
                        <p className={classes.distance}>거리 <IoArrowRedo className={classes.arrow}/>{props.route ? `${props.route.distance}` : 'NaN'}</p>
                    </div>
                </div>
                <div className={classes.header_container}>
                    <h4 className={classes.placeName}># {props.parking.name}</h4>
                    <div className={classes.wrapper}>
                        <div className={classes.text}>
                            <p className={classes.address}><FaLocationDot style={{ marginRight : '5px'}}/>
                            <span>{props.parking.address}</span>
                            </p>
                            <p className={classes.phoneNumber}><FaPhoneAlt style={{ marginRight : '7px'}}/> <span>{props.parking.phoneNumber}</span></p>
                            <p className={classes.time}><IoIosTime style={{ marginRight : '7px'}}/> <span>{`${currentOperatingStatus().startTime} ~ ${currentOperatingStatus().endTime}`}  <span className={`${classes.operatingStatus} ${getOperatingStatus() === '운영 중' ? classes.open : classes.closed}`}>{getOperatingStatus()}</span> </span></p>
                            <p className={classes.price}>
                                <MdAttachMoney style={{ marginRight : '7px'}}/> 
                                    <span>{props.parking.feeInfo}</span>
                                </p>
                        </div>
                        <div className={classes.button_container}>
                            <motion.button 
                                onClick={() => goPlaceDetailPage(props.parking)}
                                whileHover={{ scale : 1.1 }}
                                className={classes.detail_button}>
                                    상세 정보 <MdNavigateNext style={{ marginLeft:'5px'}}/>
                            </motion.button>
                            <motion.button 
                                onClick={goRouteDetailHandler}
                                whileHover={{ scale : 1.1 }}
                                className={classes.route_button}>
                                    길찾기 <MdNavigateNext style={{ marginLeft:'5px'}}/>
                            </motion.button>
                        </div>
                    </div>
                </div>
                <div className={classes.capacity}>
                    <div className={classes.totalCapacity}># 전체 주차면 <br/> {props.parking.totalSpace}면</div>
                    <div className={classes.dash}>|</div>
                    <div className={classes.currentCapacity}># 주차 가능면 <br/> <p className={classes.message}>{props.parking.currentInfo}</p></div>
                </div>
            </div>
        </React.Fragment>
    )
};

export default AroundSearch;