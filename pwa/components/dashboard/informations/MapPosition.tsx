import React, {useState} from 'react';
import {Repairer} from '@interfaces/Repairer';
import {MapContainer, Marker, TileLayer, useMapEvents} from 'react-leaflet';
import {LeafletEvent, LeafletMouseEvent} from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';
import {Alert, Button, CircularProgress, Typography} from '@mui/material';
import {RequestBody} from '@interfaces/Resource';
import {errorRegex} from '@utils/errorRegex';

interface MapPositionProps {
  repairer: Repairer;
  // eslint-disable-next-line no-unused-vars
  updateRepairer: (iri: string, requestBody: RequestBody) => void;
}

export const MapPosition = ({
  repairer,
  updateRepairer,
}: MapPositionProps): JSX.Element => {
  const [pendingRegistration, setPendingRegistration] =
    useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const [mapCenter] = useState<[number, number]>([
    repairer.latitude ? Number(repairer.latitude) : 46.2276,
    repairer.longitude ? Number(repairer.longitude) : 2.2137,
  ]);
  const [shopPosition, setShopPosition] = useState<
    [number | null, number | null]
  >([
    repairer.latitude ? Number(repairer.latitude) : null,
    repairer.longitude ? Number(repairer.longitude) : null,
  ]);

  const handleMarkerDragEnd = (event: LeafletEvent) => {
    setShopPosition([event.target._latlng.lat, event.target._latlng.lng]);
  };

  const UpdateMarkerPositionOnMapClick = () => {
    useMapEvents({
      click: (event: LeafletMouseEvent) => {
        setShopPosition([event.latlng.lat, event.latlng.lng]);
      },
    });
    return null;
  };

  const uploadPosition = async () => {
    if (!shopPosition[0] || !shopPosition[1]) {
      return;
    }

    let newPosition = {
      latitude: shopPosition[0].toString(),
      longitude: shopPosition[1].toString(),
    };

    try {
      setPendingRegistration(true);
      await updateRepairer(repairer['@id'], newPosition);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (e: any) {
      setErrorMessage(
        `Mise à jour impossible : ${e.message?.replace(errorRegex, '$2')}`
      );
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
    }
    setPendingRegistration(false);
  };

  return (
    <>
      <MapContainer
        center={mapCenter}
        zoom={shopPosition[0] ? 15 : 6}
        scrollWheelZoom={false}
        style={{height: '500px', width: '100%'}}>
        <UpdateMarkerPositionOnMapClick />
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {shopPosition[0] && shopPosition[1] && (
          <Marker
            key={repairer.id}
            draggable={true}
            position={[Number(shopPosition[0]), Number(shopPosition[1])]}
            eventHandlers={{
              dragend: handleMarkerDragEnd,
            }}></Marker>
        )}
      </MapContainer>
      <Button
        type="submit"
        variant="contained"
        sx={{my: 2}}
        onClick={uploadPosition}>
        {!pendingRegistration ? (
          'Enregistrer la nouvelle position'
        ) : (
          <CircularProgress size={20} sx={{color: 'white'}} />
        )}
      </Button>

      {errorMessage && (
        <Typography variant="body1" color="error">
          {errorMessage}
        </Typography>
      )}

      {success && <Alert severity="success">Informations mises à jour</Alert>}
    </>
  );
};

export default MapPosition;
