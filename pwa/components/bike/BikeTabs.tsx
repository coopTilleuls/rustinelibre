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
import {AccountCircle, BuildCircle} from '@mui/icons-material';

type BikeTabsProps = {
  bike: Bike;
  setBike: (bike: Bike) => void;
  bikeTypes: BikeType[];
};

const BikeTabs = ({bike, setBike, bikeTypes}: BikeTabsProps): JSX.Element => {
  const {user} = useAccount({});
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
      <Box sx={{borderBottom: 1, borderColor: 'divider', width: '100%'}}>
        <Tabs
          variant="fullWidth"
          value={tabValue}
          onChange={handleChangeTab}
          aria-label="bike tabs"
          sx={{width: '100%'}}>
          <Tab
            label="Fiche d'identité"
            iconPosition="start"
            icon={<AccountCircle />}
          />
          <Tab
            icon={<BuildCircle />}
            iconPosition="start"
            label="Réparations"
          />
        </Tabs>
      </Box>

      <Box sx={{width: '100%'}}>
        {tabValue === 0 && (
          <BikeIdentity bike={bike} setBike={setBike} bikeTypes={bikeTypes} />
        )}
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
