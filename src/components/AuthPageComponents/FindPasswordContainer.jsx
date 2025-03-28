import React, { useState } from "react";
import FindPasswordInput from "./FindPasswordInput";
import VerifyCodeInput from "./VerifyCodeInput";

const FindPasswordContainer = (props) => {

    const [type,setType] = new useState(1);
    const [authMailToken, setAuthMailToken] = new useState('');

    const verifyTypeHandler = (type, authMailToken) => {
        setAuthMailToken(authMailToken);
        setType(type);
    };

    return (
        <React.Fragment>
            {type === 1 && <VerifyCodeInput verifyTypeHandler={verifyTypeHandler}/>}
            {type === 2 && <FindPasswordInput typeChangeHandler={props.typeChangeHandler} authMailToken={authMailToken}/>}
        </React.Fragment>
    )

};

export default FindPasswordContainer;