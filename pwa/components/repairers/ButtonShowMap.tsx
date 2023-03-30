import React from "react";
import Button from '@mui/material/Button';

interface ButtonShowMapProps {
    showMap: boolean;
    setShowMap: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ButtonShowMap = ({showMap, setShowMap}: ButtonShowMapProps): JSX.Element => {
    return (
        <>
            <div className="ml-4">
                <Button
                    onClick={() => setShowMap(!showMap)}
                    variant="outlined"
                >
                    {showMap ? 'Voir les résultats' : 'Voir sur la carte'}
                </Button>
            </div>
        </>
    );
};

export default ButtonShowMap;
