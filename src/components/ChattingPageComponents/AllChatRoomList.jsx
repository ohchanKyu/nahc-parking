import React ,{ useEffect, useState } from "react";
import classes from "./ChatRoomList.module.css";
import { createRoomService, getAllChatRoomsService,
    getMyChatRootService, registerNewMemberToChatRoomService } from '../../api/ChatRoomService';
import ChatImg from "../../assets/chat.png";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import LoadingModal from "../../layout/LoadingModal";

const AllChatRoomList = (props) => {

    const memberId = props.member.memberId;
    const [chatRooms,setChatRooms] = new useState([]);
    const [title, setTitle] = new useState('');
    const [isError,setIsError] = new useState(false);
    const [errorMessage,setErrorMessage] = new useState('');
    const [isSubmit, setIsSubmit] = new useState(false);

    const titleChangeHandler = (event) => {
        setTitle(event.target.value);
        setIsError(false);
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
        const fetchCreateRoomData = { ...createRoomResponseData, lastMessageTime : props.onFormatChatTime(createRoomResponseData.lastMessageTime)}
        if (createRoomResponse.success) {
            setTimeout(() => {
                setTitle('');
                fetchAllChatRoomsHandler();
                setIsSubmit(false);
                props.onChatExecute(fetchCreateRoomData);
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
        const registerResponse = await registerNewMemberToChatRoomService(roomId,memberId);
        if (registerResponse.success) {
            setTimeout(() => {
                props.onChatExecute(registerResponse.data);
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

    useEffect(() => {
        fetchAllChatRoomsHandler();
    }, []);

    return (
        <React.Fragment>
            {isSubmit && <LoadingModal/>}
                    {chatRooms.length > 0 && (
                        <ul className={classes.chatRoom_list}>
                            <AnimatePresence>
                                {chatRooms.map((item) => {
                                    return (
                                        <div key={item.roomId} className={classes.chatRoom_box_container}>
                                            <motion.div 
                                                className={classes.chatRoom_box} 
                                                initial={{ opacity: 0, x: -100 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 100 }}
                                                transition={{ duration: 0.5, ease: "easeOut" }}
                                            >
                                                <div className={classes.chatRoom_card}>
                                                    <div className={classes.chatRoom_header}>
                                                        <h3 className={classes.chatRoom_title}>{item.chatTitle}</h3>
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
                                        </div>
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
            <div className={classes.createRoom_container_box}>
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
        </React.Fragment>
    )
};

export default AllChatRoomList;