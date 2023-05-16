import React from 'react';
import {Repairer} from '@interfaces/Repairer';
import OpeningHoursDetail from "@components/dashboard/agenda/OpeningHoursDetail";
import {Typography} from "@mui/material";
import Box from "@mui/material/Box";
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';

interface AgendaCalendarProps {
    repairer: Repairer;
}

export const AgendaCalendar = ({repairer}: AgendaCalendarProps): JSX.Element => {


    return (
        <>
            <FullCalendar
                plugins={[ dayGridPlugin, timeGridPlugin, interactionPlugin ]}
                initialView="timeGridDay"
                weekends={false}
                locales={[frLocale]}
                locale="fr"
                headerToolbar={{
                    left: 'prev,next',
                    center: 'title',
                    right: 'timeGridDay,dayGridWeek,dayGridMonth',
                }}
                events={[
                    { title: 'event 1', date: '2023-05-17' },
                    { title: 'event 2', date: '2023-05-16' }
                ]}
            />
        </>
    );
};

export default AgendaCalendar;
