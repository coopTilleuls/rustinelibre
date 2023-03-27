import {Repairer} from "../../interfaces/Repairer";
import React, { useEffect, useRef, useState } from "react";
import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';
// const MapContainer = typeof window !== 'undefined' ? require('leaflet') : null;
// const TileLayer = typeof window !== 'undefined' ? require('leaflet') : null;
// const Marker = typeof window !== 'undefined' ? require('leaflet') : null;
// const L = typeof window !== 'undefined' ? require('leaflet') : null;
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';

// interface Marker {
//     id: number;
//     position: [number, number];
//     title: string;
// }
//
// interface MapProps {
//     markers: Marker[];
//     center: [number, number];
//     zoom: number;
// }

interface RepairersProps {
    repairers: Repairer[];
}


export const RepairersMap = ({repairers}: RepairersProps): JSX.Element => {

    console.log(repairers);

    const [mapCenter, setMapCenter] = useState<[number, number]>([Number(repairers[0].latitude), Number(repairers[0].longitude)]);

    return (
        <>
            <MapContainer center={mapCenter} zoom={13} style={{ height: '50vh', width: '100%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {repairers.map((repairer) => (
                    <Marker
                        key={repairer.id}
                        position={[Number(repairer.latitude), Number(repairer.longitude)]}
                        eventHandlers={{
                            mouseover: (event) => event.target.openPopup(),
                        }}
                    >
                        <Popup>{repairer.name}</Popup>
                    </Marker>
                ))}
            </MapContainer>
        </>
    );
};

export default RepairersMap;
