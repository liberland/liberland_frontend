import React, { useState } from 'react';
import PropTypes, { bool } from 'prop-types';
import styles from './styles.module.scss';
import eCardImage from '../../../../assets/images/e_card_image.svg';
import liberlandEmblemImage from '../../../../assets/images/liberlandEmblem.svg';

const ValidatorCard = ({
  avatarImage,
  name,
  commission,
  blocked,
  nominatedByMe,
  toggleSelectedValidator,
  validatorAddress,
  selectingValidatorsDisabled,
}) => {
  const test = '';

  return (
    <div className={styles.nominatorCardWrapper}>
      <div className={styles.avatarProfile}>
        <div className={styles.avatarImage}><img src={liberlandEmblemImage} alt="" /></div>
        <div className={styles.avatarName}>{name}</div>
      </div>
      <div className={styles.listItem}>{commission}</div>
      <div className={styles.listItem}>{blocked ? '❌' : '✅' }</div>
      <div className={styles.listItem} onClick={() => toggleSelectedValidator(validatorAddress)}>
        <div className={styles.checkBox}>
          <div>{nominatedByMe ? '✅' : selectingValidatorsDisabled ? 'MAX' : '❌' }</div>
        </div>
      </div>

    </div>
  );
};

ValidatorCard.defaultProps = {
  avatarImage: '',
  name: 'Test Validator',
  commission: '5%',
  blocked: false,
  nominatedByMe: 'No',
  validatorAddress: '',
  selectingValidatorsDisabled: false,
};

ValidatorCard.propTypes = {
  avatarImage: PropTypes.string,
  name: PropTypes.string,
  commission: PropTypes.string,
  blocked: PropTypes.bool,
  nominatedByMe: PropTypes.string,
  toggleSelectedValidator: PropTypes.func.isRequired,
  validatorAddress: PropTypes.string,
  selectingValidatorsDisabled: PropTypes.bool,
};

export default ValidatorCard;
