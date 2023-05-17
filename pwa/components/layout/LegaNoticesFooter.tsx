import React, {Fragment} from 'react';
import {Container, Button, Link} from '@mui/material';
import {legalNoticesFooter} from '@data/legal-notices-footer';

const LegalNoticesFooter = (): JSX.Element => {
  return (
    <Container
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        justifyContent: 'center',
        py: 4,
        backgroundColor: 'white',
      }}>
      {legalNoticesFooter.map(({name, link, disabled}, index) => {
        const isLastItem = index === legalNoticesFooter.length - 1;
        return (
          <Fragment key={name}>
            <Link
              href={disabled ? '' : link}
              style={{
                textDecoration: 'none',
                cursor: disabled ? 'default' : 'pointer',
                pointerEvents: disabled ? 'none' : 'auto',
              }}>
              <Button
                disabled={disabled}
                sx={{
                  paddingX: 2,
                  textTransform: 'capitalize',
                  fontSize: 12,
                  fontWeight: 400,
                  color: disabled ? 'grey' : 'black',
                }}>
                {name}
              </Button>
            </Link>
            {!isLastItem && <span>-</span>}
          </Fragment>
        );
      })}
    </Container>
  );
};

export default LegalNoticesFooter;
