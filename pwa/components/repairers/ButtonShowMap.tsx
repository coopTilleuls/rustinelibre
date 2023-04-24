import React, { useContext } from 'react';
import Button from '@mui/material/Button';
import { SearchRepairerContext } from '@contexts/SearchRepairerContext';

export const ButtonShowMap = (): JSX.Element => {
  const { showMap, setShowMap } = useContext(SearchRepairerContext);

  return (
    <>
      <div>
        <Button onClick={() => setShowMap(!showMap)} variant='outlined'>
          {showMap ? 'Voir les résultats' : 'Voir sur la carte'}
        </Button>
      </div>
    </>
  );
};

export default ButtonShowMap;
