import React, { useState, useEffect } from "react";
import classes from "./FilterResult.module.css";
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from "react-router-dom";

const FilterResult = (props) => {

    const [data,setData] = useState(props.parkingLot);
    const [isSubmit,setIsSubmit] = useState(props.isSubmit);

    const navigate = useNavigate();

    const goPlaceDetailHandler = (parkingInfo) => {
        const params = new URLSearchParams({
          latitude : parkingInfo.latitude,
          longitude : parkingInfo.longitude,
          id : parkingInfo.id,
        }).toString();
        navigate(`/detail?${params}`);
    };

    useEffect(() => {
        setData(props.parkingLot);
        setIsSubmit(true);
    },[props.parkingLot, props.isSubmit])
    return (
        <>
            <div className={classes.resultsContainer}>
                <AnimatePresence>
                    {isSubmit && data.length === 0 && (
                        <motion.p
                            className={classes.noResultsText}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.3 }}
                        >
                            검색 결과가 존재하지 않습니다.
                        </motion.p>
                    )}
                </AnimatePresence>
                <AnimatePresence>
                    {data.map((item,index) => {
                        return (
                            <motion.div
                                onClick={() => goPlaceDetailHandler(item)}
                                key={item.id}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                className={classes.resultItem}
                                >
                                <div className={classes.placeName}>{item.name}</div>
                                <div className={classes.regionCode}>{item.regionCode}</div>
                            </motion.div>
                        )
                    })}
                </AnimatePresence>
            </div> 
        </>
    );
};

export default FilterResult;