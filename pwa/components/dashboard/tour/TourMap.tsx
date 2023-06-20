import React, {useState} from 'react';
import {MapContainer, TileLayer, Marker} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';
import Box from '@mui/material/Box';
import {Repairer} from '@interfaces/Repairer';
import {Appointment} from "@interfaces/Appointment";
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
                    {appointments.map((appointment: Appointment, key : number) => {
                        if (!appointment.latitude || !appointment.longitude) {
                            return;
                        }

                        const customIcon = L.divIcon({
                            className: 'custom-marker',
                            html: `<span style="background-color: #1876d2; border-radius: 50px; padding: 5px; color: white; font-size: 0.7em">${key+1}</span>`
                        });

                        return <Marker key={key} icon={customIcon} position={[Number(appointment.latitude), Number(appointment.longitude)]} />
                    })}
                </MapContainer>
            </Box>
        </Box>
    );
};

export default TourMap;
