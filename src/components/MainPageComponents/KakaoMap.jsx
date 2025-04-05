import React,{ useEffect, useState, useRef } from "react";
import classes from "./KakaoMap.module.css";
import { FaPlus } from "react-icons/fa";
import { FaMinus } from "react-icons/fa6";
import EventMarkerContainer from "./EventMarkerContainer";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import LoadingModal from "../../layout/LoadingModal";
import KakaoMapSideBar from "./KakaoMapSideBar";
import { toast } from "react-toastify";
import { getTrafficService, getAllParkingLotService } from "../../api/ParkingLotService";
import TrafficMarkerContainer from "./TrafficMarkerContainer";
import { findNearbyMarkers, clusterMarkers } from "./Clustering";
import ClusterMarker from "./ClusterMarker";
import { AnimatePresence } from "framer-motion";

const { kakao } = window;

const getDistance = (level) => {
    if (level <= 3) return 1;
    if (level <= 5) return 2;
    if (level <= 6) return 4;
    if (level <= 7) return 7;
    if (level <= 8) return 14;
    if (level <= 9) return 21;
    if (level <= 10) return 30;
    if (level <= 11) return 40;
    return 120;
};
  
const getCellSize = (level) => {
    if (level === 6) return 0.02;
    if (level === 7) return 0.04;
    if (level === 8) return 0.08;
    if (level === 9) return 0.2;
    if (level === 10) return 0.5;
    if (level === 11) return 0.8;
    return 1.6;
};

const defaultLevel = 5
const maxLevel = 6

const KakaoMap = (props) => {

    const mapRef = useRef(kakao.maps.Map);
    const [level, setLevel] = useState(defaultLevel);
    const [parkingLotList,setParkingLotList] = useState([]);
    const [trafficInfo,setTrafficInfo] = useState([]);
    const [clusterGroup, setClusterGroup] = useState([]);
    const [visibleParkingLots, setVisibleParkingLots] = useState([]);
    const [visibleTrafficInfo,setVisibleTrafficInfo] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

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

    const reloadMarkers = () => {

        const map = mapRef.current
        const position = map.getCenter();
        const level = map.getLevel();
        const distance = getDistance(level);
        const nearbyMarker = findNearbyMarkers({
            markers : parkingLotList,
            latitude : position.getLat(),
            longitude : position.getLng(),
            maxDistance : distance
        });
        if (level >= maxLevel){
            const clustered  = clusterMarkers(nearbyMarker,getCellSize(level));
            setClusterGroup(clustered);
            setVisibleParkingLots([]);
            setVisibleTrafficInfo([]);
        }else{
            setVisibleTrafficInfo(trafficInfo);
            setClusterGroup([]);
            setVisibleParkingLots(nearbyMarker);
        }
    };

    useEffect(() => {
        const map = mapRef.current;
        if (!map) return;

        const onIdle = () => {
            setLevel(map.getLevel());
            reloadMarkers();
        };
        kakao.maps.event.addListener(map, 'idle', onIdle);
        return () => {
            kakao.maps.event.removeListener(map, 'idle', onIdle);
        };
    }, [level]);

    useEffect(() => {
       
        const getAllParkingList = async () => {
            setIsLoading(true);
            const trafficResponse = await getTrafficService();
            if (trafficResponse.success){
                setTrafficInfo(trafficResponse.data);
            }
            const parkingLotResponse = await getAllParkingLotService();
            if (parkingLotResponse.success){
                setParkingLotList(parkingLotResponse.data);
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
        };
        getAllParkingList();
    },[props.location]);

    useEffect(() => {
        if (mapRef.current && parkingLotList.length > 0) {
            reloadMarkers();
        }
    }, [parkingLotList]);

    return (
        <React.Fragment>
            {isLoading && <LoadingModal/>}
            <Map
                id="map"
                className={classes.container}
                center={{
                    lat: props.location.latitude,
                    lng: props.location.longitude,
                }}
                level={defaultLevel}
                onZoomChanged={(map) => {
                    const currentLevel = map.getLevel();
                    setLevel(currentLevel);
                }}
                zoomable={true}
                ref={mapRef}>
                    <MapMarker
                        position={{
                        lat: props.location.latitude,
                        lng: props.location.longitude,
                        }}
                    />
                    <AnimatePresence>
                        {visibleParkingLots.map((parkingData, index) => (
                            <EventMarkerContainer
                                key={parkingData.id}
                                position={{ lat: parkingData.latitude, lng: parkingData.longitude }}
                                parkingData={parkingData}/>
                        ))}
                    </AnimatePresence>
                    <AnimatePresence>
                        {clusterGroup.map((cluster, index) => (
                            <ClusterMarker 
                                onClick={() => {
                                    const map = mapRef.current;
                                    if (map.getLevel() > 3) map.setLevel(map.getLevel() - 1, { animate: true });
                                    map.setCenter(new kakao.maps.LatLng(cluster.centerLatitude, cluster.centerLongitude));
                                }}
                                key={`cluster-${index}`} cluster={cluster} />
                        ))}
                    </AnimatePresence>
                   
                    {visibleTrafficInfo.map((traffic) => (
                        <TrafficMarkerContainer key={traffic.poiCode}
                            trafficData={traffic}
                        />
                    ))}
                <KakaoMapSideBar 
                    onSet={props.onSet}
                    onFetch={props.onFetch} />
                <div className={classes.button_container}>
                    <div className={classes.plus_box} onClick={() => handleLevel("decrease")}>
                        <FaPlus/>
                    </div> 
                    <div className={classes.minus_box} onClick={() => handleLevel("increase")}>
                        <FaMinus/>
                    </div>
                </div>
            </Map>
        </React.Fragment>
    )
};

export default KakaoMap;