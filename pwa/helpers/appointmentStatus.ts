export const getAppointmentStatus = (status: string): string => {
    switch (status) {
        case 'pending_repairer':
            return 'En attente';
        case 'validated':
            return 'Validé';
        case 'refused':
            return 'Refusé';
        case 'cancel':
            return 'Annulé';
        default:
            return 'En attente';
    }
};
