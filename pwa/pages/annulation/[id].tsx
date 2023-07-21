import React, {useEffect} from 'react';
import {NextRouter, useRouter} from 'next/router';
import {useAccount} from '@contexts/AuthContext';
import {appointmentResource} from '@resources/appointmentResource';

const EditBike = () => {
  const router: NextRouter = useRouter();
  const {user} = useAccount({
    redirectIfNotFound: `/login?next=${encodeURIComponent(router.asPath)}`,
  });
  const {id} = router.query;

  const cancelAppointment = async (id: string) => {
    try {
      await appointmentResource.updateAppointmentStatus(id, {
        transition: 'cancellation',
      });
    } catch (error) {}

    await router.push('/rendez-vous/mes-rendez-vous');
  };

  useEffect(() => {
    if (user && id) {
      cancelAppointment(id as string);
    }
  }, [id, user]); // eslint-disable-line react-hooks/exhaustive-deps
};

export default EditBike;
