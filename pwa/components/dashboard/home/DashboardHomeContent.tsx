import React, {useCallback, useEffect, useState} from 'react';
import {Box} from '@mui/material';
import Grid from '@mui/material/Grid';
import DashboardNextAppointments from '@components/dashboard/home/DashboardNextAppointments';
import DashboardWaitingAppointments from '@components/dashboard/home/DashboardWaitingAppointments';
import {appointmentResource} from '@resources/appointmentResource';
import {Appointment} from '@interfaces/Appointment';
import {RequestParams} from '@interfaces/Resource';
import {dateObjectAsString} from '@helpers/dateHelper';
import DashboardHomeEmployees from '@components/dashboard/home/DashboardHomeEmployees';
import {User} from '@interfaces/User';
import {Repairer} from '@interfaces/Repairer';
import {isBoss} from '@helpers/rolesHelpers';
import {Messaging, onMessage} from "firebase/messaging";
import {getFirebaseApp, getMessaging} from "@config/firebase";

interface DashboardHomeContentProps {
  repairer: Repairer;
  currentUser: User;
}

export const DashboardHomeContent = ({
  repairer,
  currentUser,
}: DashboardHomeContentProps): JSX.Element => {
  const [loadingListNext, setLoadingListNext] = useState<boolean>(false);
  const [loadingListWait, setLoadingListWait] = useState<boolean>(false);
  const [appointmentsNext, setAppointmentsNext] = useState<Appointment[]>([]);
  const [appointmentsWaiting, setAppointmentsWaiting] = useState<Appointment[]>(
    []
  );

  const fetchNextAppointments = async () => {
    setLoadingListNext(true);
    const nextAppointments = await fetchAppointments({
      itemsPerPage: '6',
      repairer: repairer['@id'],
      'order[slotTime]': 'ASC',
      'slotTime[after]': dateObjectAsString(new Date()),
      status: 'validated',
    });

    setAppointmentsNext(nextAppointments);
    setLoadingListNext(false);
  };

  const fetchWaitingAppointments = async () => {
    setLoadingListWait(true);
    const waitAppointments = await fetchAppointments({
      itemsPerPage: '6',
      repairer: repairer['@id'],
      'order[slotTime]': 'ASC',
      status: 'pending_repairer',
      'slotTime[after]': dateObjectAsString(new Date()),
    });

    setAppointmentsWaiting(waitAppointments);
    setLoadingListWait(false);
  };

  const fetchAppointments = async (
    params: RequestParams
  ): Promise<Appointment[]> => {
    const response = await appointmentResource.getAll(true, params);
    return response['hydra:member'];
  };

  const handleIncomingFcmMessages = useCallback(
      (messaging: Messaging): void => {
        onMessage(messaging, (payload) => {
          console.log('Nouveau RDV');
          fetchWaitingAppointments();
        });
      },
      []
  );

  useEffect(() => {
    const firebaseApp = getFirebaseApp();
    const messaging = getMessaging(firebaseApp);
    handleIncomingFcmMessages(messaging);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box>
      {repairer && (
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <DashboardNextAppointments
              repairer={repairer}
              appointmentsNext={appointmentsNext}
              fetchNextAppointments={fetchNextAppointments}
              loadingListNext={loadingListNext}
            />
          </Grid>
          <Grid item xs={6}>
            <DashboardWaitingAppointments
              repairer={repairer}
              appointmentsWaiting={appointmentsWaiting}
              fetchNextAppointments={fetchNextAppointments}
              fetchWaitingAppointments={fetchWaitingAppointments}
              loadingListWait={loadingListWait}
            />
          </Grid>
          {isBoss(currentUser) && (
            <Grid item xs={12} mt={2}>
              <DashboardHomeEmployees currentBoss={currentUser} />
            </Grid>
          )}
        </Grid>
      )}
    </Box>
  );
};

export default DashboardHomeContent;
