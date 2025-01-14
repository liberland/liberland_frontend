import React from 'react';
import Button from '../../Button/Button';
import router from '../../../router';

export default function ProposeLegislationViaReferendumButton() {
  return (
    <Button link href={router.congress.addLegislationViaReferendum}>
      Propose Referendum
    </Button>
  );
}
