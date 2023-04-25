import React, {useState} from "react";
import {Bike} from "@interfaces/Bike";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import BikeIdentity from "@components/bike/BikeIdentity";
import {BikeType} from "@interfaces/BikeType";

type BikeTabsProps = {
    bike: Bike;
    bikeTypes: BikeType[];
};

const BikeTabs = ({bike, bikeTypes}: BikeTabsProps): JSX.Element => {
    const [tabValue, setTabValue] = useState<number>(0);

    const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    return (
        <Box>
            <Tabs
                value={tabValue}
                onChange={handleChangeTab}
                aria-label='bike tabs'
            >
                <Tab label="Fiche d'identité" />
                <Tab label='Réparations' />
            </Tabs>

            <Box sx={{ marginTop: 2 }}>
                {tabValue === 0 && (
                    <BikeIdentity bike={bike} bikeTypes={bikeTypes} />
                )}
            </Box>
        </Box>
    )
}

export default BikeTabs;
