import React from 'react';
import PropTypes from 'prop-types';
import Button from '../../Button/Button';
import router from '../../../router';

function ContractSignButton({
  contractId,
}) {
  return (
    <Button
      flex
      primary
      href={router.contracts.item.replace(':id', contractId)}
      newTab
    >
      Sign contract
    </Button>
  );
}

ContractSignButton.propTypes = {
  contractId: PropTypes.string.isRequired,
};

export default ContractSignButton;
