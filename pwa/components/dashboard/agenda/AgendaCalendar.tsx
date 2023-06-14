import React, {useEffect, useState} from 'react';
import {Repairer} from '@interfaces/Repairer';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';
import {Appointment} from "@interfaces/Appointment";
import {appointmentResource} from "@resources/appointmentResource";
import {EventImpl} from "@fullcalendar/core/internal";
import ModalShowAppointment from "@components/dashboard/agenda/ModalShowAppointment";

const getFirstDaysOfMonth = () : {firstDayOfMonth: string; firstDayOfNextMonth: string } => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const firstDayOfNextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);

    const firstDayOfMonthFormatted = firstDayOfMonth.toISOString().split('T')[0];
    const firstDayOfNextMonthFormatted = firstDayOfNextMonth.toISOString().split('T')[0];

    return {
        firstDayOfMonth: firstDayOfMonthFormatted,
        firstDayOfNextMonth: firstDayOfNextMonthFormatted
    };
}

const getEndAppointment = (givenDate: string, duration: number): string => {
    const date = new Date(givenDate);
    const updatedDate = new Date(date.getTime() + duration * 60 * 1000);
    return updatedDate.toISOString();
}

interface AgendaCalendarProps {
    repairer: Repairer;
}

export const AgendaCalendar = ({repairer}: AgendaCalendarProps): JSX.Element => {

    const [appointment, setAppointment] = useState<Appointment|null>(null);
    const [calendarEvents, setCalendarEvents] = useState<{ title: string; id: string }[]>([]);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const { firstDayOfMonth, firstDayOfNextMonth } = getFirstDaysOfMonth();
    const [startDate, setStartDate] = useState<string>(firstDayOfMonth);
    const [endDate, setEndDate] = useState<string>(firstDayOfNextMonth);

    const handleCloseModal = (refresh = true): void => {
        setOpenModal(false);
        setAppointment(null);
        if (refresh) {
            buildCalendarEvents(startDate, endDate);
        }
    };

    useEffect(() => {
        buildCalendarEvents(startDate, endDate);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const buildCalendarEvents = async (start: string, end: string) => {
        const appointmentsFetch = await appointmentResource.getAll(true, {
            'slotTime[after]': start,
            'slotTime[before]': end
        });
        const appointments = appointmentsFetch['hydra:member'];

        const appointmentsEvents = appointments.map((appointment) => {
            const { customer, autoDiagnostic, slotTime } = appointment;
            const title: string = customer ? `${customer.firstName} ${customer.lastName}` : 'Nom inconnu';
            const prestation = autoDiagnostic ? `(${autoDiagnostic.prestation})` : '';

            let color = 'grey';
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
            }

            return {
                title: `${appointment.status === 'pending_repairer' ? '⌛' : ''}️ ${title} ${prestation}`,
                start: slotTime,
                end: getEndAppointment(slotTime, repairer.durationSlot ?? 60),
                id: appointment['@id'],
                color: color,
                display: 'block'
            };
        });

        setCalendarEvents(appointmentsEvents);
    }

    const clickAppointment = async (event: EventImpl) => {
        setOpenModal(true);
        const appointmentFetch = await appointmentResource.get(event.id, true);
        setAppointment(appointmentFetch);
    }

    const handleDateChange = (payload: any) => {

        if (payload.startStr === startDate && payload.endStr === endDate) {
            return;
        }

        setStartDate(payload.startStr)
        setEndDate(payload.endStr)
        buildCalendarEvents(payload.startStr, payload.endStr);
    };

    return (
        <>
            <FullCalendar
                plugins={[ dayGridPlugin, timeGridPlugin, interactionPlugin ]}
                initialView="timeGridDay"
                datesSet={handleDateChange}
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
                eventMouseEnter={(info) => {info.el.style.cursor = 'pointer'}}
            />

            {
                appointment && <ModalShowAppointment
                    appointment={appointment}
                    openModal={openModal}
                    handleCloseModal={handleCloseModal}
                />
            }
        </>
    );
};

export default AgendaCalendar;
