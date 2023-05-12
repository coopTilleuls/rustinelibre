import React, {useContext, useState} from 'react';
import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';
import {LeafletMouseEvent} from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';
import {RepairerCard} from 'components/repairers/RepairerCard';
import Box from '@mui/material/Box';
import Grid2 from '@mui/material/Unstable_Grid2'; // Grid version 2
import {SearchRepairerContext} from '@contexts/SearchRepairerContext';
import {Repairer} from '@interfaces/Repairer';

export const RepairersResults = (): JSX.Element => {
  const {showMap, setSelectedRepairer, repairers, setRepairers} = useContext(
    SearchRepairerContext
  );

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
    <Box display="flex">
      {!showMap && (
        <Box
          sx={{
            pr: {md: 2},
            width: {xs: '100%', md: '50%'},
          }}>
          <Grid2 container spacing={2}>
            {repairers.map((repairer) => {
              return (
                <Grid2 key={repairer.id} xs={12}>
                  <RepairerCard repairer={repairer} />
                </Grid2>
              );
            })}
          </Grid2>
        </Box>
      )}
      <Box
        sx={{
          display: {xs: showMap ? 'block' : 'none', md: 'block'},
          width: {xs: '100%', md: '50%'},
          height: 'calc(100vh - 335px)',
          position: 'sticky',
          top: '253px',
        }}>
        <MapContainer
          center={mapCenter}
          zoom={13}
          scrollWheelZoom={false}
          style={{
            zIndex: 1,
            height: '100%',
            borderRadius: 5,
          }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {repairers.map((repairer) => (
            <Marker
              key={repairer.id}
              position={[Number(repairer.latitude), Number(repairer.longitude)]}
              eventHandlers={{
                mouseover: (event) => event.target.openPopup(),
                click: (event) => {
                  handleClipMapPin(event, repairer);
                },
              }}>
              <Popup>{repairer.name}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </Box>
    </Box>
  );
};

export default RepairersResults;
