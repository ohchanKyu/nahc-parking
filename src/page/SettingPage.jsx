import React, { useContext, useEffect, useState } from "react";
import classes from "./SettingPage.module.css";
import { useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { motion } from "framer-motion";
import { SiHomebridge } from "react-icons/si";
import loginContext from "../store/login-context";
import { getMemberInfoService } from "../api/MemberService";
import { toast } from "react-toastify";
import { getMyChatRootService } from "../api/ChatRoomService";
import LoadingModal from "../layout/LoadingModal";
import { isPinService,  } from "../api/ChatRoomPinService";
import { getUnreadCountService } from "../api/ChatService";
import { getMyBaseBookmarkSerivce } from "../api/BookmarkService";
import ProfileSection from "../components/SettingPageComponents/ProfileSection";
import DataSection from "../components/SettingPageComponents/DataSection";
import BookmarkSection from "../components/SettingPageComponents/BookmarkSection";
import ButtonSection from "../components/SettingPageComponents/ButtonSection";

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

const SettingPage = () => {

    const navigate = useNavigate()
    const loginCtx = useContext(loginContext);
    const [memberData,setMemberData] = useState(null);
    const [chatRoomData,setChatRoomData] = useState(null);
    const [bookmarkData,setBookmarkData] = useState(null);
    const [isLoading,setIsLoading] = useState(false);

    const memberId = loginCtx.memberId;
    
    const gePrevPageHandler = () => {
        navigate(-1);
    };
    const goMainPageHandler = () => {
        navigate('/');
    };
    const isPinHandler = async (roomId) => {
        const isPinResponse = await isPinService(roomId,memberId);
        const isPinResponseData = await isPinResponse.data;
        return isPinResponseData;
    };

    useEffect(() => {
        const getMember = async () => {
            setIsLoading(true);
            const memberInfoResponse = await getMemberInfoService(loginCtx.memberId);
            if (memberInfoResponse.success){
                setMemberData(memberInfoResponse.data);
            }else{
                toast.error("인증에 문제가 생겼습니다. \n 다시 로그인해주세요.", {
                    position: "top-center",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                });
                loginCtx.logoutUser();
                navigate('/auth');
            }
            const myChatRoomsResponse = await getMyChatRootService(loginCtx.memberId);
            if (myChatRoomsResponse.success){
                const myChatRoomsResponseData = await myChatRoomsResponse.data.chatRoomList;
                let pinCnt = 0;
                let unreadCountCnt = 0;
                for(var i=0;i<myChatRoomsResponseData.length;i++){
                    const pinId = await isPinHandler(myChatRoomsResponseData[i].roomId);
                    const unreadCountResponse = await getUnreadCountService(myChatRoomsResponseData[i].roomId, memberId);
                    const unreadCount = unreadCountResponse.data;
                    if (pinId) pinCnt++;
                    unreadCountCnt += unreadCount;
                }
                setChatRoomData({
                    totalCount : myChatRoomsResponseData.length,
                    pinCount : pinCnt,
                    unreadCount : unreadCountCnt,
                })
                setIsLoading(false);
            }else{
                const errorMessage = myChatRoomsResponse.message;
                toast.error(`일시적 오류입니다. \n ${errorMessage}`, {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                setIsLoading(false);
            }
            const myBookmarkResponse = await getMyBaseBookmarkSerivce(memberId);
            let isOpenCnt = 0;
            for(var i=0;i<myBookmarkResponse.data.length;i++){
                const parkingData = myBookmarkResponse.data[i];
                const isOpen = getOperatingStatus(parkingData);
                if (isOpen === '운영 중') isOpenCnt++;
            }
            setBookmarkData({
                totalCount : myBookmarkResponse.data.length,
                openCount : isOpenCnt,
            });
        };
        if (loginCtx.memberId) getMember();
    },[]);

    return (
        <>
            {isLoading && <LoadingModal/>}
            <div className={classes.header}>
                <motion.div whileHover={{ scale : 1.1 }}
                    >
                    <IoIosArrowBack 
                        className={classes.back_icon}
                        onClick={gePrevPageHandler}/>
                </motion.div>
                <h3 className={classes.header_text}>내 프로필</h3>
                 <motion.div whileHover={{ scale : 1.1 }} onClick={goMainPageHandler}>
                    <SiHomebridge 
                        className={classes.back_icon}/>
                </motion.div>
            </div>
            {memberData && <ProfileSection memberData={memberData}/>}
            <div className={classes.section_container}>
                {chatRoomData && <DataSection chatRoomData={chatRoomData}/>}
                {bookmarkData && <BookmarkSection bookmarkData={bookmarkData}/>}
            </div>
            <ButtonSection loginCtx={loginCtx} memberData={memberData}/>
        </>
    )
};

export default SettingPage;