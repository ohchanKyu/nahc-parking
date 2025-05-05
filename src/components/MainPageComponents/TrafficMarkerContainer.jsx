import React from "react";
import { CustomOverlayMap, Circle } from "react-kakao-maps-sdk";
import { motion } from "framer-motion";

const TrafficMarkerContainer = ({ trafficData }) => {
        
    let strokeColor = "";
    let fillColor = "";
    
    if (trafficData.state === "정체") {
        strokeColor = "#FF0000";
        fillColor = "#FF9999";
    } else if (trafficData.state === "서행") {
        strokeColor = "#FFA500";
        fillColor = "#FFD580";
    } else if (trafficData.state === "원할") {
        strokeColor = "#0073E6";
        fillColor = "#CFE7FF";
    } else {
        strokeColor = "#808080";
        fillColor = "#D3D3D3";
    }
    
    return (
        <>
            <Circle
                center={{
                    lat: trafficData.latitude,
                    lng: trafficData.longitude,
                }}
                radius={240}
                strokeWeight={5}
                strokeColor={strokeColor}
                strokeOpacity={1}
                strokeStyle={"dash"}
                fillColor={fillColor}
                fillOpacity={0.7}
            />
            <CustomOverlayMap position={{ lat: trafficData.latitude, lng: trafficData.longitude }} zIndex={1000}>
                <motion.div 
                    initial={{ opacity: 0, scale: 0.5, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    exit={{ opacity: 0, scale: 0.5, y: 10 }}
                    style={{
                        backgroundColor: "rgba(255, 255, 255, 0.8)", 
                        padding: "5px 10px",
                        borderRadius: "8px",
                        fontSize: "10px",
                        fontWeight: "bold",
                        color: "#333",
                        textAlign: "center",
                        whiteSpace: "nowrap"
                    }}>
                    {trafficData.state} 구간 <br/>
                    평균 속도 {trafficData.speed}km
                </motion.div>
            </CustomOverlayMap>
        </>
        
    );
};

export default TrafficMarkerContainer;