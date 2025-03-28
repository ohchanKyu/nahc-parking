import React from "react";
import FindIdInput from "./FindIdInput";
import { findIdService } from "../../api/AuthService";

const FindIdContainer = () => {

    const findIdHandler = async (formData) => {
        return await findIdService(formData);
    }

    return (
        <React.Fragment>
            <FindIdInput findIdHandler={findIdHandler}/>
        </React.Fragment>
    )

};

export default FindIdContainer;