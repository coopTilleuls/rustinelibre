import React, {useEffect, useState} from 'react';
import theme from 'styles/theme';
import {DAYS_TO_ADD_FOR_NEW_PROPOSAL} from '@constants/A2HS';
import LetterR from '@components/common/LetterR';
import {Box, IconButton, Typography, useMediaQuery} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';

interface UserChoice {
  outcome: 'accepted' | 'dismissed';
  platform: string;
}

interface BeforeInstallPromptEvent extends Event {
  userChoice: Promise<UserChoice>;
  prompt(): Promise<void>;
}

/**
 * Adds an "Add To Home Screen" banner, for android and browsers that support beforeinstallprompt event.
 * See: https://developer.mozilla.org/en-US/docs/Web/API/BeforeInstallPromptEvent
 */
export const A2HS = (): JSX.Element => {
  const [display, setDisplay] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<
    BeforeInstallPromptEvent | undefined
  >();

  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleInstallationBanner = (e: Event): void => {
    e.preventDefault();
    setDeferredPrompt(e as BeforeInstallPromptEvent);
    setDisplay(true);
  };

  const promptUserInstallation = (): void => {
    setDisplay(false);
    deferredPrompt!.prompt();
    deferredPrompt!.userChoice.then(() => {
      setDeferredPrompt(undefined);
    });
  };

  const handleClose = (event: React.MouseEvent): void => {
    event.stopPropagation();
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
    window.addEventListener('beforeinstallprompt', handleInstallationBanner);
    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleInstallationBanner
      );
    };
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
          sx={{backgroundColor: 'white'}}
          onClick={promptUserInstallation}>
          <Box width="50px">
            <LetterR color="secondary" />
          </Box>
          <Box display="flex" flexDirection="column">
            <Typography color="secondary">Installer la WebApp</Typography>
            <IconButton aria-label="download" color="secondary">
              <DownloadIcon fontSize="medium" />
            </IconButton>
          </Box>
          <IconButton
            aria-label="close"
            color="secondary"
            onClick={(event) => handleClose(event)}>
            <CloseIcon fontSize="medium" />
          </IconButton>
        </Box>
      )}
    </>
  );
};
