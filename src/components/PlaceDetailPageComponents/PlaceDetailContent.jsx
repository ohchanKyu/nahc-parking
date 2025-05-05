import React from "react";
import { FaPhoneAlt, FaMapMarkerAlt, FaClock, FaCar, FaTag } from "react-icons/fa";
import classes from "./PlaceDetailContent.module.css";
import { MdAttachMoney } from "react-icons/md";

const PlaceDetailContent = ({ item }) => {
    
    const isPublicHoliday = (date) => {
        const holidays = [
            "01-01", "03-01", "05-05", "06-06", "08-15", "10-03", "10-09", "12-25"
        ];
        const formattedDate = `${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
        return holidays.includes(formattedDate);
    };

    const getOperatingStatus = () => {
        const now = new Date();
        const day = now.getDay();
        const currentTime = now.getHours() * 60 + now.getMinutes();

        let startTime, endTime;
        if (day === 0 || isPublicHoliday(now)) {
            startTime = item.holidayStartTime;
            endTime = item.holidayEndTime;
        } else if (day >= 1 && day <= 5) {
            startTime = item.weekdayStartTime;
            endTime = item.weekdayEndTime;
        } else {
            startTime = item.weekendStartTime;
            endTime = item.weekendEndTime;
        }
        if (startTime === "00:00" && endTime === "00:00") return "운영 중";
        const startMinutes = parseInt(startTime.split(":")[0]) * 60 + parseInt(startTime.split(":")[1]);
        const endMinutes = parseInt(endTime.split(":")[0]) * 60 + parseInt(endTime.split(":")[1]);

        return currentTime >= startMinutes && currentTime <= endMinutes ? "운영 중" : "운영 종료";
    };

    return (
        <div className={classes.container}>
            {item && (
                <div className={classes.card}>
                <h1 className={classes.title}>{item.name}</h1>
                <div className={classes.details}>
                    <div className={classes.info}><div><FaMapMarkerAlt className={classes.icon} />주소</div> {item.address}</div>
                    <div className={classes.info}><div><FaTag className={classes.icon} />카테고리</div> {item.category}</div>
                    <div className={classes.info}><div><FaTag className={classes.icon} />유형</div> {item.type}</div>
                    <div className={classes.info}><div><FaCar className={classes.icon} />총 주차 공간</div> {item.totalSpace}대</div>
                    <div className={classes.info}><div><FaCar className={classes.icon} />현재 주차 공간</div> {item.currentInfo}</div>
                    <div className={classes.info}><div><FaPhoneAlt className={classes.icon} />전화번호</div> {item.phoneNumber}</div>
                    <div className={classes.info}><div><MdAttachMoney className={classes.icon} />요금</div> {item.feeInfo}</div>
                </div>
                <div className={classes.operatingHours}>
                    <h3 className={classes.fee_header}><FaClock className={classes.icon} />운영 시간</h3>
                    {['월', '화', '수', '목', '금'].map((day) => (
                    <div key={day} className={classes.time}><span>{day}요일</span><span>{item.weekdayStartTime} - {item.weekdayEndTime}</span></div>
                    ))}
                    <div className={classes.time}><span>토요일</span><span>{item.weekendStartTime} - {item.weekendEndTime}</span></div>
                    <div className={classes.time}><span>일요일</span><span>{item.holidayStartTime} - {item.holidayEndTime}</span></div>
                    <div className={classes.time}><span>공휴일</span><span>{item.holidayStartTime} - {item.holidayEndTime}</span></div>
                </div>
                <div className={`${classes.operatingStatus} ${getOperatingStatus() === '운영 중' ? classes.open : classes.closed}`}>{getOperatingStatus()}</div>
                </div>
            )}
        </div>
    );
};

export default PlaceDetailContent;
