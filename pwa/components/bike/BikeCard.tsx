import React, {Dispatch, SetStateAction} from "react";
import Typography from '@mui/material/Typography';
import {apiImageUrl} from "@helpers/apiImagesHelper";
import {Bike} from "@interfaces/Bike";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";

type BikeCardProps = {
    bike: Bike;
    setSelectedBike: Dispatch<SetStateAction<Bike|null>>;
};

const BikeCard = ({bike, setSelectedBike}: BikeCardProps): JSX.Element => {

    const handleClickCard = () => {
        setSelectedBike(bike);
    };

    return (
        <Card sx={{ width: 300, maxWidth: 600, cursor: 'pointer', mt: 2 }} onClick={handleClickCard}>
            {bike.picture ? <CardMedia
                component="img"
                alt="bike_picture"
                height="140"
                image={apiImageUrl(bike.picture?.contentUrl)}
            /> : <DirectionsBikeIcon />}
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {bike.name}
                </Typography>
            </CardContent>
        </Card>
    )
}

export default BikeCard;
