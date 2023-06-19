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
import {Appointment} from "@interfaces/Appointment";
import {getTimeFromDateAsString} from "@helpers/dateHelper";
import {markerIcon} from "@components/dashboard/tour/TourMapIcon";
import L from 'leaflet';


interface TourMapProps {
    repairer: Repairer;
    appointments: Appointment[];
}

export const TourMap = ({repairer, appointments}: TourMapProps): JSX.Element => {

    const [mapCenter, setMapCenter] = useState<[number, number]>([
        Number(repairer.latitude),
        Number(repairer.longitude),
    ]);

    return (
        <Box display="flex">
            <Box
                sx={{
                    display: {xs: 'block', md: 'block'},
                    width: '100%',
                    height: 'calc(100vh - 335px)',
                    position: 'sticky',
                    marginTop: '30px'
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
                    {appointments.map((appointment, key) => {
                        if (!appointment.latitude || !appointment.longitude) {
                            return;
                        }

                        const customIcon = L.divIcon({
                            className: 'custom-marker',
                            html: `<span style="background-color: blue; padding: 10px; color: white">${key+1}</span>`
                        });

                        return <Marker icon={customIcon} position={[Number(appointment.latitude), Number(appointment.longitude)]} />
                    })}
                </MapContainer>
            </Box>
        </Box>
    );
};

export default TourMap;
