import React, { useState, useEffect } from "react";
import classes from "./AuthPage.module.css";
import SignupContainer from "../components/AuthPageComponents/SignupContainer";
import LoginContainer from "../components/AuthPageComponents/LoginContainer";
import FindIdContainer from "../components/AuthPageComponents/FindIdContainer";
import FindPasswordContainer from "../components/AuthPageComponents/FindPasswordContainer";
import { motion } from "framer-motion";
import { useLocation } from 'react-router-dom';

const AuthPage = () => {

    const [type,setType] = new useState(1);
    const location = useLocation();

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const typeFromQuery = urlParams.get('type');
        setType(typeFromQuery ? parseInt(typeFromQuery) : 1);
    }, [location]);

    const links = [
        { type: 1, label: "로그인" },
        { type: 2, label: "회원가입" },
        { type: 3, label: "아이디 찾기" },
        { type: 4, label: "비밀번호 찾기" },
    ];

    const typeChangeHandler = (type) => {
        setType(type);
    };

    return (
        <>
            <React.Fragment>
                <div className={classes.wrapper}>
                    <div className={classes.auth_form}>
                        <div className={classes.header}>
                            <h1>VeTT Service</h1>
                            <p className={classes.description}>
                                반려동물 병원, 약국, 산책로부터 AI 및 그룹 채팅까지 <br/>
                                반려동물과 관련된 여러 정보들을 만나보실 수 있습니다. <br/>
                            </p>
                        </div>
                        {type === 1 && <LoginContainer/>}
                        {type === 2 && <SignupContainer/>}
                        {type === 3 && <FindIdContainer/>}
                        {type === 4 && <FindPasswordContainer typeChangeHandler={typeChangeHandler}/>}
                        <div className={classes.link_wrapper}>
                            {links
                                .filter(link => link.type !== type)
                                .map(link => (
                                <motion.span 
                                    whileHover={{ color: '#0710af'}}
                                    key={link.type} onClick={() => typeChangeHandler(link.type)} className={classes.link}>
                                    {link.label}
                                </motion.span>
                            ))}
                        </div>
                    </div> 
                </div>
            </React.Fragment>
        </>
    )
};

export default AuthPage;