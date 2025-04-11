import React, { useState, useContext } from "react";
import classes from "./ChattingPage.module.css";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { IoIosSettings } from "react-icons/io";
import { motion } from "framer-motion";
import loginContext from "../store/login-context";
import AllChatRoomList from "../components/ChattingPageComponents/AllChatRoomList";
import MyChatRoomList from "../components/ChattingPageComponents/MyChatRoomList";
import Chat from "../components/ChattingPageComponents/Chat";
import KeywordRoomForm from "../components/ChattingPageComponents/KeywordRoomForm";
import { unreadClearService } from "../api/ChatService";

const formatChatTime = (timestamp) => {

    if (!timestamp){
        return "등록된 채팅이 존재하지 않습니다."
    }
    
    const now = new Date();
    const chatTime = new Date(timestamp);
    const diffMs = now - chatTime;
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const isSameDay = now.toDateString() === chatTime.toDateString();
    
    if (diffMinutes < 60) {
        if (diffMinutes === 0){
            return '1분 전';
        }
        return `${diffMinutes}분 전`;
    } else if (isSameDay) {
        return chatTime.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
    } else {
        return chatTime.toLocaleDateString("ko-KR", { month: "numeric", day: "numeric" }) + "일";
    }
}

const ChattingPage = () => {

    const navigate = useNavigate()
    const [type,setType] = useState(1);
    const [isChat,setIsChat] = new useState(false);
    const [chatRoom,setChatRoom] = new useState({});
    const loginCtx = useContext(loginContext);

    const setTypeHandler = (type) => {
        setType(type);
    };
    
    const goSettingPageHandler = () => {
        navigate('/setting');
    };

    const executeChatHandler = async (chatRoom) => {
        const unreadCountClearResponse = await unreadClearService(
            chatRoom.roomId,loginCtx.memberId);
        setType(3);
        setIsChat(true);
        setChatRoom(chatRoom);
    };
    
    const disconnectChatHandler = () => {
        setIsChat(false);
        setChatRoom({});
        setType(2);
    };

    const goMainPageHandler = () => {
        navigate(-1);
    };

    return (
        <React.Fragment>
            <div className={classes.header}>
                <motion.div whileHover={{ scale : 1.1 }}
                    >
                        <IoIosArrowBack 
                            className={classes.back_icon}
                            onClick={goMainPageHandler}/>
                </motion.div>
                <h3 className={classes.header_text}>채팅 참여 </h3>
                <motion.div whileHover={{ scale : 1.1 }} onClick={goSettingPageHandler}>
                    <IoIosSettings 
                        className={classes.back_icon}/>
                </motion.div>
            </div>
            <div className={classes.description_container}>
                <p className={classes.description}>
                    {loginCtx.name}님의 채팅 목록입니다. <br/>
                    주차장과 관련된 정보를 다른 사용자와 교환해보세요!
                </p>
            </div>
            {type !== 3 && (
                <div className={classes.type_container}>
                    <motion.button 
                        whileHover={{ scale : 1.1 }}
                        className={classes.type_button} onClick={() => setTypeHandler(1)}># 전체 채팅방</motion.button>
                    <motion.button 
                        whileHover={{ scale : 1.1 }}
                        className={classes.type_button} onClick={() => setTypeHandler(2)}># 나의 채팅방</motion.button>
                    <motion.button 
                        whileHover={{ scale : 1.1 }}
                        className={classes.type_button} onClick={() => setTypeHandler(4)}># 채팅방 검색</motion.button>
                </div>
            )}
            {type === 1 &&  loginCtx.memberId && <AllChatRoomList 
                onFormatChatTime={formatChatTime}
                onChatExecute={executeChatHandler} member={loginCtx}/>}
            {type === 2 &&  loginCtx.memberId && <MyChatRoomList 
                onFormatChatTime={formatChatTime}
                onChatExecute={executeChatHandler} member={loginCtx}/>}
            {type === 3 && isChat && <Chat onChatDisconnect={disconnectChatHandler} member={loginCtx} chatRoom={chatRoom}/>}
            {type === 4 && 
                <KeywordRoomForm member={loginCtx} onChatExecute={executeChatHandler} />}
        </React.Fragment>
    )
};

export default ChattingPage;