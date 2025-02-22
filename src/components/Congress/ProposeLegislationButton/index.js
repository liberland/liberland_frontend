import React from 'react';
import Button from '../../Button/Button';
import router from '../../../router';

export default function ProposeLegislationButton() {
  return (
    <Button primary href={router.congress.addLegislation}>
      Propose International Treaty
    </Button>
  );
}
