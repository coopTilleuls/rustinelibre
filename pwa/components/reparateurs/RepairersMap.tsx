import {Repairer} from "../../interfaces/Repairer";
import React, { useState } from "react";
import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';
import {RepairerCard} from 'components/reparateurs/RepairerCard';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';


interface RepairersProps {
    repairers: Repairer[];
    selectedRepairer?: string;
    showMap: boolean;
    setSelectedRepairer: React.Dispatch<React.SetStateAction<string>>;
}

export const RepairersMap = ({repairers, selectedRepairer, showMap, setSelectedRepairer}: RepairersProps): JSX.Element => {

    const [mapCenter, setMapCenter] = useState<[number, number]>([Number(repairers[0].latitude), Number(repairers[0].longitude)]);

    return (
        <>
            <div className="grid gap-4 md:grid-cols-2 min-h-screen">
                <div className="hidden md:block ml-4">
                    {repairers.map((repairer) => {
                        return <RepairerCard key={repairer.id} repairer={repairer} isSelect={repairer.id === selectedRepairer}/>
                    })}
                </div>
                <div className="w-full">
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
                                    click: () => {setSelectedRepairer(repairer.id)}
                                }}
                            >
                                <Popup>{repairer.name}</Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>
            </div>
        </>
    );
};

export default RepairersMap;
