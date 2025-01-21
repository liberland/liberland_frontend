import React from 'react';
import PropTypes from 'prop-types';
import Flex from 'antd/es/flex';
import Table from '../../../Table';
import Button from '../../../Button/Button';
import { getValidatorDisplay } from './utils';

function ValidatorList({
  validators,
  selectedValidatorsAsTargets,
  selectingValidatorsDisabled,
  toggleSelectedValidator,
  updateNominations,
  goToAdvancedPage,
}) {
  return (
    <Table
      footer={(
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
      )}
      data={getValidatorDisplay({
        selectedValidatorsAsTargets,
        selectingValidatorsDisabled,
        toggleSelectedValidator,
        validators,
      })}
      columns={[
        {
          Header: 'Name',
          accessor: 'name',
        },
        {
          Header: 'Address',
          accessor: 'address',
        },
        {
          Header: 'Total stake',
          accessor: 'total',
        },
        {
          Header: 'Own stake',
          accessor: 'own',
        },
        {
          Header: 'Other stake',
          accessor: 'other',
        },
        {
          Header: 'Commission',
          accessor: 'commission',
        },
        {
          Header: 'Allowed',
          accessor: 'allowed',
        },
        {
          Header: 'Return',
          accessor: 'profit',
        },
        {
          Header: 'Nominated',
          accessor: 'nominated',
        },
      ]}
    />
  );
}

ValidatorList.propTypes = {
  validators: PropTypes.arrayOf(PropTypes.shape({
    displayName: PropTypes.string,
    address: PropTypes.string,
    commission: PropTypes.string,
    blocked: PropTypes.bool,
  })).isRequired,
  selectedValidatorsAsTargets: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectingValidatorsDisabled: PropTypes.bool.isRequired,
  toggleSelectedValidator: PropTypes.func.isRequired,
  updateNominations: PropTypes.func.isRequired,
  goToAdvancedPage: PropTypes.func.isRequired,
};

export default ValidatorList;
