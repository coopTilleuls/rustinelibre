import React, {ChangeEvent, useContext, useEffect, useState} from 'react';
import {
    Typography,
    Stack,
} from '@mui/material';
import TextField from "@mui/material/TextField";

interface AppointmentCreateAddCommentProps {
    comment: string;
    setComment: React.Dispatch<React.SetStateAction<string>>;
}

export const AppointmentCreateAddComment = ({comment, setComment}: AppointmentCreateAddCommentProps): JSX.Element => {
    const [loading, setLoading] = useState<boolean>(false);

    const handleChangeComment = (event: ChangeEvent<HTMLInputElement>): void => {
        setComment(event.target.value as string);
    };

    return (
        <Stack
            spacing={4}
            display="flex"
            flexDirection="column"
            alignItems="center">
            <Typography component="h2" fontSize={14} fontWeight={600} my={{xs: 2}}>
                Détail de la demande
            </Typography>
            <TextField
                margin="normal"
                fullWidth
                id="comment"
                multiline
                rows={4}
                label="Détail de la demande"
                name="comment"
                autoFocus
                value={comment}
                inputProps={{ maxLength: 2000 }}
                onChange={handleChangeComment}
            />
        </Stack>
    );
};

export default AppointmentCreateAddComment;
