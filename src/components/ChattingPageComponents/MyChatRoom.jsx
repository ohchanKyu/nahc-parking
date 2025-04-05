import React, { useEffect, useRef, useState } from "react";
import classes from "./MyChatRoom.module.css";
import { motion } from "framer-motion";
import ChatImg from "../../assets/chat.png";
import { BsPinFill } from "react-icons/bs";
import { Client } from '@stomp/stompjs';

const baseURL =  window.location.hostname === 'localhost' 
? 'ws://localhost:8080/ws' 
: `${import.meta.env.VITE_BACKEND_URL}/ws`;

const MyChatRoom = (props) => {

    const chatRoom = props.chatRoom;
    const [lastMessageInfo, setLastMessageInfo] = useState({
        content : props.chatRoom.lastMessage,
        time : props.chatRoom.lastMessageTime,
        unreadCount : props.chatRoom.unreadCount
    });

    const stompClient = useRef(null);

    const connect = (roomId) => {
        const socket = new WebSocket(baseURL);
        stompClient.current = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            onConnect: () => {
                console.log(`[+] Connected to room ${roomId}`);
                stompClient.current.subscribe(`/sub/chatroom/${roomId}`, (message) => {
                    const newMessageBody = JSON.parse(message.body);
                    setLastMessageInfo((prevInfo) => {

                        const time = props.onFormatChatTime(newMessageBody.time);
                        const content = newMessageBody.content;
                        
                        const updatedMessages = {
                            ...prevInfo,
                            time,content, unreadCount : prevInfo.unreadCount + 1
                        }
                        return updatedMessages;
                    })
                });
            },
            onWebSocketClose: () => {
                console.log("[-] WebSocket connection closed.");
            },
            onWebSocketError: (error) => {
                console.error("[-] WebSocket error:", error);
            },
            onStompError: (frame) => {
                console.error("Broker reported error:", frame.headers['message']);
                console.error("Additional details:", frame.body);
            },
        });
        stompClient.current.activate();
    };
    
    const disconnect = () => {
        if (stompClient.current) {
            stompClient.current.deactivate();
            stompClient.current = null;
        }
    };

    useEffect(() => {
        if (!props.chatRoom.roomId) return;
        if (stompClient.current && stompClient.current.connected) {
            console.log("WebSocket already connected, skipping reconnect.");
            return;
        }
        connect(props.chatRoom.roomId);
        return () => {
            disconnect();
        };
    }, [props.chatRoom]);

    const Badge = ({ count }) => {
        return count > 0 ? <span className={classes.badge}>{count}</span> : null;
    };

    return (
        <React.Fragment>
            {chatRoom && (
                 <div className={classes.myChatRoom_box_container}>
                    <motion.div 
                        className={classes.chatRoom_box} 
                        initial={{ opacity: 0, x: -100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 100 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                        <div className={classes.chatRoom_card}>
                            <div className={classes.chatRoom_header}>
                                <img className={classes.chatRoom_image} src={ChatImg} alt="chat_img" />
                                <div className={classes.chatRoom_text_header}>
                                    <h3 className={classes.chatRoom_title}>{chatRoom.pinId && <BsPinFill/>} {chatRoom.chatTitle} </h3>
                                    {chatRoom.lastMessage && <p className={classes.chatRoom_last_message}>{lastMessageInfo.content}</p>}
                                </div>
                                <div className={classes.last_message_container}>
                                    <p className={classes.last_message_time}>{lastMessageInfo.time}</p>
                                    <Badge count={lastMessageInfo.unreadCount} />
                                </div>
                            </div>
                            <div className={classes.chatRoom_info}>
                                <button onClick={() => props.onUnparticipateChat(chatRoom.roomId)}
                                    className={classes.chatRoom_isExit}>나가기</button>
                                {chatRoom.pinId && (
                                    <button onClick={() => props.onDeletePin(chatRoom.pinId)}
                                    className={classes.chatRoom_isExit}>Pin 해제</button>
                                )}
                                {!chatRoom.pinId && (
                                    <button onClick={() => props.onAddPin(chatRoom.roomId)}
                                    className={classes.chatRoom_isExit}>Pin 등록</button>
                                )}
                                <p className={classes.chatRoom_members}>{chatRoom.memberCount}명</p>
                                <p className={classes.chatRoom_date}>{chatRoom.createdDateTime.split('T')[0]} 생성</p>
                            </div>
                            <div className={classes.chatRoom_buttons}>
                                    <button className={classes.chatRoom_joinButton}
                                    onClick={() => props.onParticipateChat(chatRoom)}>채팅창 켜기</button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </React.Fragment>
    )
};

export default MyChatRoom;