import React, {useEffect, useState} from 'react';
import {DAYS_TO_ADD_FOR_NEW_PROPOSAL} from '@constants/A2HS';
import theme from 'styles/theme';
import LetterR from '@components/common/LetterR';
import {Box, IconButton, Typography, useMediaQuery} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import IosShareIcon from '@mui/icons-material/IosShare';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';

interface IosNavigator extends Navigator {
  standalone: boolean;
}

/**
 * Adds an "Add To Home Screen" banner, for safari on ios.
 */
export const A2HSIOS = (): JSX.Element => {
  const [display, setDisplay] = useState(false);

  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleInstallationBanner = () => {
    const isMobile = window.matchMedia(
      'only screen and (max-width: 480px)'
    ).matches;
    const isIos = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      return /iphone/.test(userAgent);
    };
    const isInStandaloneMode =
      'standalone' in window.navigator &&
      (window.navigator as IosNavigator).standalone;
    if (isMobile && isIos() && !isInStandaloneMode) {
      setTimeout(setDisplay, 7000, true);
    }
  };

  const handleClose = (): void => {
    const date = new Date();
    localStorage.setItem(
      'rustine_libre_pwa_banner_future_proposal',
      new Date(
        date.setDate(date.getDate() + DAYS_TO_ADD_FOR_NEW_PROPOSAL)
      ).toISOString()
    );
    setDisplay(false);
  };

  useEffect(() => {
    const futureDateProposal = localStorage.getItem(
      'rustine_libre_pwa_banner_future_proposal'
    );
    if (futureDateProposal && new Date() <= new Date(futureDateProposal)) {
      return;
    }
    handleInstallationBanner();
  }, []);

  return (
    <>
      {display && isMobile && (
        <Box
          px={2}
          py={1}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          width="100%"
          zIndex="tooltip"
          position="fixed"
          boxShadow={4}
          sx={{backgroundColor: 'white'}}>
          <Box width="50px">
            <LetterR color="secondary" />
          </Box>
          <Box display="flex" flexDirection="column" px={1} gap={1}>
            <Typography color="secondary" fontSize={12}>
              Pour installer la WebApp:
            </Typography>
            <Box display="flex" alignItems="center">
              <Typography color="secondary" fontSize={12}>
                Cliquez sur
              </Typography>
              <IosShareIcon sx={{mx: 1}} color="secondary" />
            </Box>
            <Box display="flex" alignItems="center">
              <Typography color="secondary" fontSize={12}>
                Puis sur
              </Typography>
              <AddBoxOutlinedIcon sx={{mx: 1}} color="secondary" />
            </Box>
          </Box>
          <IconButton
            aria-label="close"
            color="secondary"
            onClick={handleClose}>
            <CloseIcon fontSize="medium" />
          </IconButton>
        </Box>
      )}
    </>
  );
};
