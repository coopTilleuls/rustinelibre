import React from 'react';
import {Typography, Box, Link} from '@mui/material';
import NextLink from 'next/link';

const ProcessingOfYourData = (): JSX.Element => {
  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <Typography variant="h3" color="primary">
        2 - Les traitements réalisés sur vos données
      </Typography>
      <Box display="flex" flexDirection="column" gap={1}>
        <Typography variant="h5" color="secondary">
          2.1 - Les catégories de données collectées et traitements réalisés
        </Typography>
        <Typography>
          La présente section 2.1 détaille les données susceptibles d’être
          collectées en fonction de la catégorie à laquelle vous appartenez. Ces
          données sont stockées sur un serveur hébergé chez GCP, dans un centre
          de données (data center) situé en Belgique.
        </Typography>
        <Typography>
          Sauf exception, les données ne sont chiffrées que lorsqu’elles sont en
          transit mais pas lors du stockage.
        </Typography>
      </Box>
      <Box display="flex" paddingLeft="10px" flexDirection="column" gap={1}>
        <Typography variant="h5" color="secondary">
          2.1.1 - Si vous êtes simple internaute
        </Typography>
        <Typography>
          Nous ne collectons que votre adresse IP, à des fins de sécurisation de
          nos infrastructures et d’analyse statistique. Nous avons configuré
          Matomo (https://fr.matomo.org/), notre analyseur d’audience afin que
          les adresses soient anonymisées dès leur collecte.
        </Typography>
      </Box>
      <Box display="flex" paddingLeft="10px" flexDirection="column" gap={1}>
        <Typography variant="h5" color="secondary">
          2.1.2 - Si vous êtes Cycliste
        </Typography>
        <Typography>
          Nous collectons, traitons et conservons les données relatives aux
          Cyclistes dans le cadre de la création d’un compte utilisateur sur la
          plateforme : il vous sera demandé votre nom, prénom et une adresse
          e-mail. Les Réparateurs n’ont accès qu’à votre nom. Dans le cas d’un
          rdv avec un réparateur itinérant, une adresse vous sera demandée et
          transmise au réparateur pour effectuer la réparation.
        </Typography>
        <Typography>
          La création d’un carnet d’entretien de votre vélo est optionnelle. Les
          données que vous compléteriez dans celui-ci seront accessible aux
          Réparateurs avec lesquels vous prendrez un rendez-vous.
        </Typography>
      </Box>
      <Box display="flex" paddingLeft="10px" flexDirection="column" gap={1}>
        <Typography variant="h5" color="secondary">
          2.1.3 - Si vous êtes Réparateur
        </Typography>
        <Typography>
          Nous collectons le nom et le prénom d’un contact référent de votre
          structure de réparation, ainsi que sa raison sociale et l’adresse du
          siège social, une adresse email de contact ainsi qu’un numéro de
          téléphone de contact. Ces informations seront détenue par
          l’Administration de la Plateforme. Les Cyclistes auront accès au nom
          de la structure, à son adresse et à un numéro de téléphone de contact.
          Chaque Réparateur est libre de donner d’autres informations visibles
          par le cycliste dans sa Boutique.
        </Typography>
        <Typography>
          L’adresse email du Réparateur peut être utilisée pour envoi de
          notifications liées à l’état du service et aux éventuelles évolutions
          de son périmètre (par exemple, si le serveur a un problème et que la
          plateforme est inaccessible, ou alors si une nouvelle fonctionnalité
          est disponible, pouvant avoir un impact sur le fonctionnement ou la
          conformité réglementaire du Réparateur). Selon la nature de
          l’événement, ces notifications pourront être envoyées à tous les
          Réparateurs
        </Typography>
      </Box>
      <Box display="flex" flexDirection="column" gap={1}>
        <Typography variant="h5" color="secondary">
          2.2 - Les finalités des traitements réalisés
        </Typography>
        <Typography>
          Les adresses IP ne sont collectées qu’à des fins de sécurisation de
          nos infrastructures et d’analyse statistique. Elles sont anonymisées
          dès la collecte.
        </Typography>
        <Typography>
          Pour les Cyclistes, une adresse de réparation est nécessaire pour les
          rendez-vous avec un Réparateurs itinérants.
        </Typography>
        <Typography>
          Pour les Réparateurs, les nom, prénom, adresse email et numéro de
          téléphone de contact sont nécessaires pour que l’Administration puisse
          les contacter, leur faire signer la charte, leur fournir un exemplaire
          des CGU et les convier à des temps de réunion du Collectif.e
        </Typography>
        <Typography>
          Pour les Inscrits à la newsletter, nous conservons votre adresse email
          afin de pouvoir vous envoyer la newsletter. La collecte de votre
          adresse email est strictement nécessaire à l’exécution du service.
        </Typography>
        <Typography>
          Aucune opération de profilage n’est opérée par Rustine Libre et aucune
          décision automatisée n’est prise sur la base des données personnelles
          vous concernant.
        </Typography>
      </Box>
      <Box display="flex" flexDirection="column" gap={1}>
        <Typography variant="h5" color="secondary">
          2.3 - La base légale des traitements (licéité des traitements)
        </Typography>
        <Typography>
          La collecte de vos adresses IP, immédiatement anonymisées, est fondé
          sur notre intérêt légitime à sécuriser nos infrastructures et à
          connaître l’audience de notre plateforme 1) de l’article 6 du RGPD).
          Les autres données demandées ne servent qu’à la création des comptes
          utilisateurs : nom, prénom, adresse mail. Les professionnels présents
          sur la plateforme doivent fournir leurs coordonnées pour permettre
          leur bon référencement sur la plateforme.
        </Typography>
      </Box>
      <Box display="flex" flexDirection="column" gap={1}>
        <Typography variant="h5" color="secondary">
          2.4 - Les durées de conservation des données collectées
        </Typography>
        <Typography>
          Vos adresses IP sont immédiatement anonymisées. Si vous êtes un
          Cycliste, vos données à caractère personnel sont supprimées à la
          suppression de votre compte Si vous êtes un Réparateur, vos données à
          caractère personnel sont supprimées à la suppression de votre compte.
        </Typography>
      </Box>
      <Box display="flex" flexDirection="column" gap={1}>
        <Typography variant="h5" color="secondary">
          2.5 - Les personnes ayant accès aux données
        </Typography>
        <Typography>
          Les administrateurs du logiciel Rustine Libre sont susceptibles
          d’avoir accès à ces données. Un contrôle des accès est assurée. Nous
          pourrions également être contraints de transmettre certaines de ces
          données sur réquisition judiciaire. Enfin, nous pourrions également
          être contraints de transmettre certaines de ces données à un avocat ou
          un huissier de justice, dans la mesure strictement nécessaire à
          assurer la défense de nos intérêts dans le cadre d’une instance
          juridictionnelle.
        </Typography>
      </Box>
      <Box display="flex" flexDirection="column" gap={1}>
        <Typography variant="h5" color="secondary">
          2.6 - Les moyens mis en œuvre afin de protéger vos données
        </Typography>
        <Typography>
          Vos données sont conservées sur un serveur qui appartient à
          l’entreprise GCP. Vous pouvez consulter les sécurités mises en place
          par GCP ici : <br />
          <NextLink
            href="https://cloud.google.com/trust-center/security?hl=fr"
            legacyBehavior
            passHref>
            <Link sx={{fontWeight: 800}} underline="none">
              https://cloud.google.com/trust-center/security?hl=fr
            </Link>
          </NextLink>
        </Typography>
        <Typography>
          Les communications réalisées avec le logiciel Rustine Libre utilisé
          pour la délivrance du service sont chiffrées via le protocole HTTPS.
          Vos mots de passe sont chiffrés.
        </Typography>
      </Box>
    </Box>
  );
};

export default ProcessingOfYourData;
