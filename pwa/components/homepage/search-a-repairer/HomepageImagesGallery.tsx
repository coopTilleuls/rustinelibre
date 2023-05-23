import React from 'react';
import Image from 'next/image';
import {Box} from '@mui/material';
import bikeRepairer from '@public/img/bike-repairer.jpg';
import bikeMan from '@public/img/bike-man.jpg';
import bikeWoman from '@public/img/bike-woman.jpg';

const HomepageImagesGallery = () => {
  return (
    <Box display={{xs: 'none', md: 'flex'}} width="40%">
      <Box width="50%" height="100%">
        <Box width="100%" height="45%" pb={0.5}>
          <Image
            style={{
              objectFit: 'cover',
              borderRadius: 20,
              width: '100%',
              height: '100%',
            }}
            src={bikeRepairer}
            alt=""
          />
        </Box>
        <Box width="100%" height="55%">
          <Image
            style={{
              objectFit: 'cover',
              borderRadius: 20,
              width: '100%',
              height: '100%',
            }}
            src={bikeMan}
            alt=""
          />
        </Box>
      </Box>
      <Box width="50%" height="100%" pl={0.5} display="flex" alignItems="end">
        <Box width="100%" height="90%">
          <Image
            style={{
              objectFit: 'cover',
              borderRadius: 20,
              width: '100%',
              height: '100%',
            }}
            src={bikeWoman}
            alt=""
          />
        </Box>
      </Box>
    </Box>
  );
};

export default HomepageImagesGallery;
