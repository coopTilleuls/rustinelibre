import L from 'leaflet';

export const markerIcon = (key: number) => L.divIcon({
    className: 'custom-marker',
    html: `<span class="marker-number">${key}</span>`
});