import React, {useEffect, useRef, useState} from 'react';
import {Repairer} from '@interfaces/Repairer';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, {DateClickArg} from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';
import {Appointment} from '@interfaces/Appointment';
import {appointmentResource} from '@resources/appointmentResource';
import {EventImpl} from '@fullcalendar/core/internal';
import ModalShowAppointment from '@components/dashboard/agenda/ModalShowAppointment';
import ModalAppointmentCreate from '@components/dashboard/appointments/ModalAppointmentCreate';
import {getFirstDaysOfMonth} from '@helpers/firstDayOfMonthHelper';
import {getEndAppointment} from '@helpers/endAppointmentHelper';
import router from 'next/router';
import {DatesSetArg} from '@fullcalendar/core';

interface AgendaCalendarProps {
  repairer: Repairer;
}

const AgendaCalendar = ({repairer}: AgendaCalendarProps): JSX.Element => {
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [calendarEvents, setCalendarEvents] = useState<
    {title: string; id: string}[]
  >([]);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const {firstDayOfMonth, firstDayOfNextMonth} = getFirstDaysOfMonth();
  const [startDate, setStartDate] = useState<string>(firstDayOfMonth);
  const [endDate, setEndDate] = useState<string>(firstDayOfNextMonth);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [initialDate, setInitialDate] = useState<Date | null>(null);
  const [openModalCreateAppointment, setOpenModalCreateAppointment] =
    useState<boolean>(false);

  const handleCloseModal = (refresh = true): void => {
    setOpenModal(false);
    setAppointment(null);
    if (refresh) {
      buildCalendarEvents(startDate, endDate);
    }
  };

  const handleCloseModalCreateAppointment = (refresh: boolean = true) => {
    setOpenModalCreateAppointment(false);
    setSelectedDate('');
    if (refresh) {
      buildCalendarEvents(startDate, endDate);
    }
  };

  useEffect(() => {
    buildCalendarEvents(startDate, endDate);
    const dateQueryUrl = router.query.selectedDate;
    if (dateQueryUrl) {
      if (typeof dateQueryUrl === 'string') {
        setInitialDate(new Date(dateQueryUrl.split('T')[0]));
      }
    } else {
      setInitialDate(new Date());
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const buildCalendarEvents = async (start: string, end: string) => {
    const appointmentsFetch = await appointmentResource.getAll(true, {
      'slotTime[after]': start,
      'slotTime[before]': end,
    });
    const appointments = appointmentsFetch['hydra:member'];

    const appointmentsEvents = appointments.map((appointment) => {
      const {customer, autoDiagnostic, slotTime} = appointment;
      const title: string = customer
        ? `${customer.firstName} ${customer.lastName}`
        : 'Nom inconnu';
      const prestation = autoDiagnostic ? `(${autoDiagnostic.prestation})` : '';

      let color;
      switch (appointment.status) {
        case 'validated':
          color = 'green';
          break;
        case 'pending_repairer':
          color = 'grey';
          break;
        case 'pending_cyclist':
          color = 'orange';
          break;
        case 'cancel':
          color = 'red';
          break;
        case 'refused':
          color = 'red';
          break;
        default:
          color = 'grey';
      }
      return {
        title: `${
          appointment.status === 'pending_repairer' ? '⌛' : ''
        }️ ${title} ${prestation}`,
        start: slotTime,
        end: getEndAppointment(slotTime, repairer.durationSlot ?? 60),
        id: appointment['@id'],
        color: color,
        display: 'block',
      };
    });

    setCalendarEvents(appointmentsEvents);
  };
  const clickAppointment = async (event: EventImpl) => {
    setOpenModal(true);
    const appointmentFetch = await appointmentResource.get(event.id, true);
    setAppointment(appointmentFetch);
  };

  const handleDateChange = (payload: DatesSetArg) => {
    if (payload.startStr === startDate && payload.endStr === endDate) {
      return;
    }

    setStartDate(payload.startStr);
    setEndDate(payload.endStr);
    buildCalendarEvents(payload.startStr, payload.endStr);
  };

  const calendarRef = useRef<FullCalendar>(null);
  const handleDateClick = (arg: DateClickArg, refresh = true) => {
    if (arg) {
      const dateFormat1 = /^\d{4}-\d{2}-\d{2}$/; // Format: YYYY-MM-DD
      const dateFormat2 = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/; // Format: YYYY-MM-DDTHH:mm:ss
      if (dateFormat1.test(arg.dateStr)){
        setSelectedDate(`${arg.dateStr}T00:00:00`);
        setOpenModalCreateAppointment(true);
      } else if (dateFormat2.test(arg.dateStr)) {
        setSelectedDate(arg.dateStr);
        setOpenModalCreateAppointment(true);
      }
    }
  };

  return (
    <>
      {initialDate && (
        <FullCalendar
          timeZone="Europe/Paris"
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridDay"
          initialDate={initialDate}
          datesSet={handleDateChange}
          weekends={true}
          locales={[frLocale]}
          locale="fr"
          eventClick={(info) => clickAppointment(info.event)}
          eventContent={(event) => {
            return (
              <div>
                <span>{event.timeText}</span>
                <span>{event.event.title}</span>
              </div>
            );
          }}
          headerToolbar={{
            left: 'prev,next',
            center: 'title',
            right: 'timeGridDay,dayGridWeek,dayGridMonth',
          }}
          events={calendarEvents}
          eventMouseEnter={(info) => {
            info.el.style.cursor = 'pointer';
          }}
          dateClick={handleDateClick}
        />
      )}

      {appointment && (
        <ModalShowAppointment
          appointment={appointment}
          openModal={openModal}
          handleCloseModal={handleCloseModal}
        />
      )}
      {selectedDate && (
        <ModalAppointmentCreate
          repairer={repairer}
          appointmentSelectedDate={selectedDate}
          openModal={openModalCreateAppointment}
          handleCloseModal={handleCloseModalCreateAppointment}
        />
      )}
    </>
  );
};

export default AgendaCalendar;
