import Link from 'next/link';
import {useAccount} from '@contexts/AuthContext';
import {apiImageUrl} from '@helpers/apiImagesHelper';
import {Box, CardMedia, Typography} from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';

const FavoriteRepairers = () => {
  const {user} = useAccount({});

  return (
    <Box px={{xs: 2, md: 0}} width="100%">
      <Typography
        fontSize={22}
        fontWeight={600}
        pb={1}
        textAlign={{xs: 'center', md: 'start'}}>
        Mes réparateurs
      </Typography>
      <Grid2 container spacing={3}>
        {user?.lastRepairers.map(
          ({id, name, streetNumber, street, postcode, city, thumbnail}) => {
            return (
              <Grid2 xs={12} sm={6} lg={4} key={id}>
                <Link
                  href={`/reparateur/${id}`}
                  style={{textDecoration: 'none'}}>
                  <Box
                    display="flex"
                    p={2}
                    sx={{
                      backgroundColor: 'grey.200',
                      '&:hover': {
                        boxShadow: 2,
                      },
                      borderRadius: 2,
                    }}>
                    <CardMedia
                      width="30%"
                      component="img"
                      sx={{
                        width: {xs: 50, md: 100},
                        height: {xs: 50, md: 100},
                        mr: 2,
                        borderRadius: '50%',
                        objectFit: 'cover',
                        boxShadow: 4,
                      }}
                      image={
                        thumbnail
                          ? apiImageUrl(thumbnail.contentUrl)
                          : 'https://cdn.cleanrider.com/uploads/2021/04/prime-reparation-velo_140920-3.jpg'
                      }
                      alt="Photo du réparateur"
                    />
                    <Box width="70%">
                      <Typography color="black" fontWeight={600}>
                        {name}
                      </Typography>
                      <Typography
                        color="text.secondary"
                        fontSize={{xs: 14, md: 16}}>
                        {streetNumber} {street}
                      </Typography>
                      <Typography
                        color="text.secondary"
                        textTransform="capitalize"
                        fontSize={{xs: 14, md: 16}}>
                        {postcode} - {city}
                      </Typography>
                    </Box>
                  </Box>
                </Link>
              </Grid2>
            );
          }
        )}
      </Grid2>
    </Box>
  );
};

export default FavoriteRepairers;