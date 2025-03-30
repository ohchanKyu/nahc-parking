import KakaoMap from "../components/MainPageComponents/KakaoMap";
import SearchTab from "../components/MainPageComponents/SearchTab";
import MainTab from "../components/MainPageComponents/MainTab";
import { useGeoLocation } from "../hooks/useGeoLocation";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const geolocationOptions = {
    enableHighAccuracy: true,
    timeout: 1000 * 10,
    maximumAge: 1000 * 3600 * 24,
}

const MainPage = () => {

    const { location } = useGeoLocation(geolocationOptions);
    const [ currentLocation , setCurrentLocation] = useState(null);
    const [ searchParams ] = useSearchParams();

    const fetchCurrentLocation = () => {
        setCurrentLocation(location);
    };
    const setCoordinates = (tmapLocation) => {
        setCurrentLocation(tmapLocation);
    };

    useEffect(() => {
        if (searchParams.get("latitude")){
            setCurrentLocation({
                latitude : searchParams.get('latitude'),
                longitude : searchParams.get('longitude')
            })
            return;
        }
        if (location) {
            setCurrentLocation(location);
        }
    }, [location]);
    return (
        <>
            <SearchTab location={currentLocation}/>
            {currentLocation && <KakaoMap onSet={setCoordinates} onFetch={fetchCurrentLocation} location={currentLocation}/>}
            <MainTab location={currentLocation}/>
        </>
    );
};

export default MainPage;