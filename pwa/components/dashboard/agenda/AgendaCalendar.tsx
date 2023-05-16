import React from 'react';
import {Repairer} from '@interfaces/Repairer';
import OpeningHoursDetail from "@components/dashboard/agenda/OpeningHoursDetail";
import {Typography} from "@mui/material";
import Box from "@mui/material/Box";
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'

interface AgendaCalendarProps {
    repairer: Repairer;
}

export const AgendaCalendar = ({repairer}: AgendaCalendarProps): JSX.Element => {
    return (
        <>
            <FullCalendar
                plugins={[ dayGridPlugin ]}
                initialView="dayGridMonth"
                weekends={false}
                events={[
                    { title: 'event 1', date: '2019-04-01' },
                    { title: 'event 2', date: '2019-04-02' }
                ]}
            />
        </>
    );
};

export default AgendaCalendar;
