import React, {ChangeEvent, Dispatch, SetStateAction, useEffect, useState} from "react";
import Typography from '@mui/material/Typography';
import Button from "@mui/material/Button";
import {apiImageUrl} from "@helpers/apiImagesHelper";
import {Bike} from "@interfaces/Bike";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
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
        <Card sx={{ maxWidth: 345, cursor: 'pointer' }} onClick={handleClickCard}>
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
