import {NextPageWithLayout} from 'pages/_app';
import React, {useState, useEffect} from 'react';
import Head from "next/head";
import {repairerResource} from 'resources/repairerResource';
import {bikeTypeResource} from 'resources/bikeTypeResource';
import {ButtonShowMap} from 'components/repairers/ButtonShowMap';
import {Repairer} from 'interfaces/Repairer';
import {BikeType} from 'interfaces/BikeType';
import {City as NominatimCity} from 'interfaces/Nominatim';
import {City as GouvCity} from 'interfaces/Gouv';
import Spinner from 'components/icons/Spinner';
import {searchCity} from 'utils/apiCity';
import dynamic from 'next/dynamic';
const Navbar = dynamic(() => import("components/layout/Navbar"));
const Footer = dynamic(() => import("components/layout/Footer"));

const SearchRepairer: NextPageWithLayout = ({}) => {
    const [city, setCity] = useState('');
    const [gouvCities, setGouvCities] = useState<GouvCity[]>([]);
    const [nominatimCities, setNominatimCities] = useState<NominatimCity[]>([]);
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

    const handleCityChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        setCity(event.target.value);

        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        const newTimeoutId = window.setTimeout(async () => {

            if (!useNominatim) {
                setGouvCities([]);
                setGouvCities(await searchCity(event.target.value, useNominatim) as GouvCity[]);
            }else{
                setNominatimCities([]);
                let cities = await searchCity(event.target.value, useNominatim) as NominatimCity[];
                let displayNames : string[] = [];
                cities = cities.filter((city: NominatimCity) => {
                    if (!displayNames.includes(city.display_name)) {
                        displayNames.push(city.display_name);
                        return city;
                    }
                })
                setNominatimCities(cities);
            }
        }, 500);

        setTimeoutId(newTimeoutId);
    };

    const handleCityClick = (city: string | undefined) => {
        if(city !== undefined){
            setCity(city);
        }
        setGouvCities([]);
        setNominatimCities([]);
    }

    const handleBikeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedBikeType = bikes.find((bt) => bt.id === Number(event.target.value));
        setSelectedBike(selectedBikeType);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setPendingSearchCity(true)
        fetchRepairers();
    };

    const fetchRepairers = async () => {
        if (!selectedBike || !city) {
            return;
        }
        const response = await repairerResource.getAll({'city': city, 'bikeTypesSupported.id': selectedBike.id, 'order[firstSlotAvailable]': 'DESC'});
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
                                id="inline-full-name" type="text" value={city} />
                            {(useNominatim && nominatimCities.length > 0) && (nominatimCities.map((city: NominatimCity) => {
                                return <div key={city.place_id} onClick={() => { handleCityClick(city.display_name) }} className="hover:cursor-pointer bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">{city.display_name}</div>
                            }))}

                            {(!useNominatim && gouvCities.length > 0) && (gouvCities.map((city: GouvCity) => {
                                return <div key={city.properties?.city} onClick={() => { handleCityClick(city.properties?.city) }} className="hover:cursor-pointer bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">{city.properties?.city + ', ' + city.properties?.postcode + ', ' + 'France'}</div>
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
