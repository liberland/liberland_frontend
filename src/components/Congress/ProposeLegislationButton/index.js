import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../Button/Button';
import router from '../../../router';

export default function ProposeLegislationButton() {
  return (
    <Link to={router.congress.addLegislation}>
      <Button medium primary>
        Propose International Treaty
      </Button>
    </Link>
  );
}
