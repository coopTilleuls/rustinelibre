import {Repairer} from '@interfaces/Repairer';
import React, {useContext, useState} from 'react';
import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';
import {RepairerCard} from 'components/repairers/RepairerCard';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';
import {LeafletMouseEvent} from 'leaflet';
import {SearchRepairerContext} from '@contexts/SearchRepairerContext';
import Box from '@mui/material/Box';
import {Paper, Stack, Typography} from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2'; // Grid version 2
import useMediaQuery from '@hooks/useMediaQuery';

export const RepairersResults = (): JSX.Element => {
  const {showMap, setSelectedRepairer, repairers, setRepairers} = useContext(
    SearchRepairerContext
  );

  const [mapCenter, setMapCenter] = useState<[number, number]>([
    Number(repairers[0].latitude),
    Number(repairers[0].longitude),
  ]);

  const isMobile = useMediaQuery('(max-width: 640px)');

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
    <Stack spacing={4} sx={{display: 'flex', flexDirection: 'column'}}>
      <Box
        sx={{
          width: '100%',
          display: {xs: showMap ? 'block' : 'none', lg: 'block'},
        }}>
        <Paper elevation={4}>
          <MapContainer
            center={mapCenter}
            zoom={13}
            scrollWheelZoom={false}
            style={{height: 300, width: '100%'}}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {repairers.map((repairer) => (
              <Marker
                key={repairer.id}
                position={[
                  Number(repairer.latitude),
                  Number(repairer.longitude),
                ]}
                eventHandlers={{
                  mouseover: (event) => event.target.openPopup(),
                }}>
                <Popup>{repairer.name}</Popup>
              </Marker>
            ))}
          </MapContainer>
        </Paper>
      </Box>
      {!showMap && (
        <Grid2
          container
          spacing={2}
          sx={{
            width: '100%',
          }}>
          {repairers.map((repairer) => {
            return (
              <Grid2 key={repairer.id} xs={12} md={6} lg={4}>
                <RepairerCard repairer={repairer} />
              </Grid2>
            );
          })}
        </Grid2>
      )}
    </Stack>
  );
};

export default RepairersResults;
