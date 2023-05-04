import React, {useContext, useEffect} from 'react';
import dynamic from 'next/dynamic';
import InputLabel from '@mui/material/InputLabel';
import {RepairerFormContext} from '@contexts/RepairerFormContext';
const Editor = dynamic(() => import('@components/form/Editor'), {
  ssr: false,
});
import {Repairer} from '@interfaces/Repairer';

interface OptionnalInfosProps {
  repairer: Repairer | null;
}

export const OptionalInfos = ({repairer}: OptionnalInfosProps): JSX.Element => {
  const {optionalPage, setOptionalPage} = useContext(RepairerFormContext);

  useEffect(() => {
    if (repairer) {
      setOptionalPage(repairer.optionalPage ? repairer.optionalPage : '');
    }
  }, [repairer, setOptionalPage]);

  return (
    <>
      <InputLabel sx={{mt: 4, mb: -2, ml: 1}}>
        Informations complémentaires (page visible avant la prise de rendez
        vous)
      </InputLabel>
      <Editor content={optionalPage} setContent={setOptionalPage} />
    </>
  );
};

export default OptionalInfos;
