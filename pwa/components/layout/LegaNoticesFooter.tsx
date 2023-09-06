import React, {Fragment} from 'react';
import {Box, Container, Link, Typography} from '@mui/material';
import NextLink from 'next/link';
import {legalNoticesFooter} from '@data/legal-notices-footer';
import Image from 'next/image';
import Logo from '@components/common/Logo';
import rustineViolet from '@public/img/rustine-violet.svg';
import fundersLogos from '@public/img/funders-logos.png';

const LegalNoticesFooter = (): JSX.Element => {
  return (
    <Container sx={{paddingY: 6}}>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        maxWidth="100%"
        width="240px"
        marginX="auto">
        <Box
          flex={1}
          position="relative"
          sx={{aspectRatio: '1/1', marginRight: '-5%'}}>
          <Image loading="eager" fill alt="" src={rustineViolet} />
        </Box>
        <Box width="60%">
          <Logo color="secondary" />
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 1,
          justifyContent: 'center',
          pt: 3,
        }}>
        {legalNoticesFooter.map(({name, link, disabled}, index) => {
          const isLastItem = index === legalNoticesFooter.length - 1;
          return (
            <Fragment key={name}>
              <NextLink href={disabled ? '' : link} legacyBehavior passHref>
                <Link
                  variant="caption"
                  color="grey.600"
                  underline="none"
                  style={{
                    cursor: disabled ? 'default' : 'pointer',
                    pointerEvents: disabled ? 'none' : 'auto',
                    fontSize: 'caption.fontsize',
                  }}>
                  {name}
                </Link>
              </NextLink>
              {!isLastItem && (
                <Typography variant="caption" color="grey.600">
                  |
                </Typography>
              )}
            </Fragment>
          );
        })}
      </Box>
      <Box width="100%" pt={4} maxWidth={{xs: 600, md: 700}} mx="auto">
        <img
          alt="Logo des financeurs du projet Rustine Libre"
          src="/img/funders-logos.png"
          style={{width: '100%'}}
        />
      </Box>
    </Container>
  );
};

export default LegalNoticesFooter;
