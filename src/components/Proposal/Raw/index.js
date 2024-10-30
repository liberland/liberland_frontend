import React from 'react';
import PropTypes from 'prop-types';
import styles from '../styles.module.scss';

function Raw({ proposal }) {
  return <pre className={styles.legislationContent}>{JSON.stringify(proposal.toHuman(), null, 2)}</pre>;
}

// eslint-disable-next-line react/forbid-prop-types
Raw.propTypes = { proposal: PropTypes.object };
