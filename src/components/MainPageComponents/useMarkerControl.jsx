import React from "react";


const useMarkerControl = () => {

    const createMarker = ({ options, map }) => {
      const imageSize = new window.kakao.maps.Size(44, 49);
      const imageOption = { offset: new window.kakao.maps.Point(21, 39) };
  
      const imageUrl =
        options.image === "selected"
          ? "/pin-selected.svg"
          : "/pin-active.svg";
  
      const pin = new window.kakao.maps.MarkerImage(imageUrl, imageSize, imageOption);
  
      const marker = new window.kakao.maps.Marker({
        map: map,
        position: options.position,
        image: pin,
      });
  
      setMarkers([marker]); // setMarkers가 정의되어 있는지 확인 필요
    };
  
    const createOverlay = ({ map, options }) => {
      const overlayDiv = document.createElement("div");
      const root = createRoot(overlayDiv);
  
      const overlay = new window.kakao.maps.CustomOverlay({
        position: options.position,
        content: overlayDiv,
        clickable: true,
      });
  
      // Overlay 컴포넌트가 필요함
      root.render(Overlay({ title: options.title, position: options.position }));
  
      overlay.setMap(map);
  
      setOverlays(overlay); // setOverlays가 정의되어 있는지 확인 필요
    };
  
    const reloadMarkers = ({ map, options }) => {
      deleteAllMarker();
      deleteOverlays();
  
      const position = map.getCenter();
      const level = map.getLevel();
      const distance = getDistance(level);
  
      const nearbyMarker = findNearbyMarkers({
        markers: marker,
        latitude: position.getLat(),
        longitude: position.getLng(),
        maxDistance: distance,
      });
  
      if (level >= options.maxLevel) {
        const group = clusterMarkers(nearbyMarker, getCellSize(level));
        for (let i = 0; i < group.length; i++) {
          createOverlay({
            map,
            options: {
              position: new window.kakao.maps.LatLng(
                group[i].centerLatitude,
                group[i].centerLongitude
              ),
              title: `${group[i].count} 개`,
            },
          });
        }
      } else {
        for (let i = 0; i < nearbyMarker.length; i++) {
          let image = "active";
          if (options.selectId && nearbyMarker[i].markerId === options.selectId) {
            image = "selected";
          }
  
          createMarker({
            map,
            options: {
              image: image,
              markerId: nearbyMarker[i].markerId,
              position: new window.kakao.maps.LatLng(
                nearbyMarker[i].latitude,
                nearbyMarker[i].longitude
              ),
            },
          });
        }
      }
    };
  
    return { createMarker, createOverlay, reloadMarkers };
  };