import {useEffect, useState} from 'react';
import {RepairerType} from '@interfaces/RepairerType';
import {repairerTypeResource} from '@resources/repairerTypeResource';

function useRepairerTypes(): RepairerType[] {
  const [repairerTypes, setRepairerTypes] = useState<RepairerType[]>([]);

  async function fetchRepairerTypes() {
    const response = await repairerTypeResource.getAll(false);
    setRepairerTypes(response['hydra:member']);
  }

  useEffect(() => {
    fetchRepairerTypes();
  }, []);

  return repairerTypes;
}

export default useRepairerTypes;
