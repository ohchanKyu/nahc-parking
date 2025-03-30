import React,{ useEffect, useState, useRef, useContext } from "react";
import classes from "./KakaoMap.module.css";
import { FaPlus } from "react-icons/fa";
import { FaMinus } from "react-icons/fa6";
import parkingImage from "../../assets/placeholder.png";
import "./PlaceMarkOverlay.css";
import { Map, MapMarker, CustomOverlayMap } from "react-kakao-maps-sdk";
import { useNavigate } from "react-router-dom";
import LoadingModal from "../../layout/LoadingModal";
import { ImExit } from "react-icons/im";
import { motion } from "framer-motion";
import { BiCurrentLocation } from "react-icons/bi";
import { MdShareLocation } from "react-icons/md"
import { toast } from "react-toastify";
import Post from "./Post";
import Modal from "../../layout/Modal";
import { logoutService } from "../../api/MemberService";
import loginContext from "../../store/login-context";
import { getParkingLotByLevelService } from "../../api/ParkingLotService";
import { getCoordiateByAddressService } from "../../api/LocationService";


const { kakao } = window;

const KakaoMap = (props) => {

    const mapRef = useRef(kakao.maps.Map);
    const defaultLevel = 5
    const [level, setLevel] = useState(defaultLevel);
    const [aroundParkingList,setAroundParkingList] = useState([]);
    const [openIndices, setOpenIndices] = useState([]); 
    const [isLoading,setIsLoading] = useState(false);
    const [postPopup,setPostPopup] = useState(false);
    const loginCtx = useContext(loginContext);

    const navigate = useNavigate();
    
    const toggleOverlay = (index) => {
        if (openIndices.includes(index)) {
          setOpenIndices(openIndices.filter(i => i !== index));
        } else {
          setOpenIndices([...openIndices, index]);
        }
    };

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

    const handleLevel = (type) => {
        const map = mapRef.current
        if (!map) return
    
        if (type === "increase") {
          map.setLevel(map.getLevel() + 1)
          setLevel(map.getLevel())
        } else {
            map.setLevel(map.getLevel() - 1)
            setLevel(map.getLevel())
        }
    }

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

    const goDetailPlaceHandler = async (parkingInfo) => {
        const params = new URLSearchParams({
            latitude : parkingInfo.latitude,
            longitude : parkingInfo.longitude,
            id : parkingInfo.id,
        }).toString();
        navigate(`/detail?${params}`);
    };
    
    useEffect(() => {
        const getAroundParkingList = async () => {

            setIsLoading(true);
            const parkingLotResponse = await getParkingLotByLevelService(props.location,level);
            console.log(parkingLotResponse.data);
            if (parkingLotResponse.success){
                setAroundParkingList(parkingLotResponse.data);
                // parkingLotResponse.data.map((parkingData, index) =>{
                //     console.log(parkingData);
                //     console.log(index);
                // });
                setIsLoading(false);
            }else{
                const errorMessage = parkingLotResponse.message;
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
            setIsLoading(false);
        };
        getAroundParkingList();
    },[props.location, level]);

    return (
        <React.Fragment>
            {postPopup && (
                    <Modal 
                        onClose={popupDown}>
                        <Post onComplete={onComplete}/>
                    </Modal>
                )
            }
            {!isLoading && (
                    <Map
                        id="map"
                        className={classes.container}
                        center={{
                            lat: props.location.latitude,
                            lng: props.location.longitude,
                        }}
                    
                        level={level}
                        zoomable={true}
                        ref={mapRef}>
                            <MapMarker
                                position={{
                                lat: props.location.latitude,
                                lng: props.location.longitude,
                                }}
                            />
                           {aroundParkingList.map((parkingData, index) => (
                                <React.Fragment key={index}>
                                <MapMarker
                                    position={{
                                        lat: parkingData.latitude,
                                        lng: parkingData.longitude,
                                    }}
                                    image={{
                                        src: parkingImage,
                                        size: {
                                            width: 39,
                                            height: 39,
                                        },
                                    }}
                                    clickable={true}
                                    onClick={() => toggleOverlay(index)}
                                />
                                {openIndices.includes(index) && (
                                    <CustomOverlayMap
                                        position={{
                                            lat: parkingData.latitude,
                                            lng: parkingData.longitude,
                                        }}
                                    >
                                    <div className="customoverlay">
                                        <div onClick={() => toggleOverlay(index)} className='close'>X</div>
                                        <p onClick={() => goDetailPlaceHandler(parkingData)}>
                                        <span className="title">{parkingData.name}</span>
                                        <span className="capacity">{`현재 주차 가능 대수 : ${parkingData.currentInfo}`}</span>
                                        </p>
                                    </div>
                                    </CustomOverlayMap>
                                )}
                                </React.Fragment>
                            ))}
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
                    <div className={classes.button_container}>
                        <div className={classes.plus_box} onClick={() => handleLevel("decrease")}>
                            <FaPlus/>
                        </div> 
                        <div className={classes.minus_box} onClick={() => handleLevel("increase")}>
                            <FaMinus/>
                        </div>
                    </div>
                </Map>
            )}
            {isLoading && <LoadingModal/>}
        </React.Fragment>
    )
};

export default KakaoMap;