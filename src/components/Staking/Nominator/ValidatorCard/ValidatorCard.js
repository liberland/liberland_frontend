import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.module.scss';
import liberlandEmblemImage from '../../../../assets/images/liberlandEmblem.svg';
import truncate from '../../../../utils/truncate';

function ValidatorCard({
  name,
  commission,
  blocked,
  nominatedByMe,
  toggleSelectedValidator,
  validatorAddress,
  selectingValidatorsDisabled,
}) {
  let checkbox = '';
  if (nominatedByMe) checkbox = '✅';
  else if (selectingValidatorsDisabled) checkbox = 'MAX';

  return (
    <div className={styles.nominatorCardWrapper}>
      <div className={styles.avatarProfile}>
        <div className={styles.avatarImage}><img src={liberlandEmblemImage} alt="" /></div>
        <div className={styles.avatarName}>{name}</div>
      </div>
      <div className={styles.nominatorRightWrapper}>
        <div className={styles.listItem}>{commission}</div>
        <div className={styles.listItem}>
          <div className={blocked ? styles.blocked : styles.available}>{blocked ? 'Blocked' : 'Available' }</div>
        </div>
        <div className={styles.listItem} onClick={() => toggleSelectedValidator(validatorAddress)}>
          <div className={styles.checkBox}>
            <div>{checkbox}</div>
          </div>
        </div>
      </div>


    </div>
  );
}

ValidatorCard.defaultProps = {
  name: 'Test Validator',
  commission: '5%',
  blocked: false,
  nominatedByMe: false,
  validatorAddress: '',
  selectingValidatorsDisabled: false,
};

ValidatorCard.propTypes = {
  name: PropTypes.string,
  commission: PropTypes.string,
  blocked: PropTypes.bool,
  nominatedByMe: PropTypes.bool,
  toggleSelectedValidator: PropTypes.func.isRequired,
  validatorAddress: PropTypes.string,
  selectingValidatorsDisabled: PropTypes.bool,
};

export default ValidatorCard;
