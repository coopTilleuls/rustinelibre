import React from 'react';
import {Typography, Box} from '@mui/material';

const PrinciplesGoverningTheTreatmentsPerformed = (): JSX.Element => {
  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <Typography variant="h3" color="primary">
        1 - Les principes gouvernant les traitements réalisés
      </Typography>
      <Box display="flex" flexDirection="column" gap={1}>
        <Typography>
          Rustine Libre s’attache à traiter vos données à caractère personnel de
          manière licite, loyale et transparente.
        </Typography>
        <Typography>
          Vos données à caractère personnel ne sont collectées que pour des
          finalités déterminées, explicites et légitimes et ne seront pas
          traitées ultérieurement d’une manière incompatible avec ces finalités.
        </Typography>
        <Typography>
          Seules les données adéquates, pertinentes et limitées à ce qui est
          nécessaire au regard des finalités pour lesquelles elles sont
          traitées, sont collectées.
        </Typography>
        <Typography>
          Elles sont traitées de façon à garantir une sécurité appropriée des
          données à caractère personnel, y compris la protection contre le
          traitement non autorisé ou illicite et contre la perte, la destruction
          ou les dégâts d’origine accidentelle, à l’aide de mesures techniques
          ou organisationnelles appropriées. Une telle protection de vos données
          est offerte dès la conception et par défaut.
        </Typography>
      </Box>
    </Box>
  );
};

export default PrinciplesGoverningTheTreatmentsPerformed;
