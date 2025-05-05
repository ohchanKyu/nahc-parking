import { CustomOverlayMap } from "react-kakao-maps-sdk";
import classes from "./KakaoMap.module.css";
import { motion } from "framer-motion";

const ClusterMarker = ({ cluster, onClick  }) => {
    return (
        <CustomOverlayMap
            clickable={true}
            position={{ lat: cluster.centerLatitude, lng: cluster.centerLongitude }}
            zIndex={10}
        >
           <motion.div 
                initial={{ opacity: 0, scale: 0.5, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                exit={{ opacity: 0, scale: 0.5, y: 10 }}
                className={classes.clusterMarker_container}
                onClick={onClick}
                style={{ position: 'relative', width: '80px', height: '80px' }}>
                <div />
                <div 
                    className={classes.clusterMarker}
                >
                    {cluster.count}
                </div>
            </motion.div>
        </CustomOverlayMap>
    );
};

export default ClusterMarker;