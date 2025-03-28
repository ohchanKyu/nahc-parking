import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle } from "lucide-react";
import classes from "./AuthInput.module.css";
import { toast } from "react-toastify";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const FindIdInput = (props) => {

    const [formData, setFormData] = new useState({
        name: { value: "", placeholder: "가입하신 이름을 입력하세요" },
        email: { value: "", placeholder: "가입하신 이메일을 입력하세요" },
    });
    const [errors, setErrors] = new useState({});
    const [touched, setTouched] = new useState({});
    const [checking, setChecking] = new useState({});
    const [resultMessage,setResultMessage] = new useState({ isSubmit : false , userId : [] });

    const validateField = (name, value) => {
        switch (name) {
            case "name":
                return value.length >= 2 && value.length <= 50 ? "" : "이름은 2자 이상 50자 이하로 입력해주세요.";
            case "email":
                return emailRegex.test(value) ? "" : "올바른 이메일 형식을 입력해주세요.";
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
        setResultMessage((prev) => ({ ...prev, isSubmit : false }))
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let newErrors = {};
        Object.keys(formData).forEach((key) => {
            newErrors[key] = validateField(key, formData[key].value);
        });
        setErrors(newErrors);
        setTouched({ name: true, email: true });
        if (Object.values(newErrors).every((err) => err === "")) {
            setChecking((prev) => ({ ...prev, ["formData"]: true }));
            const findIdRequest = {
                name : formData.name.value,
                email : formData.email.value
            }
            const findIdResponseData = await props.findIdHandler(findIdRequest);
            if (findIdResponseData.success){
                setTimeout(() => {
                    setChecking((prev) => ({ ...prev, ["formData"]: false }));
                    const transformedIdData = findIdResponseData.data.map(id => {
                        if (id.startsWith("kakao_")) {
                          return "카카오 로그인 사용 중";
                        } else if (id.startsWith("naver_")) {
                          return "네이버 로그인 사용 중";
                        } else if (id.startsWith("google_")) {
                          return "구글 로그인 사용 중";
                        }
                        return id;
                    });
                    setResultMessage({ isSubmit : true, userId : transformedIdData });
                }, 1000)
            }else{
                setChecking((prev) => ({ ...prev, ["formData"]: false }));
                const errorMessage = findIdResponseData.message;
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
        } else {
            toast.error("입력값을 정확히 입력해주세요.", {
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
    };
    
    return (
        <motion.div
            className={classes.signin_container}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <motion.form
                onSubmit={handleSubmit}
                className={classes.auth_form}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                {Object.keys(formData).map((key) => (
                    <div key={key} className={classes.input_group}>
                        <div className={classes.input_wrapper}>
                            <input
                                type={/password/i.test(key) ? "password" : "text"}
                                name={key}
                                value={formData[key].value}
                                onChange={handleChange}
                                onFocus={handleFocus}
                                className={`${classes.input} ${errors[key] ? classes.input_error : ""}`}
                                placeholder={formData[key].placeholder}
                            />
                            {!errors[key] && touched[key] && formData[key] && 
                                ["name", "email" ].includes(key) && 
                                (
                                    <CheckCircle className={classes.check_icon} color="green" size={20} />
                                )
                            }
                        </div>
                        <AnimatePresence>
                            {touched[key] && errors[key] && (
                                <motion.p
                                    className={classes.error}
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -5 }}
                                >
                                    {errors[key]}
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
                <AnimatePresence>
                    {resultMessage.isSubmit && resultMessage.userId.length > 0 && (
                        <motion.div
                            className={classes.userId_list}
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                        >
                            <p className={classes.userId_description}>✅ 회원님의 가입하신 아이디입니다.</p>
                            <ul className={classes.userId_container}>
                                {resultMessage.userId.map((id, index) => (
                                    <li key={index} className={classes.userId_item}>
                                        # {id}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    )}
                </AnimatePresence>
                <AnimatePresence>
                    {resultMessage.isSubmit && resultMessage.userId.length === 0  && (
                        
                            <motion.p
                                className={classes.error}
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                            >
                                입력하신 정보와 일치하는 아이디가 존재하지 않습니다.
                            </motion.p>
                    
                    )}
                 </AnimatePresence>
                <motion.button
                    type="submit"
                    className={classes.submit_button}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={checking['formData']}
                >
                    {checking['formData'] ? '제출중...' : '아이디 찾기'}
                </motion.button>
            </motion.form>
        </motion.div>
    );
};

export default FindIdInput;


