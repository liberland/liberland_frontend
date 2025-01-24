import React from 'react';
import PropTypes from 'prop-types';
import Button from '../../../Button/Button';
import { StartValidatorModal } from '../../../Modals';

function NominatorUpdateActions({
  goToAdvancedPage,
  updateNominations,
  selectedValidatorsAsTargets,
}) {
  return (
    <>
      <StartValidatorModal label="Switch to Validator" />
      <Button link onClick={() => goToAdvancedPage()}>
        Advanced
      </Button>
      <Button
        primary
        onClick={() => updateNominations(selectedValidatorsAsTargets)}
      >
        Update nominations
      </Button>
    </>
  );
}

NominatorUpdateActions.propTypes = {
  goToAdvancedPage: PropTypes.func.isRequired,
  updateNominations: PropTypes.func.isRequired,
  selectedValidatorsAsTargets: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default NominatorUpdateActions;
