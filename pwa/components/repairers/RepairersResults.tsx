import React, {useContext, useState} from 'react';
import router from 'next/router';
import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';
import {LeafletMouseEvent} from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';
import {RepairerCard} from 'components/repairers/RepairerCard';
import {PopUpRepairerCard} from 'components/repairers/PopUpRepairerCard';
import Box from '@mui/material/Box';
import Grid2 from '@mui/material/Unstable_Grid2';
import {SearchRepairerContext} from '@contexts/SearchRepairerContext';
import {Repairer} from '@interfaces/Repairer';
import useMediaQuery from '@mui/material/useMediaQuery';
import {useTheme} from '@mui/material/styles';
import L from 'leaflet';

export const RepairersResults = (): JSX.Element => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
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
          <Box display="grid" gap={{xs: 2, md: 4}}>
            {repairers.map((repairer) => {
              return (
                <Box
                  key={repairer.id}
                  id={repairer.id}
                  display="flex"
                  sx={{pt: '268px', mt: '-268px'}}>
                  <RepairerCard
                    withButton
                    repairer={repairer}
                    onClick={() =>
                      router.push({
                        pathname: `/reparateur/${repairer.id}-${repairer.slug}`,
                        query: {recherche: 1},
                      })
                    }
                  />
                </Box>
              );
            })}
          </Box>
        </Box>
      )}
      {(showMap || !isMobile) && (
        <Box
          sx={{
            display: {xs: 'block', md: 'block'},
            width: {xs: '100%', md: '50%'},
            height: 'calc(100vh - 350px)',
            position: 'sticky',
            top: '264px',
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

              const customIcon = new L.Icon({
                iconUrl: '/img/pin.svg',
                iconSize: [50, 50],
                iconAnchor: [25, 50],
                popupAnchor: [0, -50],
              });

              return (
                <Marker
                  icon={customIcon}
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
                    {isMobile ? (
                      <PopUpRepairerCard
                        repairer={repairer}
                        onClick={() =>
                          router.push({
                            pathname: `/reparateur/${repairer.id}`,
                            query: {recherche: 1},
                          })
                        }
                      />
                    ) : (
                      `${repairer.name}`
                    )}
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
