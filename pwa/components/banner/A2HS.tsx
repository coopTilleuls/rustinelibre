import React, {useEffect, useState} from 'react';
import {DAYS_TO_ADD_FOR_NEW_PROPOSAL} from '@constants/A2HS';
import {Box, Button, Typography} from '@mui/material';
import CloseBtn from './CloseButton';

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
          <Box width="100%" py={1} px={2} display="flex">
            <Box width="100%" display="flex" flexDirection="column">
              <Typography fontSize={12}>Rustine Libre</Typography>
              <Typography fontSize={12}>WebApp</Typography>
            </Box>
            <Button onClick={promptUserInstallation}>
              Ajouter à l&apos;écran d&apos;accueil
            </Button>
          </Box>
          <CloseBtn onClose={handleClose} />
        </Box>
      )}
    </>
  );
};
