import {Repairer} from "@interfaces/Repairer";
import React, { useState } from "react";
import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';
import {RepairerCard} from 'components/repairers/RepairerCard';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';
import {LeafletMouseEvent} from "leaflet";

interface RepairersResultProps {
    repairers: Repairer[];
    selectedRepairer?: string;
    showMap: boolean;
    setSelectedRepairer: React.Dispatch<React.SetStateAction<string>>;
    setRepairers: React.Dispatch<React.SetStateAction<Repairer[]>>;
}

export const RepairersResults = ({repairers, selectedRepairer, showMap, setSelectedRepairer, setRepairers}: RepairersResultProps): JSX.Element => {

    const [mapCenter, setMapCenter] = useState<[number, number]>([Number(repairers[0].latitude), Number(repairers[0].longitude)]);

    const handleSelectRepairer = (id: string) => {
        setSelectedRepairer(id);
        const index = repairers.findIndex(repairer => repairer.id === id);
        const selectedRepairer = repairers.splice(index, 1)[0];
        repairers.unshift(selectedRepairer);
        setRepairers([...repairers]);
    };

    const handleClipMapPin = (event: LeafletMouseEvent, repairer: Repairer) => {
        if (showMap) {
            event.target.openPopup()
        } else {
            handleSelectRepairer(repairer.id)
        }
    };

    return (
        <>
            <div className="grid gap-4 md:grid-cols-2 min-h-screen">
                <div className={`${showMap && 'hidden'} md:block ml-4`}>
                    {repairers.map((repairer) => {
                        return <RepairerCard key={repairer.id} repairer={repairer} isSelect={repairer.id === selectedRepairer}/>
                    })}
                </div>
                    <div className={`${!showMap && 'hidden'} md:block`}>
                        <MapContainer
                            center={mapCenter}
                            zoom={13}
                            scrollWheelZoom={false}
                            style={{ height: '50vh', width: '100%' }}>
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            {repairers.map((repairer) => (
                                <Marker
                                    key={repairer.id}
                                    position={[Number(repairer.latitude), Number(repairer.longitude)]}
                                    eventHandlers={{
                                        mouseover: (event) => event.target.openPopup(),
                                        click: (event) => {handleClipMapPin(event, repairer)}
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

export default RepairersResults;
