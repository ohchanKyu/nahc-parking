import React, { useState, useEffect, useContext } from "react";
import classes from "./BookmarkList.module.css";
import { RiErrorWarningFill } from "react-icons/ri";
import { motion } from "framer-motion";
import loginContext from '../../store/login-context';
import { getAllUserBookmarkService } from "../../api/BookmarkService";
import { toast } from "react-toastify";
import AroundSearch from "../AroundSearchPageComponents/AroundSearch";
import LoadingModal from "../../layout/LoadingModal";

const BookmarkList = (props) => {

    const [bookmarkList,setBookmarkList] = useState([]);
    const [isLoading,setIsLoading] = useState(true);

    const loginCtx = useContext(loginContext);
    const memberId = loginCtx.memberId;

    const fetchBookmarkListData = async () => {

        setIsLoading(true);
        const bookmarkResponse = await getAllUserBookmarkService(memberId,props.location);
        if (bookmarkResponse.success){
            setBookmarkList(bookmarkResponse.data);
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
        setIsLoading(false);
    };

    useEffect(() => {
        fetchBookmarkListData();
    },[]);

    const animationVariants = {
        initial: { opacity: 0, x: -50 },
        animate: { opacity: 1, x: 0,},
    };
    
    return (
        <React.Fragment>
            {isLoading && <LoadingModal/>}
            <p className={classes.count}>총 {bookmarkList.length}건 등록</p>
            {bookmarkList.length === 0 && !isLoading && <p className={classes.message}><RiErrorWarningFill style={{ marginRight:'5px'}}/> 아직 등록된 즐겨찾기가 없습니다.</p>}
            {!isLoading && (
                 <div className={classes.list_container}>
                    <motion.ul
                            variants={animationVariants}
                            initial="initial"
                            animate="animate"
                            className={classes.favorite_list}
                        >
                        {bookmarkList.map(item => {
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
            )}
        </React.Fragment>
    )
};

export default BookmarkList;