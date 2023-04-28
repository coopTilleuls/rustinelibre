import React, {useEffect, useState} from 'react';
import {Bike} from '@interfaces/Bike';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import BikeIdentity from '@components/bike/BikeIdentity';
import {BikeType} from '@interfaces/BikeType';
import BikeMaintenance from '@components/bike/BikeMaintenance';
import {Collection} from '@interfaces/Resource';
import {Maintenance} from '@interfaces/Maintenance';
import {maintenanceResource} from '@resources/MaintenanceResource';
import {useAccount} from '@contexts/AuthContext';

type BikeTabsProps = {
  bike: Bike;
  bikeTypes: BikeType[];
};

const BikeTabs = ({bike, bikeTypes}: BikeTabsProps): JSX.Element => {
  const user = useAccount({});
  const [tabValue, setTabValue] = useState<number>(0);
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  async function fetchMaintenance() {
    if (user) {
      setLoading(true);
      const maintenanceCollection: Collection<Maintenance> =
        await maintenanceResource.getAll(true, {
          bike: bike.id,
          'order[repairDate]': 'DESC',
        });
      setMaintenances(maintenanceCollection['hydra:member']);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMaintenance();
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Tabs
        value={tabValue}
        onChange={handleChangeTab}
        aria-label="bike tabs"
        sx={{width: '100%'}}>
        <Tab label="Fiche d'identité" sx={{width: '50%'}} />
        <Tab label="Réparations" sx={{width: '50%'}} />
      </Tabs>

      <Box sx={{marginTop: 2}}>
        {tabValue === 0 && <BikeIdentity bike={bike} bikeTypes={bikeTypes} />}
        {tabValue === 1 && (
          <BikeMaintenance
            bike={bike}
            maintenances={maintenances}
            loading={loading}
            fetchMaintenance={fetchMaintenance}
          />
        )}
      </Box>
    </Box>
  );
};

export default BikeTabs;
