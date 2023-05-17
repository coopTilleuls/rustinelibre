import React, {useEffect, useState} from 'react';
import {Repairer} from '@interfaces/Repairer';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';
import {Appointment} from '@interfaces/Appointment';
import {appointmentResource} from '@resources/appointmentResource';
import {EventImpl} from '@fullcalendar/core/internal';
import ModalShowAppointment from '@components/dashboard/agenda/ModalShowAppointment';

const getFirstDaysOfMonth = (): {
  firstDayOfMonth: string;
  firstDayOfNextMonth: string;
} => {
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const firstDayOfNextMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    1
  );

  const firstDayOfMonthFormatted = firstDayOfMonth.toISOString().split('T')[0];
  const firstDayOfNextMonthFormatted = firstDayOfNextMonth
    .toISOString()
    .split('T')[0];

  return {
    firstDayOfMonth: firstDayOfMonthFormatted,
    firstDayOfNextMonth: firstDayOfNextMonthFormatted,
  };
};

const getEndAppointment = (givenDate: string, duration: number): string => {
  const date = new Date(givenDate);
  const updatedDate = new Date(date.getTime() + duration * 60 * 1000);
  return updatedDate.toISOString();
};

interface AgendaCalendarProps {
  repairer: Repairer;
}

export const AgendaCalendar = ({
  repairer,
}: AgendaCalendarProps): JSX.Element => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [calendarEvents, setCalendarEvents] = useState<
    {title: string; id: string}[]
  >([]);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const handleOpenModal = (): void => setOpenModal(true);
  const handleCloseModal = (refresh = true): void => {
    setOpenModal(false);
    if (refresh) {
      fetchAppointments();
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchAppointments = async (view: string = 'day') => {
    const {firstDayOfMonth, firstDayOfNextMonth} = getFirstDaysOfMonth();
    const appointmentsFetch = await appointmentResource.getAll(true, {
      'slotTime[after]': firstDayOfMonth,
      'slotTime[before]': firstDayOfNextMonth,
    });
    buildCalendarEvents(appointmentsFetch['hydra:member']);
  };

  const buildCalendarEvents = (appointments: Appointment[]) => {
    const appointmentsEvents = appointments.map((appointment) => {
      const {customer, autoDiagnostic, slotTime} = appointment;
      const title: string = `${customer.firstName} ${customer.lastName}`;
      const prestation = autoDiagnostic ? `(${autoDiagnostic.prestation})` : '';

      return {
        title: `${title} ${prestation}`,
        start: slotTime,
        end: getEndAppointment(slotTime, repairer.durationSlot ?? 60),
        id: appointment['@id'],
      };
    });

    setCalendarEvents(appointmentsEvents);
  };

  const clickAppointment = (event: EventImpl) => {
    setOpenModal(true);
    setSelectedId(event.id);
  };

  return (
    <>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridDay"
        weekends={false}
        locales={[frLocale]}
        locale="fr"
        eventClick={(info) => clickAppointment(info.event)}
        headerToolbar={{
          left: 'prev,next',
          center: 'title',
          right: 'timeGridDay,dayGridWeek,dayGridMonth',
        }}
        events={calendarEvents}
        eventMouseEnter={(info) => {
          info.el.style.cursor = 'pointer';
        }}
      />

      {selectedId && (
        <ModalShowAppointment
          id={selectedId}
          openModal={openModal}
          handleCloseModal={handleCloseModal}
        />
      )}
    </>
  );
};

export default AgendaCalendar;
