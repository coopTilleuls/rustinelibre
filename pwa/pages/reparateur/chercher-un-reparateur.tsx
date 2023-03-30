import {NextPageWithLayout} from 'pages/_app';
import React, {useState, useEffect} from 'react';
import Head from "next/head";
import {repairerResource} from 'resources/repairerResource';
import {bikeTypeResource} from 'resources/bikeTypeResource';
import {ButtonShowMap} from 'components/repairers/ButtonShowMap';
import {Repairer} from 'interfaces/Repairer';
import {BikeType} from 'interfaces/BikeType';
import Spinner from 'components/icons/Spinner';
import dynamic from 'next/dynamic';
const Navbar = dynamic(() => import("components/layout/Navbar"));
const Footer = dynamic(() => import("components/layout/Footer"));
const RepairersResults = dynamic(() => import("components/repairers/RepairersResults"));
import PaginationBlock from "components/common/PaginationBlock";

// interface FetchProps {
//     pageNumber?: number;
// }

const SearchRepairer: NextPageWithLayout = ({}) => {
    const [city, setCity] = useState<string>('');
    const [bikes, setBikes] = useState<BikeType[]>([]);
    const [selectedBike, setSelectedBike] = useState<BikeType>();
    const [selectedRepairer, setSelectedRepairer] = useState<string>('');
    const [repairers, setRepairers] = useState<Repairer[]>([]);
    const [pendingSearchCity, setPendingSearchCity] = useState<boolean>(false);
    const [showMap, setShowMap] = useState<boolean>(false);
    const [currentApiPage, setCurrentApiPage] = useState<number>(1);
    const [totalItems, setTotalItems] = useState<number>(0);

    useEffect((): void => {
        const fetchBikes = async () => {
            const response = await bikeTypeResource.getAll({});
            setBikes(response['hydra:member']);
        };
        fetchBikes();
    }, []);

    const handleCityChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setCity(event.target.value);
    };

    const handleBikeChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
        const selectedBikeType = bikes.find((bt) => bt.id === Number(event.target.value));
        setSelectedBike(selectedBikeType);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();
        setPendingSearchCity(true)
        fetchRepairers();
    };

    const fetchRepairers = async (pageNumber?: number) => {
        if (!selectedBike || !city) {
            return;
        }

        const response = await repairerResource.getAll({'city': city, 'bikeTypesSupported.id': selectedBike.id, 'order[firstSlotAvailable]': 'DESC', 'page': `${pageNumber ?? 1}`, 'itemsPerPage': '20'});
        setRepairers(response['hydra:member']);
        setTotalItems(response['hydra:totalItems']);
        setPendingSearchCity(false);
    };

    const handlePageChange = (pageNumber: number): void => {
        setCurrentApiPage(pageNumber)
        fetchRepairers(pageNumber);
    };

    return (
        <>
            <div className="w-screen overflow-x-hidden">
                <Head>
                    <title>Chercher un réparateur</title>
                </Head>
                <Navbar/>
                <div className="w-screen" style={{marginBottom: '100px'}}>
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
                    {totalItems > 20 && <PaginationBlock totalItems={totalItems} onPageChange={handlePageChange} />}
                </div>
                <Footer />
            </div>
        </>
    );
};

export default SearchRepairer;
