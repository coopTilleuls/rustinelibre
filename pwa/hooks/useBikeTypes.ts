import {useEffect, useState} from 'react';
import {bikeTypeResource} from "@resources/bikeTypeResource";
import {BikeType} from "@interfaces/BikeType";

function useBikeTypes(): BikeType[] {

    const [bikes, setBikes] = useState<BikeType[]>([]);

    async function fetchBikes() {
        const response = await bikeTypeResource.getAll(false);
        setBikes(response['hydra:member']);
    }

    useEffect(() => {
        fetchBikes();
    }, []);

    return bikes;
}

export default useBikeTypes;
