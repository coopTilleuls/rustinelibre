import {Box, CardMedia, Typography} from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';
import {User} from '@interfaces/User';
import {useRouter} from 'next/router';
import {RepairerCard} from '@components/repairers/RepairerCard';
import LetterR from '@components/common/LetterR';

interface FavoriteRepairersProps {
  user: User;
}

const FavoriteRepairers = ({user}: FavoriteRepairersProps) => {
  const router = useRouter();

  return (
    <Box px={{xs: 2, md: 0}} py={8} my={2} position="relative" width="100%">
      <Box
        width="100vw"
        left="50%"
        top="0"
        height="100%"
        position="absolute"
        bgcolor="lightsecondary.light"
        zIndex="-1"
        sx={{transform: 'translateX(-50%)'}}
      />
      <Box
        position="absolute"
        top={0}
        right="10px"
        width="100px"
        sx={{
          transform: 'translateY(-40%) translateX(-50%)',
        }}>
        <LetterR color="primary" />
      </Box>
      {user.lastRepairers && user.lastRepairers.length > 0 && (
        <Box>
          <Typography
            variant="h2"
            color="secondary"
            mb={3}
            textAlign={{xs: 'center', md: 'start'}}>
            Mes réparateurs
          </Typography>
          <Grid2 container spacing={4} justifyContent="flex-start">
            {user.lastRepairers.map((repairer) => {
              return (
                <Grid2
                  id={repairer.id}
                  key={repairer.id}
                  xs={12}
                  md={6}
                  width="100%">
                  <RepairerCard
                    repairer={repairer}
                    onClick={() =>
                      router.push({
                        pathname: `/reparateur/${repairer.id}`,
                        query: {favoris: 1},
                      })
                    }
                  />
                </Grid2>
              );
            })}
          </Grid2>
        </Box>
      )}
    </Box>
  );
};

export default FavoriteRepairers;
