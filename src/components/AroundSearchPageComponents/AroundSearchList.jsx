import React, { useEffect, useState } from 'react';
import classes from "./AroundSearchList.module.css";
import { RiErrorWarningFill } from "react-icons/ri";
import { motion } from "framer-motion";
import { getAroundParkingLotService } from '../../api/ParkingLotService';
import LoadingModal from '../../layout/LoadingModal';
import AroundSearch from './AroundSearch';

const AroundSearchList = (props) => {

    const [aroundParkingLotList,setAroundParkingLotList] = useState([]);
    const [isLoading,setIsLoading] = useState(true);

    useEffect(() => {
        const getAroundParkingList = async () => {
            setIsLoading(true);
            const parkingResponse = await getAroundParkingLotService(props.location);
            if (parkingResponse.success){
                setAroundParkingLotList(parkingResponse.data);
                setIsLoading(false);
            }else{
                const errorMessage = parkingResponse.message;
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
        };
        getAroundParkingList();
    },[]);

    const animationVariants = {
        initial: { opacity: 0, x: -50 },
        animate: { opacity: 1, x: 0,},
    };

    return (
        <React.Fragment>
            {!isLoading && (
                <>
                    <p className={classes.count}>총 {aroundParkingLotList.length}개 존재 </p>
                    {aroundParkingLotList.length === 0 && <p className={classes.message}><RiErrorWarningFill style={{ marginRight:'5px'}}/> 근처의 주차장이 없습니다.</p>}
                    <div className={classes.list_container}>
                        <motion.ul
                                variants={animationVariants}
                                initial="initial"
                                animate="animate"
                                className={classes.parking_list}
                            >
                            {aroundParkingLotList.map(item => {
                                return (
                                    <motion.li
                                        className={classes.item}
                                        key={item.parkingLotResponse.id}>
                                        <AroundSearch
                                            location={props.location}
                                            route={item.routeResponse}
                                            parking={item.parkingLotResponse}
                                        />
                                    </motion.li>
                                )
                            })}
                        </motion.ul>
                    </div>
                </>
            )}
            {isLoading && <LoadingModal/>}
        </React.Fragment>

    )
};

export default AroundSearchList;