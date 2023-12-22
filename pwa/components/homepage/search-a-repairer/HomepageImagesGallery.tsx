import React from 'react';
import Image from 'next/image';
import {Box} from '@mui/material';
import repairers from '@public/img/repairers.jpg';
import autoRepairers from '@public/img/auto-repairers.jpg';
import repairerSalute from '@public/img/repairer-salute.jpg';

const HomepageImagesGallery = () => {
  return (
    <Box display={{xs: 'none', md: 'flex'}} width="90%">
      <Box width="65%" height="100%">
        <Box width="100%" height="45%" pb={0.5}>
          <Image
            style={{
              objectFit: 'cover',
              borderRadius: 20,
              width: '100%',
              height: '100%',
            }}
            src={repairers}
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
            src={autoRepairers}
            alt=""
          />
        </Box>
      </Box>
      <Box width="60%" height="100%" pl={0.5} display="flex" alignItems="end">
        <Box width="100%" height="90%">
          <Image
            style={{
              objectFit: 'cover',
              borderRadius: 20,
              width: '100%',
              height: '100%',
            }}
            src={repairerSalute}
            alt=""
          />
        </Box>
      </Box>
    </Box>
  );
};

export default HomepageImagesGallery;
