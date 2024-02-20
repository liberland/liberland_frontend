import React from 'react';
import PropTypes from 'prop-types';
import { useMediaQuery } from 'usehooks-ts';
import styles from './styles.module.scss';
import liberlandEmblemImage from '../../../../assets/images/liberlandEmblem.svg';
import truncate from '../../../../utils/truncate';
import stylesParent from '../ValidatorList/styles.module.scss';
import imageCheckbox from '../../../../assets/icons/checked.svg';

function ValidatorCard({
  name,
  commission,
  blocked,
  nominatedByMe,
  toggleSelectedValidator,
  validatorAddress,
  selectingValidatorsDisabled,
}) {
  const isTabletHigher = useMediaQuery('(min-width: 1025px)');
  const isBigScreen = useMediaQuery('(min-width: 1400px)');
  let checkbox = '';
  if (nominatedByMe) checkbox = <img className={styles.img} src={imageCheckbox} alt="checkbox" />;
  else if (selectingValidatorsDisabled) checkbox = 'MAX';

  if (!isTabletHigher) {
    return (
      <div className={styles.itemWrapper}>
        <div className={styles.leftColumn}>
          <div className={styles.avatarProfile}>
            <div className={styles.avatarImage}><img src={liberlandEmblemImage} alt="" /></div>
          </div>
          <div className={styles.commisionNameAllowed}>
            <div className={styles.avatarName}>{ truncate(name, 10)}</div>
            <div className={styles.nameAvaible}>
              <div className={styles.listItem}>{commission}</div>
              <div className={blocked ? styles.blocked : styles.available}>{blocked ? 'Blocked' : 'Available' }</div>
            </div>
          </div>

        </div>
        <div className={styles.rightColumn}>
          <div className={styles.listItem}>
            <span className={styles.itemText}>Nominate</span>
            <div className={styles.checkBoxWrapper} onClick={() => toggleSelectedValidator(validatorAddress)}>
              <div className={styles.checkBox}>{checkbox}</div>
            </div>
          </div>
        </div>

      </div>
    );
  }

  return (
    <div className={stylesParent.gridList}>
      <div className={styles.avatarProfile}>
        <div className={styles.avatarImage}><img src={liberlandEmblemImage} alt="" /></div>
        <div className={styles.avatarName}>{ isBigScreen ? name : truncate(name, 13)}</div>
      </div>
      <div className={styles.listItem}>{commission}</div>
      <div className={styles.listItem}>
        <div className={blocked ? styles.blocked : styles.available}>{blocked ? 'Blocked' : 'Available' }</div>
      </div>

      <div className={styles.listItem}>
        <span className={styles.itemText}>Nominate</span>
        <div className={styles.checkBoxWrapper} onClick={() => toggleSelectedValidator(validatorAddress)}>
          <div className={styles.checkBox}>{checkbox}</div>
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
