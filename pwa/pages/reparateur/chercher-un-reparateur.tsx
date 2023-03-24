import {NextPageWithLayout} from 'pages/_app';
import {useRouter} from 'next/router';
import React, {useState} from 'react';
import {Footer} from "@components/layout/Footer";
import Head from "next/head";
import {Navbar} from "@components/layout/Navbar";
import {HomeCard} from "@components/home/HomeCard";
import {repairerResource} from 'resources/repairerResource';
import {Collection} from 'interfaces/Resource';
import {Repairer} from 'interfaces/Repairer';
import {RepairerCard} from 'components/reparateurs/RepairerCard';
import Spinner from 'components/icons/Spinner';

interface BikeType {
    id: number;
    name: string;
}

interface FormProps {
    bikeTypes: BikeType[];
}

interface SearchResult {
    displayName: string;
    lat: string;
    lon: string;
}

const bikeTypes: BikeType[] = [
    { id: 1, name: "Vélo de ville" },
    { id: 2, name: "Vélo électrique" },
    { id: 3, name: "Vélo de montagne" },
];

const SearchRepairer: NextPageWithLayout = () => {
    const [city, setCity] = useState('')
    const [selectedBike, setSelectedBike] = useState<BikeType>();
    const [repairers, setRepairers] = useState<Repairer[]>();
    const [pendingSearchCity, setPendingSearchCity] = useState(false);

    const handleCityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCity(event.target.value);
        // if (event.target.value.length > 1) {
        //     searchCity();
        // }
    };

    const handleBikeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedBikeType = bikeTypes.find((bt) => bt.id === Number(event.target.value));
        setSelectedBike(selectedBikeType);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setPendingSearchCity(true)
        if (!city || !selectedBike) {
            return;
        }

        fetchRepairers();
    };

    const fetchRepairers = async () => {
        const response = await repairerResource.getAll({'city': city, 'order[firstSlotAvailable]': 'DESC'});
        setRepairers(response['hydra:member']);
        setPendingSearchCity(false);
    };

    // const searchCity = async () => {
    //     const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${city}`);
    //     const data = await response.json();
    //     const cityDetails = data[0];
    //     console.log(cityDetails);
    // }

    return (
        <>
            <div className="w-screen overflow-x-hidden">
                <Head>
                    <title>Chercher un réparateur</title>
                </Head>
                <Navbar/>
                <div className="w-screen">
                    <form onSubmit={handleSubmit} className="bg-white rounded px-8 pt-6 pb-8 mb-4 text-center">
                        <div className="mb-8">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bikeType">
                                Type de Vélo
                            </label>
                            <select
                                value={selectedBike?.id ?? ''} onChange={handleBikeChange}
                                className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                id="grid-state">
                                    <option value="">Choisissez un type de vélo</option>
                                        {bikeTypes.map((bike) => (
                                            <option key={bike.id} value={bike.id}>
                                                {bike.name}
                                            </option>
                                        ))}
                            </select>
                        </div>
                        <div className="mb-8">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="city">
                                Ville
                            </label>
                            <input
                                onChange={handleCityChange}
                                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                                id="inline-full-name" type="text" value={city} />
                        </div>

                        <div className="mb-10">
                            {pendingSearchCity ?? <Spinner />}
                        </div>

                        <div className="mb-10">
                            {repairers?.map((repairer) => {
                                return <RepairerCard key={repairer.id} repairer={repairer}/>
                            }) }
                        </div>
                    </form>
                </div>

                <Footer logged={true} />
            </div>
        </>
    );
};

export default SearchRepairer;
