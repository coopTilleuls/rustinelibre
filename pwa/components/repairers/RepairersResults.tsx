import { Repairer } from '@interfaces/Repairer';
import React, { useContext, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { RepairerCard } from 'components/repairers/RepairerCard';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';
import { LeafletMouseEvent } from 'leaflet';
import { SearchRepairerContext } from '@contexts/SearchRepairerContext';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

export const RepairersResults = (): JSX.Element => {
  const {
    showMap,
    setSelectedRepairer,
    selectedRepairer,
    repairers,
    setRepairers,
  } = useContext(SearchRepairerContext);
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    Number(repairers[0].latitude),
    Number(repairers[0].longitude),
  ]);

  const handleSelectRepairer = (id: string) => {
    setSelectedRepairer(id);
    const index = repairers.findIndex((repairer) => repairer.id === id);
    const selectedRepairer = repairers.splice(index, 1)[0];
    repairers.unshift(selectedRepairer);
    setRepairers([...repairers]);
  };

  const handleClipMapPin = (event: LeafletMouseEvent, repairer: Repairer) => {
    if (showMap) {
      event.target.openPopup();
    } else {
      handleSelectRepairer(repairer.id);
    }
  };

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <Box
          sx={{
            width: { xs: '100%', md: '50%' },
            marginLeft: 4,
            marginRight: 2,
          }}
        >
          {repairers.map((repairer) => {
            return (
              <RepairerCard
                key={repairer.id}
                repairer={repairer}
                isSelect={repairer.id === selectedRepairer}
              />
            );
          })}
        </Box>
        <Box
          sx={{
            width: '50%',
            marginLeft: 2,
            marginRight: 4,
            display: { xs: 'hidden', md: 'block' },
          }}
        >
          <MapContainer
            center={mapCenter}
            zoom={13}
            scrollWheelZoom={false}
            style={{ height: '50vh', width: '100%' }}
          >
            <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
            {repairers.map((repairer) => (
              <Marker
                key={repairer.id}
                position={[
                  Number(repairer.latitude),
                  Number(repairer.longitude),
                ]}
                eventHandlers={{
                  mouseover: (event) => event.target.openPopup(),
                }}
              >
                <Popup>{repairer.name}</Popup>
              </Marker>
            ))}
          </MapContainer>
        </Box>
      </Box>
    </>
  );
};

export default RepairersResults;
