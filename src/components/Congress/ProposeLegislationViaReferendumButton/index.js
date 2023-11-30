import React from 'react';
import { NavLink } from 'react-router-dom';
import Button from '../../Button/Button';
import router from '../../../router';
import styles from './styles.module.scss';

export default function ProposeLegislationViaReferendumButton() {
  return (
    <NavLink
      className={styles.linkButton}
      to={router.congress.addLegislationViaReferendum}
    >
      <Button small primary>
        Propose Referendum
      </Button>
    </NavLink>
  );
}
