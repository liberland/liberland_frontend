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
  const isTabletHigher = useMediaQuery('(min-width: 1025px)');

  return (
    <div className={stylesPage.transactionHistoryCard}>

      <div className={cx(styles.validatorsListHeader, stylesPage.transactionHistoryCardHeader, styles.gridList)}>
        {isTabletHigher
          ? (
            <>
              <span>NAME</span>
              <span>COMMISSION</span>
              <span>ALLOWED</span>
              <span>NOMINATED BY ME</span>
            </>
          )
          : (
            <>
              <div className={styles.nameCommisionAllowed}>
                <span>NAME</span>
                <div>
                  <span>COMMISSION</span>
                  {' / '}
                  <span>ALLOWED</span>
                </div>

              </div>
              <div className={styles.nominated}>
                <span>NOMINATED BY ME</span>
              </div>
            </>
          )}

      </div>
      <div className={styles.validatorsList}>
        {
        validators.map((validator) => (
          <ValidatorCard
            key={validator.address}
            name={validator.displayName ? validator.displayName : validator.address}
            validatorAddress={validator.address}
            commission={validator.commission}
            blocked={validator.blocked}
            nominatedByMe={selectedValidatorsAsTargets.includes(validator.address)}
            toggleSelectedValidator={toggleSelectedValidator}
            selectingValidatorsDisabled={selectingValidatorsDisabled}
          />
        ))
      }
      </div>
    </div>
  );
}

ValidatorList.propTypes = {
  validators: PropTypes.arrayOf(PropTypes.shape({
    displayName: PropTypes.string,
    address: PropTypes.string.isRequired,
    commission: PropTypes.string.isRequired,
    blocked: PropTypes.bool.isRequired,
  })).isRequired,
  selectedValidatorsAsTargets: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectingValidatorsDisabled: PropTypes.bool.isRequired,
  toggleSelectedValidator: PropTypes.func.isRequired,
};
export default ValidatorList;
