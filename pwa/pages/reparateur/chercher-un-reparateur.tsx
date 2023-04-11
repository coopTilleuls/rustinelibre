import {NextPageWithLayout} from 'pages/_app';
import React, {useState, useEffect, ChangeEvent, useRef, SyntheticEvent, FormEvent, useContext} from 'react';
import Head from "next/head";
import {repairerResource} from '@resources/repairerResource';
import {ButtonShowMap} from '@components/repairers/ButtonShowMap';
import {createCitiesWithGouvAPI, createCitiesWithNominatimAPI, City} from '@interfaces/City';
import {City as NominatimCity} from '@interfaces/Nominatim';
import {City as GouvCity} from '@interfaces/Gouv';
import Spinner from '@components/icons/Spinner';
import {searchCity} from '@utils/apiCity';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Select, {SelectChangeEvent} from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import dynamic from 'next/dynamic';
const RepairersResults = dynamic(() => import("@components/repairers/RepairersResults"), {
    ssr: false
});
import RepairerSortOptions from "@components/repairers/RepairerSortOptions";
import PaginationBlock from "@components/common/PaginationBlock";
import Typography from '@mui/material/Typography';
import useMediaQuery from '@hooks/useMediaQuery';
import useBikeTypes from "@hooks/useBikeTypes";
import WebsiteLayout from "@components/layout/WebsiteLayout";
import {SearchRepairerContext} from "@contexts/SearchRepairerContext";

const SearchRepairer: NextPageWithLayout = ({}) => {
    const useNominatim = process.env.NEXT_PUBLIC_USE_NOMINATIM !== 'false';
    const [citiesList, setCitiesList] = useState<City[]>([]);
    const [timeoutId, setTimeoutId] = useState<number | null>(null);
    const [pendingSearchCity, setPendingSearchCity] = useState<boolean>(false);
    const [alreadyFetchApi, setAlreadyFetchApi] = useState<boolean>(false);
    const isMobile = useMediaQuery('(max-width: 640px)');
    const listContainerRef = useRef<HTMLDivElement>(null);
    const bikeTypes = useBikeTypes();

    const {cityInput, setCityInput, city, setCity, selectedBike, setSelectedBike, showMap, setShowMap,
        setSelectedRepairer, selectedRepairer, repairers, setRepairers, currentPage, setCurrentPage,
        repairerTypeSelected, setRepairerTypeSelected, orderBy, setOrderBy, sortChosen, setSortChosen, totalItems, setTotalItems} = useContext(SearchRepairerContext);

    useEffect(() => {
        if (isMobile && city && selectedBike) {
            fetchRepairers();
        }
    }, [city, selectedBike, orderBy]);

    useEffect(() => {fetchRepairers();scrollToTop()},[currentPage]);

    useEffect(() => {
        if (sortChosen === 'repairersType') {
            setOrderBy({
                'key': 'repairerType.id',
                'value': repairerTypeSelected
            })
        }
    }, [repairerTypeSelected]);

    useEffect(() => {
        if (cityInput === '') return;

        if (timeoutId) clearTimeout(timeoutId);

        const newTimeoutId = window.setTimeout(async () => {
            const citiesResponse = await searchCity(cityInput, useNominatim);
            const cities: City[] = useNominatim ? createCitiesWithNominatimAPI(citiesResponse as NominatimCity[]) : createCitiesWithGouvAPI(citiesResponse as GouvCity[]);
            setCitiesList(cities);
        }, 350);

        setTimeoutId(newTimeoutId);
    }, [cityInput]);

    const handleCityChange = async (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): Promise<void> => {
        setCityInput(event.target.value);
    };

    const handleChangeSort = (sortOption: string): void => {
        setSortChosen(sortOption);

        let value = '';
        if(sortOption === 'repairersType') {
            value = repairerTypeSelected;
        }else if (sortOption === 'availability') {
            value = 'ASC';
        }else if (sortOption === 'proximity') {
            value = `${city?.lat},${city?.lon}`;
        }

        setOrderBy({
            'key': sortOption,
            'value': value,
        });
    }

    const handleCitySelect = (event :  SyntheticEvent<Element, Event>, value: string | null) => {
        const selectedCity = citiesList.find((city) => city.name === value);
        setCity(selectedCity ?? null);
        setCityInput(value ?? '');
    }

    const handleBikeChange = (event: SelectChangeEvent): void => {
        const selectedBikeType = bikeTypes.find((bt) => bt.id === Number(event.target.value));
        setSelectedBike(selectedBikeType ? selectedBikeType : null);
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();
        await fetchRepairers();
    };

    const handlePageChange = (pageNumber: number): void => {
        setCurrentPage(pageNumber)
    };

    const scrollToTop = (): void => {
        if (listContainerRef.current) {
            listContainerRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const fetchRepairers = async (): Promise<void> => {

        if (!selectedBike || !cityInput) {
            return;
        }

        setPendingSearchCity(true)

        let params = {
            city: city ? city.name : cityInput,
            itemsPerPage: 20,
            'bikeTypesSupported.id': selectedBike.id,
            'page': `${currentPage ?? 1}`,
            'sort': 'random'
        };

        params = city ? {...{'around[5000]': `${city.lat},${city.lon}`}, ...params} : params;

        if (orderBy) {
            const { key, value } = orderBy;
            params = {...params, [key]: value}
        } else {
            params = {...{'availability': 'ASC'}, ...params}
        }

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
                <WebsiteLayout />
                <div style={{width: "100vw", marginBottom: '100px'}}>
                    <form onSubmit={handleSubmit} style={{margin: "6px", padding: "36px 24px 48px", display: "grid", gap: "24px", gridTemplateColumns: "1fr 1fr"}}>
                        <div style={{marginBottom: "14px"}}>
                            <InputLabel htmlFor="bikeType">Type de Vélo</InputLabel>
                            <Select
                                onChange={handleBikeChange}
                                value={selectedBike?.name}
                                style={{width: '100%'}}
                            >
                                <MenuItem disabled value="">Choisissez un type de vélo</MenuItem>
                                {bikeTypes.map((bike) => (
                                    <MenuItem key={bike.id} value={bike.id}>{bike.name}</MenuItem>
                                ))}
                            </Select>
                        </div>
                        <div style={{marginBottom: "14px"}} ref={listContainerRef}>
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
                                    />
                                }
                            />
                        </div>

                        <RepairerSortOptions sortChosen={sortChosen} handleChangeSort={handleChangeSort} isMobile={isMobile} repairerTypeSelected={repairerTypeSelected} setRepairerTypeSelected={setRepairerTypeSelected} />

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
            </div>
        </>
    );
};

export default SearchRepairer;
