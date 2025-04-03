import React, { useState, useEffect, useContext } from "react";
import classes from "./PlaceDetailPage.module.css";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate, useSearchParams } from "react-router-dom";
import RoadView from "../components/PlaceDetailPageComponents/RoadView";
import PlaceDetailContent from "../components/PlaceDetailPageComponents/PlaceDetailContent";
import { FaRegStar, FaStar } from "react-icons/fa";
import { getBookmarkService, addBookmarkService, deleteBookmarkService } from "../api/BookmarkService";
import { getParkingLotByIdSerivce } from "../api/ParkingLotService";
import loginContext from "../store/login-context";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const PlaceDetailPage = () => {

    const navigate = useNavigate();
    const loginCtx = useContext(loginContext);
    const [parkingLot,setParkingLot] = useState(null);
    const [bookmark, setBookmark] = useState(false);
    const [bookmarkId, setBookmarkId] = useState(null);
    const [searchParams] = useSearchParams();
    
    const latitude = searchParams.get("latitude");
    const longitude = searchParams.get("longitude");
    const location = { latitude, longitude };
    const id = searchParams.get("id");
    const memberId = loginCtx.memberId;

    const goAroundSearchPage = () => {
        navigate(-1);
    };

    const addBookMarkHandler = async () => {
        
        const addBookmarkResponse = await addBookmarkService(memberId, id);
        if (addBookmarkResponse.success){
            toast.success('즐겨찾기에 추가하였습니다!', {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            setBookmark(true);
        }else{
            const errorMessage = addBookmarkResponse.message;
            toast.error(`일시적 오류입니다. \n ${errorMessage}`, {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            setBookmark(false);
        } 
    };

    const deleteBookMarkHandler = async () => {
        
        const deleteBookmarkResponse = await deleteBookmarkService(bookmarkId);
        if (deleteBookmarkResponse.data && deleteBookmarkResponse.success){
            toast.success('즐겨찾기에서 삭제하였습니다!', {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            setBookmark(false);
        }else{
            const errorMessage = deleteBookmarkResponse.message;
            toast.error(`일시적 오류입니다. \n ${errorMessage}`, {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            setBookmark(true);
        } 
    };

    useEffect(() => {
        const fetchBookmarkAndInitialParkingLot = async () => {
            const bookmarkResponse = await getBookmarkService(memberId, id);
            if (bookmarkResponse.success){
                setBookmarkId(bookmarkResponse.data);
                setBookmark(bookmarkResponse.data !== null);
            }else{
                const errorMessage = bookmarkResponse.message;
                toast.error(`일시적 오류입니다. \n ${errorMessage}`, {
                    position: "top-center",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            } 
            const parkingLotResponse = await getParkingLotByIdSerivce(id);
            if (parkingLotResponse.success){
                setParkingLot(parkingLotResponse.data);
            }else{
                const errorMessage = parkingLotResponse.message;
                toast.error(`일시적 오류입니다. \n ${errorMessage}`, {
                    position: "top-center",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            } 
        };
        fetchBookmarkAndInitialParkingLot();
    }, [bookmark]);

    return (
        <React.Fragment>
            <div className={classes.header}>
                <motion.div whileHover={{ scale : 1.1 }}>
                    <IoIosArrowBack
                        className={classes.back_icon}
                        onClick={goAroundSearchPage}
                    />
                </motion.div>
                {parkingLot && <h2 className={classes.header_name}>{parkingLot.name}</h2>}
                {bookmark ? (
                    <motion.div whileHover={{ scale : 1.1 }}>
                        <FaStar
                            className={classes.fillbookMarkIcon}
                            onClick={deleteBookMarkHandler}
                        />
                    </motion.div>
                ) : (
                    <motion.div whileHover={{ scale : 1.1 }}>
                        <FaRegStar
                            className={classes.emptybookMarkIcon}
                            onClick={addBookMarkHandler}
                        />  
                    </motion.div>
                   
                )}
            </div>
            <div>
                <p className={classes.description}>
                    마커를 움직여 주변 위치를 확인하세요!
                </p>
                <RoadView location={location} />
            </div>
            <PlaceDetailContent item={parkingLot} />
        </React.Fragment>
    );
};

export default PlaceDetailPage;