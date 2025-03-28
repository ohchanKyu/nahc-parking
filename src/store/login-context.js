import React from "react";

const loginContext = React.createContext({
    name : '',
    userId : '',
    memberId : '',
    accessToken : '',
    loginUser : (authContext) => {},
    logoutUser : () => {},
});

export default loginContext;