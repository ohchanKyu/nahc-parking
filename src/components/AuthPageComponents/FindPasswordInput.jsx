import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle } from "lucide-react";
import classes from "./AuthInput.module.css";
import { toast } from "react-toastify";
import { changePasswordService } from "../../api/AuthService";

const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

const FindPasswordInput = (props) => {

     const [formData, setFormData] = new useState({
        password: { value: "", placeholder: "비밀번호를 입력하세요" },
        confirmPassword: { value: "", placeholder: "비밀번호를 다시 입력하세요" },
    });

    const [errors, setErrors] = new useState({});
    const [touched, setTouched] = new useState({});
    const [checking, setChecking] = new useState({});

    const validateField = (name, value) => {
        switch (name) {
            case "password":
                return passwordRegex.test(value) ? "" : "비밀번호는 최소 8자, 숫자 1개, \n 특수문자 1개를 포함해야 합니다.";
            case "confirmPassword":
                return value === formData.password.value && value.trim().length > 0 ? "" : "비밀번호가 일치하지 않습니다.";
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
    const handleSubmit = async (e) => {
        e.preventDefault();
        let newErrors = {};
        Object.keys(formData).forEach((key) => {
            newErrors[key] = validateField(key, formData[key].value);
        });
        setErrors(newErrors);
        setTouched({ password: true, confirmPassword: true  });
        if (Object.values(newErrors).every((err) => err === "")) {
            
            setChecking((prev) => ({ ...prev, ["formData"]: true }));
            const passwordChangeRequest = {
                newPassword : formData.password.value,
                authMailToken : props.authMailToken
            }
            const passwordChangeResponseData = await changePasswordService(passwordChangeRequest);
            if (passwordChangeResponseData.success){
                if (passwordChangeResponseData){
                    toast.success("비밀번호 변경에 성공하셨습니다. \n 로그인 페이지로 이동합니다.", {
                        position: "top-center",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                    props.typeChangeHandler(1);
                }else{
                    toast.error("비밀번호 변경에 실패하셨습니다. 다시 시도해주세요.", {
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
                const errorMessage = passwordChangeResponseData.message;
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
        }else {
            toast.error("입력값을 정확히 입력해주세요.", {
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
            className={classes.signup_container}
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
                                ["password", "confirmPassword"].includes(key) && 
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
                <motion.button
                    type="submit"
                    className={classes.submit_button}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={checking['formData']}
                >
                    {checking['formData'] ? '제출중...' : '비밀번호 변경'}
                </motion.button>
            </motion.form>
        </motion.div>
    );
};

export default FindPasswordInput;