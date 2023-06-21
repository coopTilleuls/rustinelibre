import React, {useContext, useState} from 'react';
import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';
import {LeafletMouseEvent} from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';
import {RepairerCard} from 'components/repairers/RepairerCard';
import Box from '@mui/material/Box';
import Grid2 from '@mui/material/Unstable_Grid2';
import {SearchRepairerContext} from '@contexts/SearchRepairerContext';
import {Repairer} from '@interfaces/Repairer';
import useMediaQuery from '@hooks/useMediaQuery';

export const RepairersResults = (): JSX.Element => {
  const isMobile = useMediaQuery('(max-width: 640px)');
  const {city, showMap, setSelectedRepairer, repairers} = useContext(
    SearchRepairerContext
  );

  const [mapCenter, setMapCenter] = useState<[number, number]>([
    Number(city?.lat),
    Number(city?.lon),
  ]);

  const handleSelectRepairer = (id: string) => {
    setSelectedRepairer(id);
    document.getElementById(id)?.scrollIntoView({behavior: 'smooth'});
  };

  const handleClipMapPin = (event: LeafletMouseEvent, repairer: Repairer) => {
    if (showMap) {
      event.target.openPopup();
    } else {
      if (!isMobile) {
        handleSelectRepairer(repairer.id);
      }
    }
  };

  return (
    <Box display="flex">
      {!showMap && (
        <Box
          sx={{
            pt: 2,
            pr: {md: 2},
            width: {xs: '100%', md: '50%'},
          }}>
          <Grid2 container spacing={2}>
            {repairers.map((repairer) => {
              return (
                <Grid2
                  id={repairer.id}
                  key={repairer.id}
                  xs={12}
                  pt="198px"
                  mt="-198px">
                  <RepairerCard repairer={repairer} />
                </Grid2>
              );
            })}
          </Grid2>
        </Box>
      )}
      {(showMap || !isMobile) && (
        <Box
          sx={{
            display: {xs: 'block', md: 'block'},
            width: {xs: '100%', md: '50%'},
            height: 'calc(100vh - 335px)',
            position: 'sticky',
            top: '198px',
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
            {repairers.map((repairer) => {
              if (!repairer.latitude || !repairer.longitude) {
                return;
              }

              return (
                <Marker
                  key={repairer.id}
                  position={[
                    Number(repairer.latitude),
                    Number(repairer.longitude),
                  ]}
                  eventHandlers={{
                    click: (event) => {
                      handleClipMapPin(event, repairer);
                    },
                  }}>
                  <Popup>
                    {isMobile && <RepairerCard repairer={repairer} />}
                    {!isMobile && repairer.name}
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </Box>
      )}
    </Box>
  );
};

export default RepairersResults;
