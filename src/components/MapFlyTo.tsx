import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';

interface Claim {
    geometry: {
        coordinates: number[][][];
    };
}

interface MapFlyToProps {
  claim: Claim | null;
}

const getCenter = (coordinates: LatLngExpression[]): LatLngExpression => {
    const total = coordinates.length;
    if (total === 0) return [0, 0];

    let sumLat = 0;
    let sumLng = 0;

    coordinates.forEach(coord => {
        sumLat += Array.isArray(coord) ? coord[0] : coord.lat;
        sumLng += Array.isArray(coord) ? coord[1] : coord.lng;
    });

    return [sumLat / total, sumLng / total];
}

const MapFlyTo = ({ claim }: MapFlyToProps) => {
  const map = useMap();

  useEffect(() => {
    if (claim && claim.geometry) {
      const coordinates = claim.geometry.coordinates[0].map(
        (coord) => [coord[1], coord[0]]
      ) as LatLngExpression[];
      
      const center = getCenter(coordinates);

      map.flyTo(center, 15, {
        animate: true,
        duration: 1.5,
      });
    }
  }, [claim, map]);

  return null;
};

export default MapFlyTo;