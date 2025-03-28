import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle } from "lucide-react";
import classes from "./AuthInput.module.css";
import { toast } from "react-toastify";
import { sendVerifyCodeService, isVerifyCodeService } from "../../api/AuthService";

const userIdRegex = /^[a-zA-Z0-9]{7,30}$/;

const VerifyCodeInput = (props) => {

     const [formData, setFormData] = new useState({
        userId: { value: "", placeholder: "가입하신 아이디를 입력하세요" },
        verifyCode: { value: "", placeholder: "메일로 발송된 인증번호를 입력하세요" },
    });

    const [errors, setErrors] = new useState({});
    const [touched, setTouched] = new useState({});
    const [checking, setChecking] = new useState({});

    const [isEmailSend,setIsEmailSend] = new useState(false);
    const [authMailToken,setAuthMailToken] = new useState('');
    
     const validateField = (name, value) => {
        switch (name) {
            case "userId":
                return userIdRegex.test(value) ? "" : "아이디는 7~30자의 영문/숫자만 입력 가능합니다.";
            case "verifyCode":
                return value.length > 0 ? "" : "인증번호는 필수 입력사항입니다.";
            default:
                return "";
        }
    };
    
    const handleFocus = (e) => {
        const { name } = e.target;
        setTouched({ ...touched, [name]: true });
        const error = validateField(name, formData[name].value);
        setErrors({ ...errors, [name]: error });
    };
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: { ...formData[name], value } });
        if (touched[name]) {
            const error = validateField(name, value);
            setErrors({ ...errors, [name]: error });
        }
    };
    const sendEmailHandler = async (e) => {
        e.preventDefault();
        setTouched({ userId: true });
        const errors = validateField("userId",formData["userId"].value);
        if (errors === ""){
            setChecking((prev) => ({ ...prev, ["formData"]: true }));
            const sendResponse = await sendVerifyCodeService(formData.userId.value);
            const sendResponseData = sendResponse.data;
            if (sendResponse.success){
                if (sendResponseData.send){
                    setAuthMailToken(`${sendResponseData.email}_${sendResponseData.userId}`);
                    setIsEmailSend(true);
                }else{
                    if (sendResponseData.email === "USER_NOT_EXIT" && sendResponseData.userId === "USER_NOT_EXIT"){
                        toast.error("가입하신 아이디를 찾을 수 없습니다. \n 아이디 찾기를 진행해주세요.", {
                            position: "top-center",
                            autoClose: 2000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        });
                    }else{
                        toast.error("이메일 전송에 실패하셨습니다. 다시 시도해주세요.", {
                            position: "top-center",
                            autoClose: 2000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        });
                    }
                }
            }else{
                const errorMessage = sendResponseData.message;
                toast.error(`일시적 오류입니다. \n ${errorMessage}`, {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
            setChecking((prev) => ({ ...prev, ["formData"]: false })); 
        }else{
            toast.error("아이디 값을 입력해주세요.", {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };
    const verifyCodeHandler = async (e) => {
        e.preventDefault();
        setTouched({ verifyCode: true });
        const errors = validateField("verifyCode",formData["verifyCode"].value);
        if (errors === ""){
            setChecking((prev) => ({ ...prev, ["formData"]: true }));
            const verifyCodeRequest = {
                authMailToken,
                verifyCode : formData.verifyCode.value.trim()
            }
            const verifyResponseData = await isVerifyCodeService(verifyCodeRequest);
            if (verifyResponseData.success){
                if (verifyResponseData.data){
                    toast.success("이메일 인증에 성공하셨습니다.", {
                        position: "top-center",
                        autoClose: 1000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                    props.verifyTypeHandler(2,authMailToken);
                }else{
                    toast.error("입력하신 인증 코드가 일치하지 않습니다. \n 다시 시도해주세요.", {
                        position: "top-center",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                }
            }else{
                const errorMessage = verifyResponseData.message;
                toast.error(`일시적 오류입니다. \n ${errorMessage}`, {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
            setChecking((prev) => ({ ...prev, ["formData"]: false }));
        }else{
            toast.error("인증번호를 입력해주세요.", {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };

    return (
        <motion.div
            className={classes.verifyCode_container}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {!isEmailSend && (
                 <motion.form
                    onSubmit={sendEmailHandler}
                    className={classes.auth_form}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className={classes.input_group}>
                        <div className={classes.input_wrapper}>
                            <input
                                type="text"
                                name="userId"
                                value={formData["userId"].value}
                                onChange={handleChange}
                                onFocus={handleFocus}
                                className={`${classes.input} ${errors["userId"] ? classes.input_error : ""}`}
                                placeholder={formData["userId"].placeholder}
                            />
                            {!errors["userId"] && touched["userId"] && formData["userId"] && 
                                <CheckCircle className={classes.check_icon} color="green" size={20} />
                            }
                        </div>
                        <AnimatePresence>
                            {touched["userId"] && errors["userId"] && (
                                <motion.p
                                    className={classes.error}
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -5 }}
                                >
                                    {errors["userId"]}
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </div>
                    <motion.button
                        type="submit"
                        className={classes.submit_button}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={checking['formData']}
                    >
                        {checking['formData'] ? '이메일 전송중...' : '인증번호 전송'}
                    </motion.button>
                </motion.form>
            )}
           {isEmailSend && (
                 <motion.form
                    onSubmit={verifyCodeHandler}
                    className={classes.auth_form}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                     <p className={classes.userId_description}>✅ 전송된 이메일은 15분간 유효합니다.</p>
                    <div className={classes.input_group}>
                        <div className={classes.input_wrapper}>
                            <input
                                type="text"
                                name="verifyCode"
                                value={formData["verifyCode"].value}
                                onChange={handleChange}
                                onFocus={handleFocus}
                                className={`${classes.input} ${errors["verifyCode"] ? classes.input_error : ""}`}
                                placeholder={formData["verifyCode"].placeholder}
                            />
                            {!errors["verifyCode"] && touched["verifyCode"] && formData["verifyCode"] && 
                                <CheckCircle className={classes.check_icon} color="green" size={20} />
                            }
                        </div>
                        <AnimatePresence>
                            {touched["verifyCode"] && errors["verifyCode"] && (
                                <motion.p
                                    className={classes.error}
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -5 }}
                                >
                                    {errors["verifyCode"]}
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </div>
                    <motion.button
                        type="submit"
                        className={classes.submit_button}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={checking['formData']}
                    >
                        {checking['formData'] ? '제출중...' : '인증번호 확인'}
                    </motion.button>
                </motion.form>
            )}
        </motion.div>
    );

};

export default VerifyCodeInput;