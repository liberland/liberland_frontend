import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { useMediaQuery } from 'usehooks-ts';
import styles from './styles.module.scss';
import ValidatorCard from '../ValidatorCard/ValidatorCard';
import stylesPage from '../../../../utils/pagesBase.module.scss';

function ValidatorList({
  validators,
  selectedValidatorsAsTargets,
  selectingValidatorsDisabled,
  toggleSelectedValidator,
}) {
  const isDesktopHigher = useMediaQuery('(min-width: 1400px)');
  return (
    <div className={stylesPage.transactionHistoryCard}>
      {isDesktopHigher
        && (
          <div className={cx(styles.validatorsListHeader, stylesPage.transactionHistoryCardHeader, styles.gridList)}>
            <span>NAME</span>
            <span>TOTAL STAKE</span>
            <span>OWN STAKE</span>
            <span>OTHER STAKE</span>
            <span>COMMISSION</span>
            <span>ALLOWED</span>
            <span>RETURN</span>
            <span>NOMINATED</span>
          </div>
        )}
      <div className={styles.validatorsList}>
        {validators.map((validator, index) => {
          const {
            bondTotal, bondOwn, bondOther, displayName, commission, blocked, stakedReturnCmp, accountId,
          } = validator;
          const address = accountId?.toString();
          return (
            <ValidatorCard
              key={address || index}
              stakedReturnCmp={stakedReturnCmp}
              total={bondTotal}
              own={bondOwn}
              others={bondOther}
              name={displayName || address}
              validatorAddress={address}
              commission={commission}
              blocked={blocked}
              nominatedByMe={selectedValidatorsAsTargets.includes(address)}
              toggleSelectedValidator={toggleSelectedValidator}
              selectingValidatorsDisabled={selectingValidatorsDisabled}
            />
          );
        })}
      </div>
    </div>
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
};
export default ValidatorList;
