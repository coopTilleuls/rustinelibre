import React, {useEffect, useState} from 'react';
import {Repairer} from '@interfaces/Repairer';
import {MapContainer, Marker, TileLayer, useMapEvents} from 'react-leaflet';
import {LeafletEvent, LeafletMouseEvent} from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';
import {Box, Typography} from '@mui/material';

interface MapPositionProps {
  repairer: Repairer;
  setLatitude: (latitude: string) => void;
  setLongitude: (longitude: string) => void;
  latitudeProps: string;
  longitudeProps: string;
}

export const MapPositionUser = ({
  repairer,
  setLatitude,
  setLongitude,
  latitudeProps,
  longitudeProps,
}: MapPositionProps): JSX.Element => {
  const [userPosition, setUserPosition] = useState<string[]>([
    latitudeProps,
    longitudeProps,
  ]);

  const handleMarkerDragEnd = (event: LeafletEvent) => {
    setUserPosition([event.target._latlng.lat, event.target._latlng.lng]);
  };

  useEffect(() => {
    setLatitude(userPosition[0]);
    setLongitude(userPosition[1]);
  }, [userPosition, setLatitude, setLongitude]);

  const UpdateMarkerPositionOnMapClick = () => {
    useMapEvents({
      click: (event: LeafletMouseEvent) => {
        setUserPosition([
          event.latlng.lat.toString(),
          event.latlng.lng.toString(),
        ]);
        setLatitude(userPosition[0]);
        setLongitude(userPosition[1]);
      },
    });

    return null;
  };

  return (
    <Box>
      <Typography pb={2} textAlign="center">
        Merci d&apos;indiquer à quel niveau de la rue vous vous situerez
      </Typography>
      <MapContainer
        center={[Number(latitudeProps), Number(longitudeProps)]}
        zoom={15}
        scrollWheelZoom={false}
        style={{height: '500px', width: '100%'}}>
        <UpdateMarkerPositionOnMapClick />
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {userPosition[0] && userPosition[1] && (
          <Marker
            draggable={true}
            position={[+userPosition[0], +userPosition[1]]}
            eventHandlers={{
              dragend: handleMarkerDragEnd,
            }}></Marker>
        )}
      </MapContainer>
    </Box>
  );
};

export default MapPositionUser;
