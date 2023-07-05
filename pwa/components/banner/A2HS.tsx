import React, {useEffect, useState} from 'react';
import {DAYS_TO_ADD_FOR_NEW_PROPOSAL} from '@constants/A2HS';
import {Box, Button, Typography} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import GetAppIcon from '@mui/icons-material/GetApp';

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
      {display && (
        <Box
          display="flex"
          zIndex="tooltip"
          width="100%"
          position="fixed"
          sx={{backgroundColor: 'white'}}
          boxShadow={1}
          gap={1}>
          <Box
            width="100%"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center">
            <Box
              width="100%"
              p={1}
              display="flex"
              alignItems="center"
              justifyContent="space-between">
              <Typography
                fontSize={14}
                fontWeight={600}
                color="primary"
                sx={{pl: 2}}>
                Rustine Libre - WebApp
              </Typography>
              <Button onClick={handleClose}>
                <CloseRoundedIcon color="primary" />
              </Button>
            </Box>
            <Box
              display="flex"
              justifyContent="center"
              textAlign="center"
              width="100%"
              p={2}
              gap={2}
              sx={{
                backgroundColor: 'primary.light',
                cursor: 'pointer',
              }}
              onClick={promptUserInstallation}>
              <Typography fontSize={14} fontWeight={600}>
                Ajouter à l&apos;écran d&apos;accueil
              </Typography>
              <GetAppIcon />
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};
