import React from 'react';
import PropTypes from 'prop-types';
import Flex from 'antd/es/flex';
import Button from '../../../Button/Button';

function Actions({
  goToAdvancedPage,
  updateNominations,
  selectedValidatorsAsTargets,
}) {
  return (
    <Flex wrap gap="15px" justify="end">
      <Button link onClick={() => goToAdvancedPage()}>
        Advanced
      </Button>
      <Button
        primary
        onClick={() => updateNominations(selectedValidatorsAsTargets)}
      >
        Update nominations
      </Button>
    </Flex>
  );
}

Actions.propTypes = {
  goToAdvancedPage: PropTypes.func.isRequired,
  updateNominations: PropTypes.func.isRequired,
  selectedValidatorsAsTargets: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Actions;
