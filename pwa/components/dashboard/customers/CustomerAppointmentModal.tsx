import React from 'react';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import {Appointment} from "@interfaces/Appointment";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import List from "@mui/material/List";
import {formatDate} from "@helpers/dateHelper";
import {apiImageUrl} from "@helpers/apiImagesHelper";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import BuildIcon from '@mui/icons-material/Build';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import {Customer} from "@interfaces/Customer";

type ModalAddBikeProps = {
    appointment: Appointment|null;
    customer: Customer;
    openModal: boolean;
    handleCloseModal: () => void;
};

const CustomerAppointmentModal = ({
                          appointment,
                          customer,
                          openModal,
                          handleCloseModal,
                      }: ModalAddBikeProps): JSX.Element => {


    return (
        <Modal
            open={openModal}
            onClose={handleCloseModal}
            aria-labelledby="Ajouter un vélo"
            aria-describedby="popup_add_bike">
            <Box
                position={'absolute'}
                top={'50%'}
                left={'50%'}
                width={{xs: '85%', md: '40%'}}
                maxWidth={700}
                p={4}
                boxShadow={24}
                sx={{
                    backgroundColor: 'background.paper',
                    transform: 'translate(-50%, -50%)',
                }}>
                {appointment &&
                    <Typography id="modal-modal-title" fontSize={20} fontWeight={600}>
                        Rendez vous : {`${customer.firstName} ${customer.lastName}`}
                    </Typography>
                }
                {
                    appointment &&
                    <List>
                        <ListItem>
                            <ListItemIcon>
                                <CalendarMonthIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary={formatDate(appointment.slotTime)}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <AlternateEmailIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary={customer.email}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <CheckCircleOutlineIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary={appointment.accepted === undefined
                                    ? 'En attente'
                                    : appointment.accepted
                                        ? 'Rendez vous accepté'
                                        : 'Rendez vous refusé'
                                }
                            />
                        </ListItem>
                        {appointment.autoDiagnostic &&
                            <ListItem>
                                <ListItemIcon>
                                    <BuildIcon />
                                </ListItemIcon>
                                <ListItemText
                                    primary={appointment.autoDiagnostic.prestation}
                                />
                            </ListItem>
                        }
                        {appointment.autoDiagnostic && appointment.autoDiagnostic.photo &&
                            <img style={{marginTop: '20px', textAlign:'center'}} width="300" src={apiImageUrl(appointment.autoDiagnostic.photo.contentUrl)} alt="Photo autodiag" />
                        }
                    </List>
                }
            </Box>
        </Modal>
    );
};

export default CustomerAppointmentModal;
