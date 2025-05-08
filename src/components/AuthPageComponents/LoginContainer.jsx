import React from "react";
import LoginInput from "./LoginInput";
import { signinService } from "../../api/AuthService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const LoginContainer = () => {

    const navigate = useNavigate();

    const loginSubmitHandler = async (formData) => {
        
        const signinResponseData = await signinService(formData);
        if (signinResponseData.success){
            const tokenData = signinResponseData.data;
            const accessToken = tokenData.accessToken;
            const refreshToken = tokenData.refreshToken;

            window.sessionStorage.setItem('accessToken',accessToken);
            window.sessionStorage.setItem('refreshToken',refreshToken);
            navigate('/')
        }else{
            const message = signinResponseData.message;
            if (message === "There is no member matching the provided username and password." || 
                message === "Not found member with your primary key or userId"){
                toast.error("일치하는 회원정보가 존재하지 않습니다.", {
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
    };

    return (
        <React.Fragment>
            <LoginInput loginSubmitHandler={loginSubmitHandler}/>
        </React.Fragment>
    )
};

export default LoginContainer;