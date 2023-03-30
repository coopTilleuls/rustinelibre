import {NextPageWithLayout} from 'pages/_app';
import React, {useState, useEffect} from 'react';
import Head from "next/head";
import {repairerResource} from 'resources/repairerResource';
import {bikeTypeResource} from 'resources/bikeTypeResource';
import {ButtonShowMap} from 'components/repairers/ButtonShowMap';
import {Repairer} from 'interfaces/Repairer';
import {BikeType} from 'interfaces/BikeType';
import {createCitiesWithGouvAPI, createCitiesWithNominatimAPI, City} from 'interfaces/City';
import {City as NominatimCity} from 'interfaces/Nominatim';
import {City as GouvCity} from 'interfaces/Gouv';
import Spinner from 'components/icons/Spinner';
import {searchCity} from 'utils/apiCity';
import dynamic from 'next/dynamic';
const Navbar = dynamic(() => import("components/layout/Navbar"));
const Footer = dynamic(() => import("components/layout/Footer"));

const SearchRepairer: NextPageWithLayout = ({}) => {
    const [cityInput, setCityInput] = useState('');
    const [city, setCity] = useState<City | null>(null);
    const [citiesList, setCitiesList] = useState<City[]>([]);
    const [timeoutId, setTimeoutId] = useState<number | null>(null);
    const [bikes, setBikes] = useState<BikeType[]>([]);
    const [selectedBike, setSelectedBike] = useState<BikeType>();
    const [selectedRepairer, setSelectedRepairer] = useState('');
    const [repairers, setRepairers] = useState<Repairer[]>([]);
    const [pendingSearchCity, setPendingSearchCity] = useState(false);
    const [showMap, setShowMap] = useState(false);
    const RepairersResults = dynamic(() => import("components/repairers/RepairersResults"));

    useEffect(() => {
        const fetchBikes = async () => {
            const response = await bikeTypeResource.getAll({});
            setBikes(response['hydra:member']);
        };
        fetchBikes();
    }, []);

    const useNominatim = process.env.NEXT_PUBLIC_USE_NOMINATIM !== 'false';

    const handleCityChange = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
        setCityInput(event.target.value);

        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        const newTimeoutId = window.setTimeout(async () => {
            const citiesResponse = await searchCity(event.target.value, useNominatim);
            const cities: City[] = useNominatim ? createCitiesWithNominatimAPI(citiesResponse as NominatimCity[]) : createCitiesWithGouvAPI(citiesResponse as GouvCity[]);
            setCitiesList(cities);
        }, 500);

        setTimeoutId(newTimeoutId);
    };

    const handleCityClick = (city: City) => {
        setCityInput(city.name);
        setCity(city);
        setCitiesList([]);
    }

    const handleBikeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedBikeType = bikes.find((bt) => bt.id === Number(event.target.value));
        setSelectedBike(selectedBikeType);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setPendingSearchCity(true)
        await fetchRepairers();
    };

    const fetchRepairers = async () => {
        if (!selectedBike || !searchCity) {
            return;
        }

        let params = {city: cityInput, itemsPerPage: 20, 'bikeTypesSupported.id': selectedBike.id, 'order[firstSlotAvailable]': 'DESC'};
        params = city ? {...{'around[5000]': `${city.lat},${city.lon}`}, ...params} : params;

        const response = await repairerResource.getAll(params);
        setRepairers(response['hydra:member']);
        setPendingSearchCity(false);
    };

    return (
        <>
            <div className="w-screen overflow-x-hidden">
                <Head>
                    <title>Chercher un réparateur</title>
                </Head>
                <Navbar/>
                <div className="w-screen">
                    <form onSubmit={handleSubmit} className="bg-white rounded m-2 px-8 pt-6 pb-4 mb-2 grid gap-4 md:grid-cols-2">
                        <div className="mb-4 w-full">
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="bikeType">
                                Type de Vélo
                            </label>
                            <select
                                required
                                value={selectedBike?.id ?? ''} onChange={handleBikeChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                id="grid-state">
                                    <option value="">Choisissez un type de vélo</option>
                                        {bikes.map((bike) => (
                                            <option key={bike.id} value={bike.id}>
                                                {bike.name}
                                            </option>
                                        ))}
                            </select>
                        </div>
                        <div className="mb-4 w-full">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="city">
                                Ville
                            </label>
                            <input
                                onChange={handleCityChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                id="inline-full-name" type="text" value={cityInput} />
                            {(citiesList.map((city: City) => {
                                return <div key={city.id} onClick={() => { handleCityClick(city) }} className="hover:cursor-pointer bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">{city.formatted_name}</div>
                            }))}
                        </div>

                        <button type="submit" className="hidden md:block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                Chercher
                        </button>
                    </form>

                    <div className="mb-3 mt-3">
                        {pendingSearchCity && <Spinner />}
                    </div>

                    <div className="md:hidden m-2">
                        {Object.keys(repairers).length > 0 &&
                            <ButtonShowMap showMap={showMap} setShowMap={setShowMap} />
                        }
                    </div>

                    <div className="m-2">
                        {Object.keys(repairers).length > 0 &&
                            <RepairersResults repairers={repairers} selectedRepairer={selectedRepairer} showMap={showMap} setSelectedRepairer={setSelectedRepairer} setRepairers={setRepairers} />
                        }
                    </div>
                </div>

                <Footer />
            </div>
        </>
    );
};

export default SearchRepairer;
