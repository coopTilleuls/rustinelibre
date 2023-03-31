import {NextPageWithLayout} from 'pages/_app';
import React, {useState, useEffect, ChangeEvent, useRef, SyntheticEvent, FormEvent} from 'react';
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
import RepairerSortOptions from "components/repairers/RepairerSortOptions";
import PaginationBlock from "components/common/PaginationBlock";
import Typography from '@mui/material/Typography';
import useMediaQuery from 'hooks/useMediaQuery';

interface OrderByOption {
    [key: string]: string;
}

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
    const [orderByKey, setOrderByKey] = useState<string|null>(null);
    const [orderByValue, setOrderByValue] = useState<string|null>(null);
    const isMobile = useMediaQuery('(max-width: 640px)');
    const listContainerRef = useRef<HTMLDivElement>(null);

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

    const handleChangeSort = (sortOption: string) => {

        let orderBy: OrderByOption;
        switch (sortOption) {
            case 'proximity':
                setOrderByKey('sort');
                setOrderByValue('proximity');
                orderBy = {'sort': 'proximity'};
                break;
            case 'repairersType':
                setOrderByKey('sort');
                setOrderByValue('repairersType');
                orderBy = {'sort': 'repairersType'};
                break;
            default:
                setOrderByKey('order[firstSlotAvailable]');
                setOrderByValue('ASC');
                orderBy = {'order[firstSlotAvailable]': 'ASC'};
        }

        fetchRepairers(1, city, selectedBike, orderBy);
    }

    const handleCitySelect = (event :  SyntheticEvent<Element, Event>, value: string | null) => {

        const selectedCity = citiesList.find((city) => city.name === value);
        setCity(selectedCity ?? null);
        setCityInput(value ?? '');

        if (isMobile) {
            fetchRepairers(1, selectedCity);
        }
    }

    const handleBikeChange = (event: SelectChangeEvent): void => {
        const selectedBikeType = bikes.find((bt) => bt.id === Number(event.target.value));
        setSelectedBike(selectedBikeType ? selectedBikeType : null);

        if (isMobile) {
            fetchRepairers(1, city, selectedBikeType);
        }
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();
        await fetchRepairers(1);
    };

    const handlePageChange = (pageNumber: number): void => {
        fetchRepairers(pageNumber);
        scrollToTop();
    };

    const scrollToTop = (): void => {
        if (listContainerRef.current) {
            listContainerRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const fetchRepairers = async (pageNumber?: number, citySelected?: City | null, givenBike? : BikeType | null, orderByGiven?: OrderByOption | null): Promise<void> => {

        if (!selectedBike || !cityInput) {
            return;
        }
        setPendingSearchCity(true)

        let params = {
            city: citySelected ? citySelected.name : (city ? city.name : cityInput),
            itemsPerPage: 20,
            'bikeTypesSupported.id': givenBike ? givenBike.id : selectedBike.id,
            'page': `${pageNumber ?? 1}`
        };
        
        params = citySelected ? {...{'around[5000]': `${citySelected.lat},${citySelected.lon}`}, ...params}
            :  (city ? {...{'around[5000]': `${city.lat},${city.lon}`}, ...params} : params);

        // if (orderByGiven) {
        //     const orderKey = Object.keys(orderByGiven)[0];
        //     const orderValue = orderByGiven[orderKey];
        //     params = {...{orderKey: orderValue}, ...params};
        // } else if (orderByKey && orderByValue) {
        //     params = {...{orderByKey: orderByValue}, ...params};
        // } else {
        //     params = {...{'order[firstSlotAvailable]': 'ASC'}, ...params};
        // }

        console.log(params);

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
                        <div style={{marginBottom: "24px", width: "100%"}} ref={listContainerRef}>
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

                        <RepairerSortOptions handleChangeSort={handleChangeSort} />

                        <div className="hidden md:block">
                            <Button fullWidth type="submit" variant="outlined">Chercher</Button>
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
