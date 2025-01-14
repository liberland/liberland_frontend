import React from 'react';
import PropTypes from 'prop-types';
import { useMediaQuery } from 'usehooks-ts';
import Checkbox from 'antd/es/checkbox';
import Flex from 'antd/es/flex';
import Table from '../../../Table';
import truncate from '../../../../utils/truncate';
import { formatDollars, sanitizeValue } from '../../../../utils/walletHelpers';
import Button from '../../../Button/Button';

function ValidatorList({
  validators,
  selectedValidatorsAsTargets,
  selectingValidatorsDisabled,
  toggleSelectedValidator,
  updateNominations,
  goToAdvancedPage,
}) {
  const isDesktopHigher = useMediaQuery('(min-width: 1400px)');
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
      data={validators.map(({
        bondTotal,
        bondOwn,
        bondOther,
        displayName,
        commission,
        blocked,
        stakedReturnCmp,
        accountId,
      }) => {
        const address = accountId?.toString();
        const totalSanitized = bondTotal ? sanitizeValue(bondTotal.toString()) : null;
        const totalValue = totalSanitized ? formatDollars(totalSanitized) : null;
        const ownSanitized = bondOwn ? sanitizeValue(bondOwn.toString()) : null;
        const ownValue = ownSanitized ? formatDollars(ownSanitized) : null;
        const otherValue = formatDollars(sanitizeValue(bondOther.toString()));
        const nominatedByMe = selectedValidatorsAsTargets.includes(address);
        return {
          name: truncate(displayName || address, isDesktopHigher ? 13 : 20),
          total: `${totalValue || 0} LLD`,
          own: `${ownValue || 0} LLD`,
          other: `${otherValue || 0} LLD`,
          commission,
          allowed: blocked ? 'Blocked' : 'Available',
          return: `${stakedReturnCmp || 0}%`,
          nominated: (
            <Checkbox
              disabled={selectingValidatorsDisabled}
              checked={nominatedByMe}
              onChange={() => toggleSelectedValidator(address)}
            />
          ),
        };
      })}
      columns={[
        {
          Header: 'Name',
          accessor: 'name',
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
          accessor: 'return',
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
