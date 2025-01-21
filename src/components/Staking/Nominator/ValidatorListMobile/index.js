import React from 'react';
import PropTypes from 'prop-types';
import { useMediaQuery } from 'usehooks-ts';
import Checkbox from 'antd/es/checkbox';
import Flex from 'antd/es/flex';
import Avatar from 'antd/es/avatar';
import Tag from 'antd/es/tag';
import Table from '../../../Table';
import truncate from '../../../../utils/truncate';
import CopyIconWithAddress from '../../../CopyIconWithAddress';
import { formatDollars, sanitizeValue } from '../../../../utils/walletHelpers';
import LLD from '../../../../assets/icons/lld.svg';
import Button from '../../../Button/Button';
import styles from './styles.module.scss';

function ValidatorListMobile({
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
      }, index) => {
        const address = accountId?.toString();
        const totalSanitized = bondTotal ? sanitizeValue(bondTotal.toString()) : null;
        const totalValue = totalSanitized ? formatDollars(totalSanitized) : null;
        const ownSanitized = bondOwn ? sanitizeValue(bondOwn.toString()) : null;
        const ownValue = ownSanitized ? formatDollars(ownSanitized) : null;
        const otherValue = formatDollars(sanitizeValue(bondOther.toString()));
        const nominatedByMe = selectedValidatorsAsTargets.includes(address);
        const icon = (
          <Avatar size={16} src={LLD} alt="LLD" />
        );
        return {
          name: truncate(displayName || address, isDesktopHigher ? 13 : 20),
          address: <CopyIconWithAddress address={address} isTruncate />,
          total: (
            <Flex gap="5px">
              {totalValue || 0}
              {icon}
            </Flex>
          ),
          own: (
            <Flex gap="5px">
              {ownValue || 0}
              {icon}
            </Flex>
          ),
          other: (
            <Flex gap="5px">
              {otherValue || 0}
              {icon}
            </Flex>
          ),
          commission,
          allowed: blocked ? (
            <Tag className={styles.error} color="white">
              Blocked
            </Tag>
          ) : (
            <Tag className={styles.success} color="white">
              Available
            </Tag>
          ),
          return: `${stakedReturnCmp || 0}%`,
          nominated: (
            <Flex gap="5px">
              <label htmlFor={`checkbox_${index}`}>
                Nominated
              </label>
              <Checkbox
                disabled={selectingValidatorsDisabled}
                checked={nominatedByMe}
                onChange={() => toggleSelectedValidator(address)}
                id={`checkbox_${index}`}
              />
            </Flex>
          ),
        };
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

ValidatorListMobile.propTypes = {
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

export default ValidatorListMobile;
