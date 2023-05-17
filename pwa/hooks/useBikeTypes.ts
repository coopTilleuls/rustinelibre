import {useEffect, useState} from 'react';
import {bikeTypeResource} from "@resources/bikeTypeResource";
import {BikeType} from "@interfaces/BikeType";

function useBikeTypes(): BikeType[] {

    const [bikeTypes, setBikeTypes] = useState<BikeType[]>([]);

    async function fetchBikes() {
        const response = await bikeTypeResource.getAll(false);
        setBikeTypes(response['hydra:member']);
    }

    useEffect(() => {
        fetchBikes();
    }, []);

    return bikeTypes;
}

export default useBikeTypes;
