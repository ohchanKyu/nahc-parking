const haversineDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLng = (lng2 - lng1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

export const findNearbyMarkers = ({ markers, latitude, longitude, maxDistance }) => {
    return markers.filter((marker) => {
      const distance = haversineDistance(latitude, longitude, marker.latitude, marker.longitude);
      return distance <= maxDistance;
    });
};

const getGridCoordinates = (lat, lng, cellSize) => {
    return {
      x: Math.floor(lng / cellSize),
      y: Math.floor(lat / cellSize),
    };
};
  
export const clusterMarkers = (markers, cellSize) => {
    
    const groups = {};
  
    markers.forEach(({ latitude, longitude }) => {
      const { x, y } = getGridCoordinates(latitude, longitude, cellSize);
      const key = `${x},${y}`;
  
      if (!groups[key]) {
        groups[key] = { centerLatitude: 0, centerLongitude: 0, count: 0 };
      }
  
      groups[key].centerLatitude += latitude;
      groups[key].centerLongitude += longitude;
      groups[key].count++;
    });
  
    return Object.values(groups).map(group => ({
      centerLatitude: group.centerLatitude / group.count,
      centerLongitude: group.centerLongitude / group.count,
      count: group.count,
    }));
};