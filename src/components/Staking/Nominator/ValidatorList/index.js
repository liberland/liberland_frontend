import React from 'react';
import PropTypes from 'prop-types';
import Flex from 'antd/es/flex';
import { useSelector } from 'react-redux';
import Table from '../../../Table';
import { getValidatorDisplay } from './utils';
import NominatorUpdateActions from '../NominatorUpdateActions';
import { identitySelectors } from '../../../../redux/selectors';

function ValidatorList({
  validators,
  selectedValidatorsAsTargets,
  selectingValidatorsDisabled,
  toggleSelectedValidator,
  goToAdvancedPage,
  updateNominations,
}) {
  const identities = useSelector(identitySelectors.selectorIdentityMotions);

  return (
    <Table
      footer={(
        <Flex wrap gap="15px" justify="end">
          <NominatorUpdateActions
            goToAdvancedPage={goToAdvancedPage}
            selectedValidatorsAsTargets={selectedValidatorsAsTargets}
            updateNominations={updateNominations}
          />
        </Flex>
      )}
      pageSize={20}
      data={getValidatorDisplay({
        selectedValidatorsAsTargets,
        selectingValidatorsDisabled,
        toggleSelectedValidator,
        validators,
        identities,
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
