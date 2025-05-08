import { Navigate, useLocation } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { jwtDecode } from "jwt-decode";
import { reIssueTokenService } from "../api/AuthService";
import { toast } from "react-toastify";
import loginContext from "./login-context";

const ProtectedRoute = ({ children }) => {

    const [isTokenValid, setIsTokenValid] = useState(null);
    const [isRefreshingToken, setIsRefreshingToken] = useState(false);
    const accessToken = window.sessionStorage.getItem('accessToken');
    const refreshToken = window.sessionStorage.getItem('refreshToken');
    const loginCtx = useContext(loginContext);
    const location = useLocation();
    
    const saveLoginContextHandler = (token) => {
        const jsonToken = jwtDecode(token);
        console.log(jsonToken);
        loginCtx.loginUser({
            name: jsonToken.name,
            userId: jsonToken.userId,
            memberId: jsonToken.key,
            accessToken: token
        })
    };

    const reIssueTokenHandler = async (refreshToken) => {
        setIsRefreshingToken(true);
        const reissueTokenResponseData = await reIssueTokenService(refreshToken);
        if (reissueTokenResponseData.success){
            const newAccessToken = reissueTokenResponseData.data.accessToken;
            const newRefreshToken = reissueTokenResponseData.data.refreshToken;
            saveLoginContextHandler(newAccessToken);
            window.sessionStorage.setItem("accessToken", newAccessToken);
            window.sessionStorage.setItem("refreshToken", newRefreshToken);
            setIsTokenValid(true);
        }else{
            const statusCode = reissueTokenResponseData.statusCode;
            const errorMessage = reissueTokenResponseData.message;
            if (statusCode === 401 && errorMessage === "RefreshToken is Expired. Please Login again."){
                toast.warning('로그인 시간이 만료되었습니다 \n 다시 로그인해주세요. ', {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }else{
                toast.error(`토큰 인증 오류입니다. 다시 로그인해주세요`, {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
            window.sessionStorage.removeItem("accessToken");
            window.sessionStorage.removeItem("refreshToken");
            setIsTokenValid(false);
        }
        setIsRefreshingToken(false);
    };

    useEffect(() => {
        if (!accessToken) {
            window.sessionStorage.removeItem("refreshToken");
            setIsTokenValid(false);
            return;
        }
        saveLoginContextHandler(accessToken);
        try {
            const decodedToken = jwtDecode(accessToken);
            const currentTime = Date.now() / 1000;

            if (decodedToken.exp < currentTime) {
                if (!refreshToken) {
                    window.sessionStorage.removeItem("accessToken");
                    setIsTokenValid(false);
                } else {
                    console.log(`Update refreshToken - ${refreshToken}`);
                    reIssueTokenHandler({ refreshToken });
                }
            } else {
                const remainingTimeInSeconds = decodedToken.exp - currentTime;
                const remainingTimeInMinutes = Math.floor(remainingTimeInSeconds / 60);
                if (remainingTimeInMinutes <= 5) {
                    console.log(`Update refreshToken - ${refreshToken}`);
                    if (refreshToken) {
                        reIssueTokenHandler({ refreshToken });
                    }
                }
                console.log(`Remaining Client Token Time: ${remainingTimeInMinutes} minites`);
                setIsTokenValid(true);
            }
        } catch (error) {
            toast.error(`일시적 오류입니다. \n ${error}`, {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            window.sessionStorage.removeItem("accessToken");
            window.sessionStorage.removeItem("refreshToken");
            setIsTokenValid(false);
        }
    }, [accessToken, refreshToken, location.pathname]);

    if (isTokenValid === null || isRefreshingToken) {
        return null;
    }

    if (!isTokenValid) {
        return <Navigate to="/auth" replace />;
    }
    
    return children;
};

export default ProtectedRoute;
