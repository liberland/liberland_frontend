import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import styles from './styles.module.scss';
import ValidatorCard from '../ValidatorCard/ValidatorCard';
import { ReactComponent as ArrowBlueUpIcon } from '../../../../assets/icons/arrow-blue-up.svg';
import arrowsUpDown from '../../../../assets/icons/up-and-down-arrows.svg';
import liberlandEmblemImage from '../../../../assets/images/liberlandEmblem.svg';
import { blockchainSelectors, walletSelectors } from '../../../../redux/selectors';

function ValidatorList({
  validators,
  selectedValidatorsAsTargets,
  selectingValidatorsDisabled,
  toggleSelectedValidator,
}) {
  return (
    <div>
      <div className={styles.validatorsListHeader}>
        <div className={styles.listItemName}>
          Name &nbsp;
          {/* <img className={styles.arrowsUpDown} src={arrowsUpDown} alt="" /> */}
        </div>
        <div className={styles.listItem}>
          Commission &nbsp;
          {/* <img className={styles.arrowsUpDown} src={arrowsUpDown} alt="" /> */}
        </div>
        <div className={styles.listItem}>
          Allowed &nbsp;
          {/* <img className={styles.arrowsUpDown} src={arrowsUpDown} alt="" /> */}
        </div>
        <div className={styles.listItem}>
          Nominated by me &nbsp;
          {/* <img className={styles.arrowsUpDown} src={arrowsUpDown} alt="" /> */}
        </div>
      </div>
      {
        validators.map((validator) => (
          <ValidatorCard
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
  );
}

ValidatorList.defaultProps = {
  prop: 'test',
};
ValidatorList.propTypes = {
  validators: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectedValidatorsAsTargets: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectingValidatorsDisabled: PropTypes.bool.isRequired,
  toggleSelectedValidator: PropTypes.func.isRequired,
};
export default ValidatorList;
