import React from 'react'
import classes from "./Bookmark.module.css";
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaLocationDot } from "react-icons/fa6";
import { FaPhoneAlt } from "react-icons/fa";
import logoImage from "../../assets/logo.png";

const Bookmark = (props) => {

    const navigate = useNavigate();
    console.log(props.totalCapacity)
    const goPlaceDetailPage = () => {
        const params = new URLSearchParams({
            latitude : props.item.latitude,
            longitude : props.item.longitude,
            id :  props.item.id,
        }).toString();
        navigate(`/detail?${params}`);
    };

    const itemVariants = { borderRadius : '8px' , backgroundColor : '#0d147a', color:'white'};

    return (
        <React.Fragment>
            <motion.div 
                whileHover={itemVariants}
                onClick={goPlaceDetailPage}
                className={classes.container}>
                <div className={classes.header_container}>
                    <div className={classes.text}>
                        <h4 className={classes.placeName}>{props.item.name}</h4>
                        <p className={classes.address}><FaLocationDot style={{ marginRight : '5px'}}/> <span>{props.item.address}</span></p>
                        <p className={classes.phoneNumber}><FaPhoneAlt style={{ marginRight : '7px'}}/> <span>{props.item.phoneNumber}</span></p>
                    </div>
                    <div className={classes.logo}>
                        <img src={logoImage} alt='logo-mini-image' className={classes.logo_image}/>
                    </div>
                </div>
                <div className={classes.capacity}>
                    <div className={classes.totalCapacity}># 전체 주차면 <br/> {props.item.totalSpace}면</div>
                    <div className={classes.dash}>|</div>
                    <div className={classes.currentCapacity}># 주차 가능면 <br/> {props.item.currentInfo}</div>
                </div>
            </motion.div>
        </React.Fragment>
    )
};

export default Bookmark;