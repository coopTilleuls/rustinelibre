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
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Select, {SelectChangeEvent} from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
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

    const handleBikeChange = (event: SelectChangeEvent) => {
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
            <div style={{width: "100vw", overflowX: "hidden"}}>
                <Head>
                    <title>Chercher un réparateur</title>
                </Head>
                <Navbar/>
                <div style={{width: "100vw"}}>
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
                                renderInput={(params => <TextField {...params} value={cityInput} onChange={handleCityChange} />)}
                                options={citiesList.map((city: City) => city.name)}
                                noOptionsText={"Pas de résultats"}
                            />
                        </div>

                        <Button type="submit" variant="outlined">Chercher</Button>
                    </form>

                    <div style={{margin: "12px 0"}}>
                        {pendingSearchCity && <Spinner />}
                    </div>

                    <div style={{marginTop: "12px"}}> {/* TODO: cacher en format mobile */}
                        {Object.keys(repairers).length > 0 &&
                            <ButtonShowMap showMap={showMap} setShowMap={setShowMap} />
                        }
                    </div>

                    <div style={{marginTop: "12px"}}>
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
