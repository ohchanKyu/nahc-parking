import React, { useEffect, useState, useContext } from "react";
import classes from "./ChatRoomList.module.css";
import { createRoomService, getAllChatRoomsService, 
    getMyChatRootService, registerNewMemberToChatRoomService,
    unregisterMemberToChatRoomService } from '../../api/ChatRoomService';
import ChatImg from "../../assets/chat.png";
import Chat from "./Chat";
import loginContext from "../../store/login-context";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import Loading from "../LayoutComponents/Loading";
import { getMyChatRootService } from "../../api/ChatRoomService";


const ChatRoomList = () => {

    const loginCtx = useContext(loginContext);
    const memberId = loginCtx.memberId;

    const [chatRooms,setChatRooms] = new useState([]);
    const [myChatRooms,setMyChatRooms] = new useState([]);
    const [title, setTitle] = new useState('');
    const [isError,setIsError] = new useState(false);
    const [errorMessage,setErrorMessage] = new useState('');
    const [isChat,setIsChat] = new useState(false);
    const [chatRoom,setChatRoom] = new useState({});
    const [isSubmit, setIsSubmit] = new useState(false);

    const titleChangeHandler = (event) => {
        setTitle(event.target.value);
        setIsError(false);
    }
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

    const fetchAllChatRoomsHandler = async () => {
        setIsSubmit(true);
        const chatRoomsResponse = await getAllChatRoomsService();
        if (chatRoomsResponse.success){
            const chatRoomsResponseData = await chatRoomsResponse.data.chatRoomList;
            const myChatRoomsResponse = await getMyChatRootService(memberId);
            if (myChatRoomsResponse.success){
                const myChatRoomsResponseData = await myChatRoomsResponse.data.chatRoomList;
                const fetchAllRoomsData = chatRoomsResponseData.map(item => {
                    const isParticipate = myChatRoomsResponseData.some(myChatRoom => myChatRoom.roomId === item.roomId);
                    if (isParticipate) {
                        return { ...item, isParticipate : true };
                    }else{
                        return {... item, isParticipate : false }
                    };
                });
                setChatRooms(fetchAllRoomsData);
                const fetchMyChatRoomResponse = myChatRoomsResponseData.map(item => {
                    return { ...item, lastMessageTime : formatChatTime(item.lastMessageTime)}
                });
                setMyChatRooms(fetchMyChatRoomResponse)
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
        }else{
            const errorMessage = chatRoomsResponse.message;
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

    const createRoomHandler = async () => {
        if (title.trim().length < 2 || title.trim().length > 50){
            setIsError(true);
            setErrorMessage("채팅방 제목은 2자에서 50자만 입력가능합니다.");
            return;
        }
        setIsSubmit(true);
        const createRoomResponse = await createRoomService({ memberId, title });
        const createRoomResponseData = await createRoomResponse.data
        const fetchCreateRoomData = { ...createRoomResponseData, lastMessageTime : formatChatTime(createRoomResponseData.lastMessageTime)}
        if (createRoomResponse.success) {
            setTimeout(() => {
                setTitle('');
                fetchAllChatRoomsHandler();
                setIsSubmit(false);
                participateChatHandler(fetchCreateRoomData);
            },1500);
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

    const participateNewChatRoomHandler = async (roomId) => {

        setIsSubmit(true);
        const registerResponse = await registerNewMemberToChatRoomService(roomId, memberId);
        
        if (registerResponse.success) {
            setTimeout(() => {
                fetchAllChatRoomsHandler();
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
    
    const unParticipateChatRoomHandler = async (roomId) => {

        setIsSubmit(true);
        const unregisterResponse = await unregisterMemberToChatRoomService(roomId,memberId);
        if (unregisterResponse.success){
            setTimeout(() => {
                fetchAllChatRoomsHandler();
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

    const participateChatHandler = (room) => {
        setChatRoom(room);
        setIsChat(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };
    
    const unParticipateChatHandler = () => {
        setChatRoom({});
        setIsChat(false);
        fetchAllChatRoomsHandler();
    };

    useEffect(() => {
        fetchAllChatRoomsHandler();
    }, []);


    return (
        <>
            {isSubmit && <Loading/>}
            <div className={classes.chatRoom_container}>
                <div className={classes.all_chatRoom_container}>
                    <h2 className={classes.chatRoom_header_text}>All ChatRooms</h2>
                    <AnimatePresence>
                        {chatRooms.length > 0 && (
                            <ul className={classes.chatRoom_list}>
                                <AnimatePresence>
                                {chatRooms.map(item => {
                                    return (
                                        <motion.div 
                                            className={classes.chatRoom_box} 
                                            key={item.roomId} 
                                            initial={{ opacity: 0, x: -100 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 100 }}
                                            transition={{ duration: 0.5, ease: "easeOut" }}
                                        >
                                            <div className={classes.chatRoom_card}>
                                                <div className={classes.chatRoom_header}>
                                                    <h3 className={classes.chatRoom_title}>{item.title}</h3>
                                                    <img className={classes.chatRoom_image} src={ChatImg} alt="chat_img" />
                                                </div>
                                                <div className={classes.chatRoom_info}>
                                                    {item.isParticipate ? <p className={classes.chatRoom_isOpen}>참여중</p> : <p className={classes.chatRoom_isOpen}>참여 가능</p>}
                                                    <p className={classes.chatRoom_members}>{item.memberCount}명 참여</p>
                                                    <p className={classes.chatRoom_date}>{item.createdDateTime.split('T')[0]}</p>
                                                </div>
                                                {!item.isParticipate && (
                                                    <div className={classes.chatRoom_buttons}>
                                                        <button 
                                                            onClick={() => participateNewChatRoomHandler(item.roomId)}
                                                            className={classes.chatRoom_joinButton}>참여하기</button>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )
                                })}
                                </AnimatePresence>
                            </ul>
                        )}
                        {chatRooms.length === 0 && 
                        <motion.p 
                            className={classes.no_room_message}
                            initial={{ opacity: 0, x: -100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 100 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}>
                                아직 등록된 채팅방이 없습니다. <br/>
                                채팅방을 등록해보세요!
                        </motion.p>}
                    </AnimatePresence>
                    <div className={classes.createRoom_container}>
                        <p className={classes.createRoom_description}>찾으시는 채팅방이 없으신가요? <br/> 원하는 채팅방을 만들어보세요.</p>
                        <h3 className={classes.createRoom_title}>채팅방 제목을 입력을 입력하세요.</h3>
                        <input 
                            onChange={titleChangeHandler}
                            className={classes.createRoom_title_input} 
                            type='text' value={title}/>
                        <AnimatePresence>
                            {isError && (
                                <motion.p
                                    className={classes.error_message}
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -5 }}
                                >
                                    {errorMessage}
                                </motion.p>
                            )}
                        </AnimatePresence>
                        <motion.button 
                            whileHover={{ scale : 1.05 }} 
                            className={classes.createRoom_submit_button} 
                            onClick={createRoomHandler}>
                                채팅방 만들기</motion.button>
                    </div>
                </div>
                <div className={classes.access_container}>
                    <div className={classes.my_access_container}>
                        <div className={classes.my_chatRoom_container}>
                            <div className={classes.chatRoom_header_my_ctn}>
                                <h2 className={classes.chatRoom_header_text_my}>Accessing</h2>
                                <h2 className={classes.chatRoom_header_text_count}>{myChatRooms.length}</h2>
                            </div>
                            <AnimatePresence>
                                {myChatRooms.length > 0 && (
                                    <ul className={classes.chatRoom_list}>
                                        <AnimatePresence>
                                        {myChatRooms.map(item => {
                                            return (
                                                <motion.div 
                                                    className={classes.chatRoom_box} 
                                                    key={item.roomId} 
                                                    initial={{ opacity: 0, x: -100 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: 100 }}
                                                    transition={{ duration: 0.5, ease: "easeOut" }}
                                                >
                                                    <div className={classes.chatRoom_card}>
                                                        <div className={classes.chatRoom_header}>
                                                            <div className={classes.chatRoom_text_header}>
                                                                <div className={classes.chatRoom_title_container}>
                                                                    <h3 className={classes.chatRoom_title}>{item.title}</h3>
                                                                </div>
                                                            </div>
                                                            <img className={classes.chatRoom_image} src={ChatImg} alt="chat_img" />
                                                        </div>
                                                        <div className={classes.chatRoom_info}>
                                                            {chatRoom.roomId !== item.roomId ? <button
                                                                onClick={() => unParticipateChatRoomHandler(item.roomId)}
                                                                className={classes.chatRoom_isExit}>나가기</button> :  
                                                                <p className={classes.chatRoom_isNotExit}>채팅 참여중</p>}
                                                            <p className={classes.chatRoom_members}>{item.memberCount}명</p>
                                                            <p className={classes.chatRoom_date}>{item.createdDateTime.split('T')[0]}</p>
                                                        </div>
                                                        {chatRoom.roomId !== item.roomId && (
                                                            <div className={classes.last_message_container}>
                                                                {item.lastMessage && <p className={classes.chatRoom_last_message}>{item.lastMessage}</p>}
                                                                <p className={classes.last_message_time}>{item.lastMessageTime}</p>
                                                            </div>
                                                        )}
                                                        {!chatRoom.roomId && (
                                                            <div className={classes.chatRoom_buttons}>
                                                                <button className={classes.chatRoom_joinButton}
                                                                onClick={() => participateChatHandler(item)}>채팅창 켜기</button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            )
                                        })}
                                        </AnimatePresence>
                                    </ul>
                                )}
                                {myChatRooms.length === 0 && 
                                    <motion.p 
                                        className={classes.no_room_message}
                                        initial={{ opacity: 0, x: -100 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 100 }}
                                        transition={{ duration: 0.5, ease: "easeOut" }}>
                                            아직 등록하신 채팅방이 존재하지 않습니다.
                                    </motion.p>}
                            </AnimatePresence>
                        </div>
                        <AnimatePresence>
                            {isChat && (
                                <motion.div
                                    initial={{ opacity: 0, y: -100 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 100 }}
                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                >
                                    <Chat unParticipateChatHandler={unParticipateChatHandler} chatRoom={chatRoom} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </>
    )
};

export default ChatRoomList;
