import {PropsWithChildren} from 'react';
import {Button} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

interface CloseBtnProps extends PropsWithChildren {
  onClose: () => void;
}

const CloseBtn = ({onClose}: CloseBtnProps): JSX.Element => {
  return (
    <Button onClick={onClose}>
      <CloseRoundedIcon />
    </Button>
  );
};

export default CloseBtn;
