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
import {Divider} from '@mui/material';
import {useTheme} from "@mui/material/styles";

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
          <Grid2 container spacing={4} sx={{py: 2}}>
            {repairers.map((repairer) => {
              return (
                <>
                  <Grid2
                    id={repairer.id}
                    key={repairer.id}
                    xs={12}
                    pt="198px"
                    mt="-198px">
                    <RepairerCard
                      withButton
                      repairer={repairer}
                      onClick={() =>
                        router.push({
                          pathname: `/reparateur/${repairer.id}-${repairer.slug}`,
                          query: {searchRepairer: 1},
                        })
                      }
                    />
                  </Grid2>
                  {isMobile && (
                    <Divider sx={{width: '90%', mx: 'auto', mb: 1}} />
                  )}
                </>
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
                    {isMobile ? (
                      <PopUpRepairerCard
                        repairer={repairer}
                        onClick={() =>
                          router.push({
                            pathname: `/reparateur/${repairer.id}`,
                            query: {searchRepairer: 1},
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
