import React, {PropsWithChildren, useEffect, useState} from 'react';
import {Button} from '@mui/material';
import {DAYS_TO_ADD_FOR_NEW_PROPOSAL} from '@constants/A2HS';

interface CloseBtnProps extends PropsWithChildren {
  onClose: () => void;
}

const CloseBtn = ({onClose}: CloseBtnProps): JSX.Element => {
  return (
    <button
      onClick={onClose}
      className="flex-none inline-block w-6 h-6 mr-3 | sm:w-8 sm-h-8 sm:mr-5">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6 | sm:w-8 sm:h-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  );
};

const Title = (): JSX.Element => {
  return (
    <div>
      <p className="font-medium text-sm | sm:text-base">Mon espace - FFS</p>
      <p className="text-xxs | sm:text-xs">Web App</p>
    </div>
  );
};

interface A2HSBtnProps extends PropsWithChildren {
  onPromptUserInstallation: () => void;
}

const A2HSBtn = ({onPromptUserInstallation}: A2HSBtnProps): JSX.Element => {
  return (
    <Button onClick={onPromptUserInstallation}>
      Ajouter à l&apos;écran d&apos;accueil
    </Button>
  );
};

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
      'pwa_banner_future_date_proposal',
      new Date(
        date.setDate(
          date.getDate()
          //  + DAYS_TO_ADD_FOR_NEW_PROPOSAL
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
        <div className="relative z-10 flex py-3 px-3 border-b-2 bg-white | sm:px-6">
          <CloseBtn onClose={handleClose} />
          <div className="flex flex-1">
            <div className="flex-1">
              <Title />
              <A2HSBtn onPromptUserInstallation={promptUserInstallation} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
