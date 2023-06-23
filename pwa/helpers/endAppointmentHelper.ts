export const getEndAppointment = (givenDate: string, duration: number): string => {
    const date = new Date(givenDate);
    const updatedDate = new Date(date.getTime() + duration * 60 * 1000);
    return updatedDate.toISOString();
};