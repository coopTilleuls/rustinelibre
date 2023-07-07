import {Box, CardMedia, Typography} from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';
import {User} from '@interfaces/User';
import {useRouter} from 'next/router';

interface FavoriteRepairersProps {
  user: User;
}

const FavoriteRepairers = ({user}: FavoriteRepairersProps) => {
  const router = useRouter();

  return (
    <Box px={{xs: 2, md: 0}} width="100%">
      {user.lastRepairers && user.lastRepairers.length > 0 && (
        <Box>
          <Typography
            fontSize={22}
            fontWeight={600}
            pb={1}
            textAlign={{xs: 'center', md: 'start'}}>
            Mes réparateurs
          </Typography>
          <Grid2 container spacing={3}>
            {user.lastRepairers.map(
              ({id, name, streetNumber, street, postcode, city, thumbnail}) => {
                return (
                  <Grid2 xs={12} sm={6} lg={4} key={id}>
                    <Box
                      onClick={() =>
                        router.push({
                          pathname: `/reparateur/${id}`,
                          query: {favorite: 1},
                        })
                      }
                      display="flex"
                      p={2}
                      sx={{
                        cursor: 'pointer',
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
                            ? thumbnail.contentUrl
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
                  </Grid2>
                );
              }
            )}
          </Grid2>
        </Box>
      )}
    </Box>
  );
};

export default FavoriteRepairers;
