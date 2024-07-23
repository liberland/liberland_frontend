import React from 'react';
import { NavLink } from 'react-router-dom';
import Button from '../../Button/Button';
import router from '../../../router';
import styles from '../styles.module.scss';

export default function ProposeLegislationButton() {
  return (
    <NavLink
      className={styles.linkButton}
      to={router.congress.addLegislation}
    >
      <Button small primary>
        Propose International Treaty
      </Button>
    </NavLink>
  );
}
