import React, { useReducer } from "react";
import loginContext from './login-context';

const defaultLoginUser = {
    name : '',
    userId : '',
    memberId : '',
    accessToken : ''
}

const loginReducer = (state,action) => {

    if (action.type === "LOGIN"){
        return {
            ...state,
            name : action.name,
            userId : action.userId,
            memberId : action.memberId,
            accessToken : action.accessToken
        }
    }
    if (action.type === "LOGOUT"){
        return defaultLoginUser;
    }
    return defaultLoginUser;
}

const LoginProvider = (props) => {

    const [userState, dispatchUserAction] = useReducer(loginReducer, defaultLoginUser);
  
    const loginHandler = (authContext) => { 
        dispatchUserAction({
            type : 'LOGIN',
            ...authContext
        })
    };

    const logoutHandler = () => {
        window.sessionStorage.removeItem("accessToken");
        window.sessionStorage.removeItem("refreshToken"); 
        dispatchUserAction({
            type : 'LOGOUT',
        })
    };

    const userContext = {
        name : userState.name,
        userId : userState.userId,
        memberId : userState.memberId,
        accessToken : userState.accessToken,
        loginUser : loginHandler,
        logoutUser : logoutHandler,
    }

    return (
        <loginContext.Provider value={userContext}>
            {props.children}
        </loginContext.Provider>
    );
}

export default LoginProvider;