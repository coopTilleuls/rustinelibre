export const searchCity = async (search: string, useNominatim: boolean = false) => {
   return useNominatim ? nominatimCities(search) : gouvCities(search);
}

const nominatimCities = async (search: string) => {
    search = encodeURIComponent(search);
    const response = await fetch(`https://nominatim.openstreetmap.org/search?city=${search}&addressdetails=1&format=json`);
    return await response.json();
}

const gouvCities = async (search: string) => {

    search = encodeURIComponent(search);
    const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${search}&type=municipality`, {
    });

    return await response.json()
        .then((data) => {
            return data["features"];
        });
}
