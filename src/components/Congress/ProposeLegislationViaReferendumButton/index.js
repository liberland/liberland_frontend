import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../Button/Button';
import router from '../../../router';

export default function ProposeLegislationViaReferendumButton() {
  return (
    <Link to={router.congress.addLegislationViaReferendum}>
      <Button medium primary>
        Propose Referendum
      </Button>
    </Link>
  );
}
