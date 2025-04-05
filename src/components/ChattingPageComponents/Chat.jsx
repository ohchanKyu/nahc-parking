import React, { useEffect, useState, useRef } from "react";
import { Client } from '@stomp/stompjs';
import classes from "./Chat.module.css";
import { getAllChatMessageService } from "../../api/ChatService";
import { AnimatePresence, motion } from 'framer-motion';
import { Send } from 'lucide-react';
import { ImExit } from "react-icons/im";
import { FaCalendarAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import { unreadClearService } from "../../api/ChatService";

const baseURL =  window.location.hostname === 'localhost' 
? 'ws://localhost:8080/ws' 
: `${import.meta.env.VITE_BACKEND_URL}/ws`;

const Chat = (props) => {
    
    const memberId = props.member.memberId;

    const [messages, setMessages] = useState([]);
    const stompClient = useRef(null);
    const [currentRoom, setCurrentRoom] = useState(null); 
    const [inputMessage,setInputMessage] = useState('');
    const messagesRef = useRef(null);
    const inputRef = useRef(null);
    const [isLoading,setIsLoading] = useState(false);

    const inputMessageHandler = (event) => {
        if (event.target.value.length > 240){
            toast.error("최대 240자까지만 전달가능합니다.", {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }
        setInputMessage(event.target.value);
        adjustTextareaHeight();
    }

    const adjustTextareaHeight = () => {
        
        if (inputRef.current) {
            const textarea = inputRef.current;
            textarea.style.height = "50px";
            if (textarea.scrollHeight > 50) {
                textarea.style.height = `${textarea.scrollHeight}px`;
            }
        }
    };

    const exitChatHandler = () => {
        props.onChatDisconnect();
        disconnect();
    };

    const sendMessageHandler = (event) => {
        
        if (!stompClient.current || !stompClient.current.connected) {
            console.error("STOMP Client is not connected. Cannot send message.");
            return;
        }
        if (event.key === 'Enter' || event.type === 'click') {
            if (event.shiftKey) {
                event.preventDefault();
                setInputMessage(prev => {
                    const newMessage = prev + "\n";
                    requestAnimationFrame(() => adjustTextareaHeight());
                    return newMessage;
                });
                return;
            }
            if (inputMessage.trim().length === 0) {
                event.preventDefault();
                return;
            }
            if (inputMessage.trim().length > 240){
                toast.error("최대 240자까지만 전달가능합니다.", {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                return;
            }
            const body = {
                roomId: currentRoom.roomId,
                content: inputMessage,
                memberId,
            };
            try {
                stompClient.current.publish({
                    destination: "/pub/chat/message",
                    body: JSON.stringify(body),
                });
                if (inputRef.current){
                    inputRef.current.style.height = "auto";
                    inputRef.current.blur();
                    setInputMessage('');
                }
            } catch (error) {
                console.error("Failed to send message:", error);
            }
        }
    };

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
                    setMessages((prevMessages) => {
                        const date = new Date(newMessageBody.time);
                        const formattedDate = date.toLocaleDateString().split('T')[0];
                        const dayOfWeek = date.toLocaleDateString("ko-KR", { weekday: "long" });
                        const newMessageDate = `${formattedDate} ${dayOfWeek}`;
                    
                        const updatedMessages = prevMessages.map((group) => {
                            if (group.date === newMessageDate) {
                                return {
                                    ...group,
                                    messages: [...group.messages, { 
                                        ...newMessageBody, 
                                        time: parseTime(newMessageBody.time) 
                                    }]
                                };
                            }
                            return group;
                        });
                    
                        const dateExists = updatedMessages.some(group => group.date === newMessageDate);
                        if (!dateExists) {
                            updatedMessages.push({
                                date: newMessageDate,
                                messages: [{ 
                                    ...newMessageBody, 
                                    time: parseTime(newMessageBody.time) 
                                }]
                            });
                        }
                    
                        return updatedMessages;
                    });
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

    const groupMessagesByDate = (messages) => {
        return messages.reduce((acc, message) => {
            const date = new Date(message.time);
            const formattedDate = date.toLocaleDateString().split('T')[0];
            const dayOfWeek = date.toLocaleDateString('ko-KR', { weekday: 'long' });
            const dateKey = `${formattedDate} ${dayOfWeek}`; 
    
            if (!acc[dateKey]) {
                acc[dateKey] = [];
            }
            acc[dateKey].push(message);
    
            return acc;
        }, {});
    };

    const parseTime = (timestamp) => {
        const chatTime = new Date(timestamp);
        return chatTime.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", hour12: false });
    } 

    const fetchMessages = async (roomId) => {
        try {
            setIsLoading(true);
            const messageResponse = await getAllChatMessageService(roomId);
            if (messageResponse.success){
                const messageResponseData = await messageResponse.data;
                const groupedMessages = groupMessagesByDate(messageResponseData);
                const fetchMessageResponseData = Object.entries(groupedMessages).map(([date, messages]) => ({
                    date,
                    messages: messages.map(message => ({
                        ...message,
                        time: parseTime(message.time)
                    }))
                }));
                setMessages(fetchMessageResponseData);
            }
            setIsLoading(false);
        } catch (error) {
            console.error("Failed to fetch messages:", error);
        }
    };
    
    useEffect(() => {
        if (!props.chatRoom.roomId) return;
        if (stompClient.current && stompClient.current.connected) {
            console.log("WebSocket already connected, skipping reconnect.");
            return;
        }
        connect(props.chatRoom.roomId);
        fetchMessages(props.chatRoom.roomId);
        setCurrentRoom(props.chatRoom);
        return async () => {
            const unreadCountClearResponse = await unreadClearService(
                props.chatRoom.roomId,props.member.memberId);
            disconnect();
        };
    }, [props.chatRoom]);

    useEffect(() => {
        if (messagesRef.current) {
            messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.scrollTop = inputRef.current.scrollHeight;
        }
    }, [inputMessage]);

    return (
        <>
            <div className={classes.chat_container}>
                <div className={classes.chat_header}>
                    <h2 className={classes.chat_room_title}>{currentRoom && currentRoom.chatTitle}</h2>
                    <div className={classes.exit_chat} onClick={exitChatHandler}>
                        <ImExit />
                    </div>
                </div>
                <div className={classes.chat_messages} ref={messagesRef}>
                    <AnimatePresence>
                        {messages.length === 0 && !isLoading && (
                            <motion.p 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className={classes.no_chat_message}>
                                    등록된 채팅이 존재하지 않습니다.
                            </motion.p>
                        )}
                    </AnimatePresence>
                    <AnimatePresence>
                        {isLoading && (
                            <motion.p 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className={classes.no_chat_message}>
                                    대화를 불러오고 있습니다.
                            </motion.p>
                        )}
                    </AnimatePresence>
                    {messages.map((group, index) => (
                        <div key={index} className={classes.chat_messages_container}>
                            <div className={classes.chat_date_container}>
                                <div className={classes.chat_date}><FaCalendarAlt/> {group.date}</div>
                            </div>
                            {group.messages.map((message, msgIndex) => (
                                message.memberId === memberId ? (
                                    <motion.div key={msgIndex}
                                            className={classes.chat_my_message_container}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3 }}>
                                        <div className={classes.chat_display}>
                                            <div className={classes.chat_time}>{message.time}</div>
                                            <div className={`${classes.chat_message} ${classes.chat_message_self}`}>
                                                {message.content}
                                            </div>
                                        </div>
                                    </motion.div>
                                   
                                ) : (
                                    <motion.div key={msgIndex}
                                            className={classes.chat_message_container}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3 }}>
                                        <p className={classes.name}>{message.name}님</p>
                                        <div className={classes.chat_display}>
                                            <div className={`${classes.chat_message} ${classes.chat_message_other}`}>
                                                {message.content}
                                            </div>
                                            <div className={classes.chat_time}>{message.time}</div>
                                        </div>
                                    </motion.div>
                                )
                            ))}
                        </div>
                    ))}
                </div>
            
                <div className={classes.chat_input_container}>
                    <textarea
                        ref={inputRef}
                        type="text"
                        className={classes.chat_input}
                        placeholder="Type a message..."
                        value={inputMessage}
                        onChange={inputMessageHandler}
                        onKeyDown={sendMessageHandler}
                        style={{ minHeight: "50px", height: inputMessage ? "auto" : "50px" }}
                    />
                    <button
                        onClick={sendMessageHandler}
                        className={classes.chat_send_button}
                    >
                        <Send size={25} />
                    </button>
                </div>
            </div>
        </>

    );
};

export default Chat;
