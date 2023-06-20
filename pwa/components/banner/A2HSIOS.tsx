import React, {PropsWithChildren, useEffect, useState} from 'react';
import {DAYS_TO_ADD_FOR_NEW_PROPOSAL} from '@constants/A2HS';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import {Box, Button, Typography} from '@mui/material';

interface CloseBtnProps extends PropsWithChildren {
  onClose: () => void;
}

interface IosNavigator extends Navigator {
  standalone: boolean;
}

const CloseBtn = ({onClose}: CloseBtnProps): JSX.Element => {
  return (
    <Button onClick={onClose} variant="contained">
      <CloseRoundedIcon />
    </Button>
  );
};

const BannerText = (): JSX.Element => {
  return (
    <Box width="100%">
      <Typography>
        Pour installer la Web App, appuyez sur
        <img
          width="32"
          height="32"
          src="/img/icon-iOS-share@2x.png"
          alt="icône safari iOS bouton de partage"
        />
        et sélectionnez
      </Typography>
      <Typography>
        Sur l&apos;écran d&apos;accueil
        <img
          width="32"
          height="32"
          src="/img/icon-iOS-a2hs@2x.png"
          alt="icône safari iOS bouton ajout sur l'écran d'accueil"
        />
      </Typography>
    </Box>
  );
};

/**
 * Adds an "Add To Home Screen" banner, for safari on ios.
 */
export const A2HSIOS = (): JSX.Element => {
  const [display, setDisplay] = useState(false);

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
      'pwa_banner_future_date_proposal',
      new Date(
        date.setDate(
          date.getDate()
          // + DAYS_TO_ADD_FOR_NEW_PROPOSAL
        )
      ).toISOString()
    );

    setDisplay(false);
  };

  useEffect(() => {
    const futureDateProposal = localStorage.getItem(
      'pwa_banner_future_date_proposal'
    );

    if (futureDateProposal && new Date() <= new Date(futureDateProposal)) {
      return;
    }

    handleInstallationBanner();
  }, []);

  return (
    <>
      {display && (
        <div className="fixed bottom-4 z-[2147483646] flex inset-x-0 mx-auto py-4 px-3 bg-white shadow-md | after:absolute after:-z-[214748363456] after:-bottom-1 after:inset-x-0 after:mx-auto after:-z-1 after:h-10 after:w-10 after:rotate-45 after:bg-white">
          <div className="flex flex-1">
            <div className="flex-1">
              <BannerText />
            </div>
          </div>
          <CloseBtn onClose={handleClose} />
        </div>
      )}
    </>
  );
};
