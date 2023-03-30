import {NextPageWithLayout} from 'pages/_app';
import React, {useState, useEffect, MouseEventHandler, ChangeEvent, SyntheticEvent} from 'react';
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
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Select, {SelectChangeEvent} from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import dynamic from 'next/dynamic';
const Navbar = dynamic(() => import("components/layout/Navbar"));
const Footer = dynamic(() => import("components/layout/Footer"));
const RepairersResults = dynamic(() => import("components/repairers/RepairersResults"));
import PaginationBlock from "components/common/PaginationBlock";
import Typography from '@mui/material/Typography';
import useMediaQuery from 'hooks/useMediaQuery';

const SearchRepairer: NextPageWithLayout = ({}) => {
    const [cityInput, setCityInput] = useState<string>('');
    const [city, setCity] = useState<City | null>(null);
    const [citiesList, setCitiesList] = useState<City[]>([]);
    const [timeoutId, setTimeoutId] = useState<number | null>(null);
    const [bikes, setBikes] = useState<BikeType[]>([]);
    const [selectedBike, setSelectedBike] = useState<BikeType | null>(null);
    const [selectedRepairer, setSelectedRepairer] = useState<string>('');
    const [repairers, setRepairers] = useState<Repairer[]>([]);
    const [pendingSearchCity, setPendingSearchCity] = useState<boolean>(false);
    const [showMap, setShowMap] = useState<boolean>(false);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [alreadyFetchApi, setAlreadyFetchApi] = useState<boolean>(false);
    const isMobile = useMediaQuery('(max-width: 640px)');

    useEffect(() => {
        const fetchBikes = async () => {
            const response = await bikeTypeResource.getAll({});
            setBikes(response['hydra:member']);
        };
        fetchBikes();
    }, []);

    const useNominatim = process.env.NEXT_PUBLIC_USE_NOMINATIM !== 'false';

    const handleCityChange = async (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): Promise<void> => {

        setCityInput(event.target.value);
        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        const newTimeoutId = window.setTimeout(async () => {
            const citiesResponse = await searchCity(event.target.value, useNominatim);
            const cities: City[] = useNominatim ? createCitiesWithNominatimAPI(citiesResponse as NominatimCity[]) : createCitiesWithGouvAPI(citiesResponse as GouvCity[]);
            setCitiesList(cities);
        }, 350);

        setTimeoutId(newTimeoutId);
    };


    const handleCitySelect = (event :  React.SyntheticEvent<Element, Event>, value: string | null) => {

        setCityInput(value ?? '');
        if (isMobile) {
            fetchRepairers(1, value);
        }
    }

    const handleBikeChange = (event: SelectChangeEvent): void => {
        const selectedBikeType = bikes.find((bt) => bt.id === Number(event.target.value));
        setSelectedBike(selectedBikeType ? selectedBikeType : null);

        if (isMobile) {
            fetchRepairers(1, cityInput, selectedBikeType);
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();
        await fetchRepairers(1);
    };

    const handlePageChange = (pageNumber: number): void => {
        fetchRepairers(pageNumber);
    };

    const fetchRepairers = async (pageNumber?: number, citySelected?: string | null, givenBike? : BikeType | null): Promise<void> => {

        if (!selectedBike || !cityInput) {
            return;
        }
        setPendingSearchCity(true)

        let params = {
            city: citySelected ?? cityInput,
            itemsPerPage: 20,
            'bikeTypesSupported.id': givenBike ? givenBike.id : selectedBike.id,
            'order[firstSlotAvailable]': 'ASC',
            'page': `${pageNumber ?? 1}`
        };
        params = city ? {...{'around[5000]': `${city.lat},${city.lon}`}, ...params} : params;

        const response = await repairerResource.getAll(params);
        setRepairers(response['hydra:member']);
        setTotalItems(response['hydra:totalItems']);
        setPendingSearchCity(false);
        setAlreadyFetchApi(true);
    };

    return (
        <>
            <div style={{width: "100vw", overflowX: "hidden"}}>
                <Head>
                    <title>Chercher un réparateur</title>
                </Head>
                <Navbar/>
                <div style={{width: "100vw", marginBottom: '100px'}}>
                    <form onSubmit={handleSubmit} style={{margin: "6px", padding: "36px 24px 48px", display: "grid", gap: "24px", gridTemplateColumns: "1fr 1fr"}}>
                        <div style={{marginBottom: "24px", width: "100%"}}>
                            <InputLabel htmlFor="bikeType">Type de Vélo</InputLabel>
                            <Select
                                onChange={handleBikeChange}
                                value={selectedBike?.name}
                                style={{width: '100%'}}
                            >
                                <MenuItem disabled value="">Choisissez un type de vélo</MenuItem>
                                {bikes.map((bike) => (
                                    <MenuItem key={bike.id} value={bike.id}>{bike.name}</MenuItem>
                                ))}
                            </Select>
                        </div>
                        <div style={{marginBottom: "24px", width: "100%"}}>
                            <InputLabel htmlFor="city">Ville</InputLabel>

                            <Autocomplete
                                freeSolo
                                value={cityInput}
                                options={citiesList.map((optionCity) => optionCity.name)}
                                onChange={(event, values) => handleCitySelect(event, values)}
                                renderInput={(params) =>
                                    <TextField
                                        {...params}
                                        value={cityInput}
                                        onChange={(e) => handleCityChange(e)}
                                    />}
                            />
                        </div>

                        <div className="hidden md:block">
                            <Button type="submit" variant="outlined">Chercher</Button>
                        </div>
                    </form>

                    <div style={{margin: "12px 0"}}>
                        {pendingSearchCity && <Spinner />}
                    </div>

                    <div className="md:hidden" style={{marginTop: "12px"}}>
                        {Object.keys(repairers).length > 0 && isMobile &&
                            <ButtonShowMap showMap={showMap} setShowMap={setShowMap} />
                        }
                    </div>

                    <div style={{marginTop: "12px"}}>
                        {Object.keys(repairers).length > 0 &&
                            <RepairersResults repairers={repairers} selectedRepairer={selectedRepairer} showMap={showMap} setSelectedRepairer={setSelectedRepairer} setRepairers={setRepairers} />
                        }

                        {(Object.keys(repairers).length === 0 && alreadyFetchApi) &&
                            <Typography>Pas de réparateurs disponibles</Typography>
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