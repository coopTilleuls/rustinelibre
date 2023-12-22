import React from 'react';
import {Typography, Box, Link} from '@mui/material';
import NextLink from 'next/link';

const YourRights = (): JSX.Element => {
  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <Typography variant="h3" color="primary">
        3 - Vos droits et leurs modalités d’exercice
      </Typography>
      <Box display="flex" flexDirection="column" gap={1}>
        <Typography variant="h5" color="secondary">
          3.1 - Le contenu de vos droits
        </Typography>
        <Typography>
          Vous bénéficiez des droits suivants liés aux données à caractère
          personnel vous concernant.
        </Typography>
      </Box>
      <Box display="flex" paddingLeft="10px" flexDirection="column" gap={1}>
        <Typography variant="h5" color="secondary">
          Droit d’accès (cf. article 15 du RGPD)
        </Typography>
        <Typography>
          Vous avez le droit d’obtenir la confirmation que des données à
          caractère personnel vous concernant sont ou ne sont pas traitées et,
          lorsqu’elles le sont, l’accès auxdites données à caractère personnel
          ainsi que notamment les informations suivantes :<br />
          a) les finalités du traitement ;<br />
          b) les catégories de données à caractère personnel concernées ;<br />
          c) les destinataires ou catégories de destinataires auxquels les
          données à caractère personnel ont été ou seront communiquées ;<br />
          d) lorsque cela est possible, la durée de conservation des données à
          caractère personnel envisagée ou, lorsque ce n’est pas possible, les
          critères utilisés pour déterminer cette durée ;<br />
          e) l’existence du droit de demander au responsable du traitement la
          rectification ou l’effacement de données à caractère personnel, ou une
          limitation du traitement des données à caractère personnel relatives à
          la personne concernée, ou du droit de s’opposer à ce traitement ; En
          principe la présente Politique de confidentialité devrait répondre à
          toutes vos questions à cet égard.
        </Typography>
      </Box>
      <Box display="flex" paddingLeft="10px" flexDirection="column" gap={1}>
        <Typography variant="h5" color="secondary">
          Droit d’effacement (cf. article 17 du RGPD)
        </Typography>
        <Typography>
          Vous avez le droit d’obtenir l’effacement, dans les meilleurs délais,
          de données à caractère personnel vous concernant, lorsque l’un des
          motifs suivants s’applique : a) les données à caractère personnel ne
          sont plus nécessaires au regard des finalités pour lesquelles elles
          ont été collectées ou traitées d’une autre manière ; b) vous avez
          retiré votre consentement sur lequel est fondé le traitement et il
          n’existe pas d’autre fondement juridique au traitement.
        </Typography>
        <Typography>
          Cette obligation ne s’applique pas dans la mesure où ce traitement est
          nécessaire : <br />
          a) pour respecter une obligation légale qui requiert le traitement
          prévue par le droit de l’Union ou par le droit de l’État membre auquel
          nous sommes soumis ; <br />
          b) à la constatation ou à la défense de droits en justice.
        </Typography>
      </Box>
      <Box display="flex" paddingLeft="10px" flexDirection="column" gap={1}>
        <Typography variant="h5" color="secondary">
          Droit à la limitation (gel temporaire des traitements) (cf. article 18
          du RGPD)
        </Typography>
        <Typography>
          Vous avez le droit d’obtenir la limitation du traitement lorsque l’un
          des éléments suivants s’applique :<br />
          a) vous contestez l’exactitude des données à caractère personnel qui
          vous concerne. Nous limitons alors le traitement pendant la durée nous
          permettant de vérifier l’exactitude de ces données ;<br />
          b) le traitement est illicite et vous vous opposez à l’effacement des
          données et exigez à la place la limitation de leur utilisation ; par
          exemple pour conserver une preuve du traitement illicite.
          <br />
          c) nous n’avons plus besoin des données à caractère personnel aux fins
          du traitement mais celles-ci nous sont encore nécessaires pour la
          constatation, l’exercice ou la défense de droits en justice ;<br />
          d) vous vous êtes opposé au traitement en vertu de l’article 21,
          paragraphe 1, du RGPD pendant la vérification portant sur le point de
          savoir si les motifs légitimes poursuivis par nous prévalent sur ceux
          de la personne concernée.
          <br />
        </Typography>
      </Box>
      <Box display="flex" paddingLeft="10px" flexDirection="column" gap={1}>
        <Typography variant="h5" color="secondary">
          Droit à la portabilité de vos données (cf. article 20 du RGPD).
        </Typography>
        <Typography>
          Vous avez le droit de recevoir les données à caractère personnel vous
          concernant que vous nous avez fournies, dans un format structuré,
          couramment utilisé et lisible par machine, et avez le droit de
          transmettre ces données à un autre responsable du traitement. Vous
          avez le droit d’obtenir que les données à caractère personnel soient
          transmises directement à un autre responsable de traitement.
        </Typography>
      </Box>
      <Box display="flex" paddingLeft="10px" flexDirection="column" gap={1}>
        <Typography variant="h5" color="secondary">
          Droit d’opposition (cf. article 21 du RGPD)
        </Typography>
        <Typography>
          Vous avez le droit de vous opposer à tout moment, pour des raisons
          tenant à votre situation particulière, à un traitement de données à
          caractère personnel vous concernant fondé sur notre intérêt légitime.
          Nous ne traiterons alors plus les données à caractère personnel vous
          concernant, à moins que l’on ne démontre qu’il existe des motifs
          légitimes et impérieux pour le traitement qui prévalent sur vos
          intérêts et vos droits et libertés, ou pour la constatation,
          l’exercice ou la défense de droits en justice.
        </Typography>
      </Box>
      <Box display="flex" flexDirection="column" gap={1}>
        <Typography variant="h5" color="secondary">
          3.2 - Les modalités d’exercice de vos droits
        </Typography>
        <Typography>
          Vous pouvez exercer l’ensemble de vos droits, à tout moment, en
          écrivant à l’adresse suivante :<br />
          <NextLink
            href="mailto:contact@rustinelibre.fr"
            legacyBehavior
            passHref>
            <Link sx={{fontWeight: 800}} underline="none">
              contact@rustinelibre.fr
            </Link>
          </NextLink>
        </Typography>
        <Typography>
          Afin de vous aider dans vos démarches vous pouvez utiliser les
          formulaires mis à disposition par la CNIL :<br />
          <NextLink
            href="https://www.cnil.fr/fr/modele/courrier/exercer-son-droit-dacces"
            legacyBehavior
            passHref>
            <Link sx={{fontWeight: 800}} underline="none">
              https://www.cnil.fr/fr/modele/courrier/exercer-son-droit-dacces
            </Link>
          </NextLink>
          <br />
          <NextLink
            href="https://www.cnil.fr/fr/modele/courrier/rectifier-des-donnees-incompletes"
            legacyBehavior
            passHref>
            <Link sx={{fontWeight: 800}} underline="none">
              https://www.cnil.fr/fr/modele/courrier/rectifier-des-donnees-incompletes
            </Link>
          </NextLink>
          <br />
          <NextLink
            href="https://www.cnil.fr/fr/modele/courrier/rectifier-des-donnees-inexactes"
            legacyBehavior
            passHref>
            <Link sx={{fontWeight: 800}} underline="none">
              https://www.cnil.fr/fr/modele/courrier/rectifier-des-donnees-inexactes
            </Link>
          </NextLink>
          <br />
          <NextLink
            href="https://www.cnil.fr/fr/modele/courrier/supprimer-des-informations-vous-concernant-dun-site-internet"
            legacyBehavior
            passHref>
            <Link sx={{fontWeight: 800}} underline="none">
              https://www.cnil.fr/fr/modele/courrier/supprimer-des-informations-vous-concernant-dun-site-internet
            </Link>
          </NextLink>
          <br />
          <NextLink
            href="https://www.cnil.fr/fr/modele/courrier/cloturer-un-compte-en-ligne"
            legacyBehavior
            passHref>
            <Link sx={{fontWeight: 800}} underline="none">
              https://www.cnil.fr/fr/modele/courrier/cloturer-un-compte-en-ligne
            </Link>
          </NextLink>
        </Typography>
        <Typography>
          Dès lors que certaines données sont strictement nécessaires pour
          pouvoir bénéficier des services de la plateforme, la suppression de
          celles-ci entraînera nécessairement l’arrêt de ces services.
        </Typography>
        <Typography>
          En cas de décès de la personne concernée par les traitements réalisés
          et en l’absence de directives ou de mention contraire dans des
          directives laissées par la personne concernée, ses héritiers peuvent
          exercer les droits qui leur sont reconnus par le II de l’article 85 de
          la loi n° 78-17 du 6 janvier 1978 relative à l’informatique, aux
          fichiers et aux libertés.
        </Typography>
        <Typography>
          Toute personne concernée qui souhaite définir des directives
          particulières, relatives à la conservation, à l’effacement et à la
          communication de ses données à caractère personnel après son décès,
          peut nous les adresser afin que nous les enregistrions en application
          du I de l’article 85 de la loi n° 78-17 du 6 janvier 1978 relative à
          l’informatique, aux fichiers et aux libertés.
        </Typography>
        <Typography>
          Si vous estimez que Rustine Libre ne respecte pas ses obligations à
          l’égard de vos données personnelles, vous pouvez déposer une plainte
          auprès de la Commission nationale de l’informatique et des libertés
          (CNIL), via le formulaire suivant :<br />
          <NextLink
            href="https://cnil.fr/fr/plaintes/internet"
            legacyBehavior
            passHref>
            <Link sx={{fontWeight: 800}} underline="none">
              https://cnil.fr/fr/plaintes/internet
            </Link>
          </NextLink>
        </Typography>
        <Typography>
          Toutefois, dans un esprit de bienveillance et conformément à la
          culture du dialogue que nous souhaitons instaurer dans la communauté
          Rustine Libre, nous vous invitons dans un premier temps à nous faire
          part de tout mécontentement à cet égard, afin que nous puissions en
          tenir compte et nous améliorer.
        </Typography>
      </Box>
    </Box>
  );
};

export default YourRights;
