import {SimplePaletteColorOptions, Theme, useTheme} from '@mui/material';

type ColorKey = keyof Theme['palette'];

const LetterR = ({color}: {color: ColorKey}) => {
  const theme = useTheme();
  const fillColor = (theme.palette[color] as SimplePaletteColorOptions).main;

  return (
    <svg
      id="Composant_10_1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 149.61 149.61">
      <g id="Groupe_270">
        <path
          id="Tracé_49"
          d="m144.22,57.69l-1.92-1.41c-4.01-2.96-5.94-7.98-4.94-12.86l.48-2.34c1.47-7.15-3.13-14.14-10.27-15.61-.4-.08-.8-.15-1.21-.19l-2.37-.27c-4.95-.56-9.13-3.94-10.71-8.67l-.75-2.27c-2.3-6.93-9.77-10.68-16.7-8.39-.19.06-.39.13-.58.21-.19.07-.37.15-.56.23l-2.19.96c-.18.08-.36.15-.54.22-4.46,1.71-9.49.79-13.07-2.37l-1.79-1.58c-5.45-4.85-13.81-4.36-18.66,1.09-.27.31-.53.62-.77.95l-1.41,1.92c-2.96,4.01-7.98,5.94-12.86,4.94l-2.34-.48c-7.14-1.47-14.13,3.12-15.61,10.27-.08.4-.15.81-.19,1.22l-.27,2.37c-.54,4.74-3.67,8.79-8.13,10.51-.18.07-.37.14-.55.19l-2.27.75c-.19.06-.38.13-.57.2-6.81,2.61-10.22,10.26-7.6,17.07.07.19.15.38.23.57l.96,2.19c2,4.57,1.16,9.88-2.15,13.61l-1.58,1.79c-4.85,5.46-4.36,13.82,1.11,18.67.3.27.61.52.94.76l1.92,1.41c4.01,2.96,5.94,7.98,4.94,12.86l-.48,2.33c-1.47,7.15,3.13,14.14,10.28,15.61.4.08.8.15,1.2.19l2.37.27c4.95.56,9.13,3.94,10.71,8.67l.75,2.27c2.3,6.93,9.77,10.68,16.7,8.39.2-.06.39-.13.58-.21.19-.07.37-.15.56-.23l2.19-.96c.18-.08.36-.15.54-.22,4.46-1.7,9.5-.79,13.07,2.37l1.79,1.59c5.46,4.85,13.81,4.36,18.66-1.1.27-.3.52-.62.76-.94l1.41-1.92c2.96-4.01,7.98-5.94,12.86-4.94l2.34.48c7.15,1.48,14.14-3.12,15.62-10.27.08-.4.15-.8.19-1.21l.27-2.37c.54-4.74,3.67-8.79,8.12-10.51.18-.07.36-.13.55-.19l2.27-.75c.19-.06.38-.13.57-.2,6.81-2.62,10.22-10.26,7.6-17.07-.07-.19-.15-.38-.23-.57l-.96-2.19c-1.99-4.57-1.15-9.88,2.16-13.61l1.59-1.79c4.85-5.45,4.37-13.79-1.08-18.64-.31-.27-.63-.53-.96-.78"
          fill={fillColor}
        />
        <path
          id="Tracé_50"
          d="m106.25,82.14c-2.06-1.04-4.37-2.06-6.78-3.11-1.4-.61-2.83-1.24-4.29-1.91-3.66-1.64-5.6-3.19-6.13-4.89-.47-1.53.11-3.6,1.86-6.46l1.34-2.63c5.55-11.25,2.95-21.06-7.25-27.57-10.61-7.37-21.87-8.97-34.45-4.88-9.14,3.25-12.73,9.14-11.29,18.99,5.26,34.32,7.15,45.64,8.48,49.3l-.23.03c1.36,9.04,3.13,18.15,8.29,21.68,2.06,1.39,4.62,1.83,7.02,1.2,2.38-.45,5-1.2,6.4-3.27,1.85-2.73,1.13-6.48-.31-13.95-.38-1.96-.8-4.19-1.24-6.66-.44-3.11-1.1-7.82-.42-8.58l.46-.42c1.02-.96,1.76-1.67,5.11-.13l37.53,17.12c2.95,1.31,8.16,3.62,12.55,1.93,2.11-.86,3.82-2.47,4.82-4.52l.04-.08c1.31-2.7,1.56-5.06.77-7.21-1.87-5.07-9.15-8.25-22.29-13.98m-32.43-29.48c.93,2.42-5.11,9.41-8.66,10.77-1.13.43-1.61.14-1.78.04-.54-.33-1.86-1.63-2.48-6.72-.38-3.42-.64-7.13,1-7.89,3.36-1.29,11.19,1.88,11.92,3.8"
          fill="#fff"
        />
      </g>
    </svg>
  );
};

export default LetterR;