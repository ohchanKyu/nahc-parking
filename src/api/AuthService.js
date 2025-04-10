import axios from "axios";
import { toast } from "react-toastify";

const apiClient = axios.create({
    baseURL: window.location.hostname === 'localhost' 
    ? 'http://localhost:8080/auth' 
    : `${import.meta.env.VITE_BACKEND_URL}/auth`,
    withCredentials: true,
    headers: {
        'Content-Type': `application/json`,
    },
})

export const checkDuplicateUserIdService = async (userId) => {
    try{
        const checkDuplicateResponse = await apiClient.get(`/identity/is-duplicate/${userId}`);
        return await checkDuplicateResponse.data;
    }catch(error){
        if (error.response){
            return error.response.data;
        }
        toast.error(`일시적 네트워크 오류입니다.\n 잠시 후 다시 시도해주세요.`, {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
        return { success : false }
    }
}

export const signupService = async (signupRequest) => {
    try {
        const signupResponse = await apiClient.post('/identity/sign-up', signupRequest);
        return await signupResponse.data;
    } catch (error) {
        if (error.response){
            return error.response.data;
        }
        toast.error(`일시적 네트워크 오류입니다.\n 잠시 후 다시 시도해주세요.`, {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
        return { success : false }
    }
};

export const signinService = async (signinRequest) => {
    try {
        const signinResponse = await apiClient.post('/identity/sign-in', signinRequest);
        return signinResponse.data;
    } catch (error) {
        if (error.response){
            return error.response.data;
        }
        toast.error(`일시적 네트워크 오류입니다.\n 잠시 후 다시 시도해주세요.`, {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
        return { success : false }
    }
};

export const socialLoginService = async (socialSignInRequest) => {
    try {
        const socialLoginResponse = await apiClient.post('/identity/social', socialSignInRequest);
        return socialLoginResponse.data;
    } catch (error) {
        if (error.response){
            return error.response.data;
        }
        toast.error(`일시적 네트워크 오류입니다.\n 잠시 후 다시 시도해주세요.`, {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
        return error;
    }
};

export const findIdService = async (findIdRequest) => {
    try{
        const findIdResponse = await apiClient.post("/identity/find-id",findIdRequest);
        return await findIdResponse.data;
    }catch (error){
        if (error.response){
            return error.response.data;
        }
        toast.error(`일시적 네트워크 오류입니다.\n 잠시 후 다시 시도해주세요.`, {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
        return { success : false }
    }
};

export const sendVerifyCodeService = async (userId) => {
    try{
        const sendVerifyCodeResponse = await apiClient.post(`/identity/verify-code/${userId}`);
        return await sendVerifyCodeResponse.data;
    }catch (error){
        if (error.response){
            return error.response.data;
        }
        toast.error(`일시적 네트워크 오류입니다.\n 잠시 후 다시 시도해주세요.`, {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
        return { success : false }
    }
};

export const isVerifyCodeService = async (verifyCodeRequest) => {
    try{
        const isVerifyResponse = await apiClient.post('/identity/is-verify',verifyCodeRequest);
        return await isVerifyResponse.data;
    }catch (error){
        if (error.response){
            return error.response.data;
        }
        toast.error(`일시적 네트워크 오류입니다.\n 잠시 후 다시 시도해주세요.`, {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
        return { success : false }
    }
};

export const changePasswordService = async (passwordChangeRequest) => {
    try{
        const changePasswordResponse = await apiClient.patch('/identity/password',passwordChangeRequest);
        return await changePasswordResponse.data;
    }catch (error){
        if (error.response){
            return error.response.data;
        }
        toast.error(`일시적 네트워크 오류입니다.\n 잠시 후 다시 시도해주세요.`, {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
        return { success : false }
    }
};

export const reIssueTokenService = async (refreshToken) => {
    try{
        const reissueTokenResponse = await apiClient.post("/identity/reissue", refreshToken);
        return await reissueTokenResponse.data;
    }catch (error){
        if (error.response){
            return error.response.data;
        }
        toast.error(`일시적 네트워크 오류입니다.\n 잠시 후 다시 시도해주세요.`, {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
        return { success : false }
    }
};
