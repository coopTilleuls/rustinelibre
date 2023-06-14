import Link from 'next/link';
import {useAccount} from '@contexts/AuthContext';
import {apiImageUrl} from '@helpers/apiImagesHelper';
import {Box, CardMedia, Typography} from '@mui/material';

const FavoriteRepairers = () => {
  const {user} = useAccount({});

  return (
    <Box px={{xs: 2, md: 0}}>
      <Typography
        fontSize={22}
        fontWeight={600}
        pb={1}
        textAlign={{xs: 'center', md: 'start'}}>
        Mes réparateurs
      </Typography>
      <Box
        display="flex"
        gap={4}
        flexDirection={{xs: 'column', md: 'row'}}
        justifyContent="space-between"
        alignItems={{sm: 'center', md: 'none'}}
        width="100%">
        {user?.lastRepairers.map(
          ({id, name, streetNumber, street, postcode, city, thumbnail}) => {
            return (
              <Box
                key={id}
                borderRadius={4}
                p={2}
                width={{sm: '50%', md: '30%'}}
                sx={{
                  backgroundColor: 'grey.200',
                  '&:hover': {
                    boxShadow: 2,
                  },
                }}>
                <Link
                  href={`/reparateur/${id}`}
                  style={{textDecoration: 'none'}}>
                  <Box display="flex" width="100%">
                    <CardMedia
                      width="30%"
                      component="img"
                      sx={{
                        width: {xs: 50, md: 100},
                        height: {xs: 50, md: 100},
                        mr: 2,
                        borderRadius: '50%',
                        objectFit: 'cover',
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
              </Box>
            );
          }
        )}
      </Box>
    </Box>
  );
};

export default FavoriteRepairers;
