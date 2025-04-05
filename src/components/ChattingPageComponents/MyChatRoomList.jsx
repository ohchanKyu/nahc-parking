import React,{ useEffect, useState } from "react";
import classes from "./ChatRoomList.module.css";
import { getMyChatRootService, unregisterMemberToChatRoomService } from '../../api/ChatRoomService';
import { isPinService, addPinService, deletePinService } from "../../api/ChatRoomPinService";
import { getUnreadCountService } from "../../api/ChatService";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import LoadingModal from "../../layout/LoadingModal";
import MyChatRoom from "./MyChatRoom";

const MyChatRoomList = (props) => {

    const memberId = props.member.memberId;
    const [myChatRooms,setMyChatRooms] = new useState([]);
    const [isSubmit, setIsSubmit] = new useState(false);
    
    const isPinHandler = async (roomId) => {
        const isPinResponse = await isPinService(roomId,memberId);
        const isPinResponseData = await isPinResponse.data;
        return isPinResponseData;
    };

    const addPinHandler = async (roomId) => {
        const addPinResponse = await addPinService(roomId, memberId);
        fetchMyChatRoomsHandler();
    };

    const deletePinHandler = async (pinId) => {
        const deletePinResponse = await deletePinService(pinId);
        fetchMyChatRoomsHandler();
    };

    const unParticipateChatRoomHandler = async (roomId) => {
    
        setIsSubmit(true);
        const unregisterResponse = await unregisterMemberToChatRoomService(roomId,memberId);
        if (unregisterResponse.success){
            setTimeout(() => {
                fetchMyChatRoomsHandler();
                setIsSubmit(false);
            },1500)
        }else{
            const errorMessage = createRoomResponse.message;
            toast.error(`일시적 오류입니다. \n ${errorMessage}`, {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            setIsSubmit(false);
        }
    };
    const fetchMyChatRoomsHandler = async () => {
        setIsSubmit(true);
        const myChatRoomsResponse = await getMyChatRootService(memberId);
        if (myChatRoomsResponse.success){
            const myChatRoomsResponseData = await myChatRoomsResponse.data.chatRoomList;
            const fetchMyChatRoomResponse = myChatRoomsResponseData.map(item => {
                return { ...item, lastMessageTime : props.onFormatChatTime(item.lastMessageTime)}
            });
            const fetchPinRoomResponse = [];
            for(var i=0;i<fetchMyChatRoomResponse.length;i++){
                const pinId = await isPinHandler(fetchMyChatRoomResponse[i].roomId);
                const unreadCountResponse = await getUnreadCountService(fetchMyChatRoomResponse[i].roomId, memberId);
                const unreadCount = unreadCountResponse.data;
                const newChatRoomData = {
                    ...fetchMyChatRoomResponse[i],
                    pinId,
                    unreadCount
                }
                if (pinId){
                    fetchPinRoomResponse.unshift(newChatRoomData);
                }else{
                    fetchPinRoomResponse.push(newChatRoomData);
                }
            }
            setMyChatRooms(fetchPinRoomResponse)
            setIsSubmit(false);
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
            setIsSubmit(false);
        }
    };

    const participateChatHandler = (room) => {
        props.onChatExecute(room);
    };

    useEffect(() => {
        fetchMyChatRoomsHandler();
    }, []);

    return (
        <React.Fragment>
            {isSubmit && <LoadingModal/>}
            <div className={classes.header_box_container}>
                <div className={classes.chatRoom_header_my_ctn}>
                    <h2 className={classes.chatRoom_header_text_my}>Accessing</h2>
                    <h2 className={classes.chatRoom_header_text_count}>{myChatRooms.length}</h2>
                </div>
            </div>
                <div className={classes.myChatRoom_list_container}>
                    {myChatRooms.length > 0 && (
                        <ul className={classes.chatRoom_list}>
                            <AnimatePresence>
                            {myChatRooms.map((item) => {
                                return (
                                    <MyChatRoom 
                                        onFormatChatTime={props.onFormatChatTime}
                                        onAddPin={addPinHandler} onDeletePin={deletePinHandler}
                                        onParticipateChat={participateChatHandler}
                                        onUnparticipateChat={unParticipateChatRoomHandler}
                                        key={item.roomId} chatRoom={item}/>
                                )
                            })}
                            </AnimatePresence>
                        </ul>
                    )}
                </div>
                {myChatRooms.length === 0 && 
                    <motion.p 
                        className={classes.no_room_message}
                        initial={{ opacity: 0, x: -100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 100 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}>
                            아직 등록하신 채팅방이 존재하지 않습니다.
                    </motion.p>}
        </React.Fragment>
    )
};

export default MyChatRoomList;