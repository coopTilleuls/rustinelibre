import React from 'react';
import {Typography, Box, ListItem} from '@mui/material';
import {
  contentUploadedOnPlatform,
  declineResponsibility,
  forceMajeure,
  platformResponsibilities,
} from '@data/cgu/platform-responsibilities';

const PlatformResponsibilities = (): JSX.Element => {
  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <Typography variant="h3" color="primary">
        9 - Responsabilités de la Plateforme
      </Typography>
      <Box display="flex" flexDirection="column" gap={1}>
        {platformResponsibilities.map(({id, content}) => {
          return <Typography key={id}>{content}</Typography>;
        })}
      </Box>
      <Box display="flex" flexDirection="column" gap={2}>
        <Typography variant="h5" color="secondary">
          9.1 - Accès à la Plateforme
        </Typography>
        <Typography>
          La Plateforme est en principe accessible 24 heures sur 24 et 7 jours
          sur 7, cependant, la plateforme décline toute responsabilité, dans les
          cas suivants, sans que cette liste soit limitative :
        </Typography>
        <Box>
          {declineResponsibility.map(({id, content}) => {
            return (
              <ListItem key={id} sx={{display: 'list-item', py: 0}}>
                {content}
              </ListItem>
            );
          })}
        </Box>
      </Box>
      <Box display="flex" flexDirection="column" gap={2}>
        <Typography variant="h5" color="secondary">
          9.2 - Contenus mis en ligne sur la Plateforme
        </Typography>
        <Box display="flex" flexDirection="column" gap={1}>
          {contentUploadedOnPlatform.map(({id, content}) => {
            return <Typography key={id}>{content}</Typography>;
          })}
        </Box>
      </Box>
      <Box display="flex" flexDirection="column" gap={2}>
        <Typography variant="h5" color="secondary">
          9.3 - Force majeure
        </Typography>
        <Box display="flex" flexDirection="column" gap={1}>
          {forceMajeure.map(({id, content}) => {
            return <Typography key={id}>{content}</Typography>;
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default PlatformResponsibilities;
