import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle } from "lucide-react";
import classes from "./AuthInput.module.css";
import { checkDuplicateUserIdService } from "../../api/AuthService";
import { toast } from "react-toastify";

const userIdRegex = /^[a-zA-Z0-9]{7,30}$/;
const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const SignupInput = (props) => {

     const [formData, setFormData] = new useState({
        name: { value: "", placeholder: "이름을 입력하세요" },
        userId: { value: "", placeholder: "아이디를 입력하세요" },
        password: { value: "", placeholder: "비밀번호를 입력하세요" },
        confirmPassword: { value: "", placeholder: "비밀번호를 다시 입력하세요" },
        email: { value: "", placeholder: "이메일을 입력하세요" }
    });

    const [errors, setErrors] = new useState({});
    const [touched, setTouched] = new useState({});
    const [checking, setChecking] = new useState({});
    const [idCheck, setIdCheck] = new useState({ id : '', check : false });

    const validateField = (name, value) => {
        switch (name) {
            case "name":
                return value.length >= 2 && value.length <= 50 ? "" : "이름은 2자 이상 50자 이하로 입력해주세요.";
            case "userId":
                return userIdRegex.test(value) ? "" : "아이디는 7~30자의 영문/숫자만 가능합니다.";
            case "password":
                return passwordRegex.test(value) ? "" : "비밀번호는 최소 8자, 숫자 1개, \n 특수문자 1개를 포함해야 합니다.";
            case "confirmPassword":
                return value === formData.password.value && value.trim().length > 0 ? "" : "비밀번호가 일치하지 않습니다.";
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
    };

    const handleCheckDuplicate = async (field) => {
        setChecking((prev) => ({ ...prev, [field]: true }));
        const checkResponseData = await checkDuplicateUserIdService(formData[field].value);
        if (checkResponseData.success){
            setTimeout(() => {
                setChecking((prev) => ({ ...prev, [field]: false }));
                if (checkResponseData.data) {
                    setErrors({ ...errors, [field]: `${field === "userId" ? "아이디" : "이메일"}가 이미 사용 중입니다.` });
                } else {
                    toast.success("사용가능한 아이디입니다.", {
                        position: "top-center",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                    setIdCheck({ id : formData[field].value, check : true });
                    setErrors({ ...errors, [field]: "" });
                }
            },1000)
        }else{
            const errorMessage = checkResponseData.message;
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
        
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let newErrors = {};
        Object.keys(formData).forEach((key) => {
            newErrors[key] = validateField(key, formData[key].value);
        });
        if (!idCheck.check || formData.userId.value !== idCheck.id){
            toast.warning("아이디 중복확인을 해주세요.", {
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
        setErrors(newErrors);
        setTouched({ name: true, userId: true, password: true, confirmPassword: true, email: true });
        if (Object.values(newErrors).every((err) => err === "")) {
            setChecking((prev) => ({ ...prev, ["formData"]: true }));
            const signupRequest = {
                name : formData.name.value,
                email : formData.email.value,
                userId : formData.userId.value,
                password : formData.password.value
            }
            await props.signupSubmitHandler(signupRequest);
            setTimeout(() => {
                setChecking((prev) => ({ ...prev, ["formData"]: false }));
            },1500)
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
                                ["name", "password", "confirmPassword", "email" ].includes(key) && 
                                (
                                    <CheckCircle className={classes.check_icon} color="green" size={20} />
                                )
                            }
                            {!errors[key] && touched[key] && formData[key] && 
                                ["userId"].includes(key) && (
                                    <motion.button
                                        type="button"
                                        className={classes.duplicate_button}
                                        onClick={() => handleCheckDuplicate(key)}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        disabled={checking[key]}
                                    >
                                        {checking[key] ? "확인 중..." : "중복 확인"}
                                    </motion.button>
                            )}
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
                    {checking['formData'] ? '제출중...' : '회원가입'}
                </motion.button>
            </motion.form>
        </motion.div>
    );
};

export default SignupInput;