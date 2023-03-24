import {Header} from '@components/layout/Header';
import {NextPageWithLayout} from 'pages/_app';
import {useRouter} from 'next/router';
import {useState} from 'react';
import {Footer} from "@components/layout/Footer";

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
    const [pendingSearchCity, setPendingSearchCity] = useState(false);

    const handleCityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCity(event.target.value);
        if (event.target.value.length > 1) {
            searchCity();
        }
    };

    const handleBikeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedBikeType = bikeTypes.find((bt) => bt.id === Number(event.target.value));
        setSelectedBike(selectedBikeType);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!city || !selectedBike) {
            return;
        }

        console.log('submit');
    };

    const searchCity = async () => {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${city}`);
        const data = await response.json();
        const cityDetails = data[0];

        console.log(cityDetails);
    }

    return (
        <>
            <Header title="Encore un peu de patience" />
            <div className="container max-w-3xl px-4 mb-20 | sm:px-0 sm:mb-0">
                Chercher un réparateur
            </div>

            <form onSubmit={handleSubmit}>
                <label htmlFor="city">Ville</label>
                <input type="text" id="city" name="city" onChange={handleCityChange} required />

                <label htmlFor="bikeType">Type de Vélo</label>
                <select value={selectedBike?.id ?? ''} onChange={handleBikeChange}>
                    <option value="">Choisissez un type de vélo</option>
                    {bikeTypes.map((bike) => (
                        <option key={bike.id} value={bike.id}>
                            {bike.name}
                        </option>
                    ))}
                </select>
            </form>

            <Footer logged={true} />
        </>
    );
};

export default SearchRepairer;
