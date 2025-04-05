import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import classes from "./KakaoMap.module.css";
import { ImExit } from "react-icons/im";
import { BiCurrentLocation } from "react-icons/bi";
import { MdShareLocation } from "react-icons/md"
import { logoutService } from "../../api/MemberService";
import loginContext from "../../store/login-context";
import { toast } from "react-toastify";
import { getCoordiateByAddressService } from "../../api/LocationService";
import Post from "./Post";
import Modal from "../../layout/Modal";


const KakaoMapSideBar = (props) => {

    const [postPopup,setPostPopup] = useState(false);

    const popupOverlay = () => {
        setPostPopup(true);
    };

    const popupDown = () => {
        setPostPopup(false);
    };

    const onComplete = async (data) =>{
        let fullAddress = data.address;
        let extraAddress = '';

        if (data.addressType === 'R') {
            if (data.bname !== '') {
                extraAddress += data.bname;
            }
            if (data.buildingName !== '') {
                extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
            }
            fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
        }
        popupDown();

        const coordinateResponse = await getCoordiateByAddressService(fullAddress);
        if (coordinateResponse.success){
            const latitude = coordinateResponse.data.latitude;
            const longitude = coordinateResponse.data.longitude;
            props.onSet({
                latitude,longitude
            })
        }else{
            const errorMessage = coordinateResponse.message
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
    }

    const fetchCurrentLocation = () => {
        toast.success("현재 위치로 이동하겠습니다.", {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
        props.onFetch();
    };

    const loginCtx = useContext(loginContext);

     const goLogout = async () => {
        const logoutResponseData = await logoutService();
        if (logoutResponseData.success){
            toast.success("로그아웃에 성공하셨습니다.", {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }else{
            toast.error("로그아웃에 실패하셨습니다. \n 강제로 로그아웃합니다.", {
            position: "top-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
        loginCtx.logoutUser();
        navigate('/auth');
    };

    return (
        <>
           {postPopup && (
                    <Modal 
                        onClose={popupDown}>
                        <Post onComplete={onComplete}/>
                    </Modal>
                )
            }
             <div className={classes.side_bar_container}>
                <motion.div 
                    whileHover={{ scale : 1.1 }}
                    onClick={fetchCurrentLocation}
                    className={classes.current_wrapper}>
                    <BiCurrentLocation className={classes.current_logo}/>
                </motion.div>
                <motion.div 
                    whileHover={{ scale : 1.1 }}
                    onClick={popupOverlay}
                    className={classes.search_wrapper}>
                    <MdShareLocation className={classes.search_logo}/>
                </motion.div>
                <motion.div 
                    whileHover={{ scale : 1.1 }}
                    onClick={goLogout}
                    className={classes.logout_wrapper}>
                    <ImExit className={classes.logout_logo}/>
                </motion.div>
            </div>
        </>
    )
};

export default KakaoMapSideBar