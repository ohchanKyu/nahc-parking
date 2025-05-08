import axios from "axios";
import { toast } from "react-toastify";
import { reIssueTokenService } from "./AuthService";

const apiClient = axios.create({
  baseURL: window.location.hostname === 'localhost' 
  ? 'http://localhost:8080/chat' 
  : `${import.meta.env.VITE_BACKEND_URL}/chat`,
    withCredentials: true,
    headers: {
      'Content-Type': `application/json`,
    },
})

apiClient.interceptors.request.use(
    (config) => {
      const accessToken = window.sessionStorage.getItem('accessToken');
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
);
  
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.headers['token-error-message']) {
      const tokenErrorMessage = error.response.headers['token-error-message'];
      if (tokenErrorMessage === 'Token Expired') {
        const refreshToken = window.sessionStorage.getItem('refreshToken');
        const reissueTokenResponseData = await reIssueTokenService({ refreshToken });

        if (reissueTokenResponseData.success){
            const newAccessToken = reissueTokenResponseData.data.accessToken;
            const newRefreshToken = reissueTokenResponseData.data.refreshToken;
            window.sessionStorage.setItem("accessToken", newAccessToken);
            window.sessionStorage.setItem("refreshToken", newRefreshToken);
            error.config.headers.Authorization = `Bearer ${newAccessToken}`;
            return axios(error.config);

        }else{
            toast.warning("로그인 시간이 만료되었습니다. \n 다시 로그인해주세요.", {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
            });
            window.sessionStorage.removeItem("accessToken");
            window.sessionStorage.removeItem("refreshToken"); 
            setTimeout(() => {
                window.location.href = '/auth';
            },2000)
        }
      } else {
        toast.error("인증에 문제가 생겼습니다. \n 다시 로그인해주세요.", {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
        });
        window.sessionStorage.removeItem("accessToken");
        window.sessionStorage.removeItem("refreshToken"); 
        setTimeout(() => {
            window.location.href = '/auth';
        },2000)
      }
    }
    return Promise.reject(error);
  }
);

export const getAllChatMessageService = async (roomId) => {
  try {
    const chatResponse = await apiClient.get(`/message/${roomId}`);
    return await chatResponse.data;
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

export const unreadClearService = async (roomId,memberId) => {
  
  try {
    const unreadClearResponse = await apiClient.post(`/unread-clear/${roomId}/${memberId}`);
    return await unreadClearResponse.data;
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

export const getUnreadCountService = async (roomId,memberId) => {
  try {
    const unreadCountResponse = await apiClient.get(`/unread-count/${roomId}/${memberId}`);
    return await unreadCountResponse.data;
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