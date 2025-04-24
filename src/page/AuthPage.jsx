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
                            <h1>Parking Mate</h1>
                            <p className={classes.description}>
                               {` 주차장과 관련된 여러 정보를 만나보세요!
                                  실시간으로 다른 사용자와 정보를 공유할 수도 있습니다.`}
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