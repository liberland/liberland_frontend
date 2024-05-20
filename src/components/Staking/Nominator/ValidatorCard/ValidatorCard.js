import React from 'react';
import PropTypes from 'prop-types';
import { useMediaQuery } from 'usehooks-ts';
import cx from 'classnames';
import styles from './styles.module.scss';
import liberlandEmblemImage from '../../../../assets/images/liberlandEmblem.svg';
import truncate from '../../../../utils/truncate';
import stylesParent from '../ValidatorList/styles.module.scss';
import imageCheckbox from '../../../../assets/icons/checked.svg';
import { formatDollars, sanitizeValue } from '../../../../utils/walletHelpers';
import Card from '../../../Card';
import stylesPage from '../../../../utils/pagesBase.module.scss';

function ValidatorCard({
  name,
  commission,
  blocked,
  nominatedByMe,
  toggleSelectedValidator,
  validatorAddress,
  selectingValidatorsDisabled,
  total,
  own,
  others,
  stakedReturnCmp,
}) {
  const isDesktopHigher = useMediaQuery('(min-width: 1400px)');
  let checkbox = '';
  const totalSanitized = total ? sanitizeValue(total.toString()) : null;
  const totalValue = totalSanitized ? formatDollars(totalSanitized) : null;
  const ownSanitized = own ? sanitizeValue(own.toString()) : null;
  const ownValue = ownSanitized ? formatDollars(ownSanitized) : null;
  const otherValue = formatDollars(sanitizeValue(others.toString()));
  if (nominatedByMe) checkbox = <img className={styles.img} src={imageCheckbox} alt="checkbox" />;
  else if (selectingValidatorsDisabled) checkbox = 'MAX';
  return (
    <Card className={cx(stylesPage.overviewWrapper, styles.wrapper)}>
      <div className={isDesktopHigher ? stylesParent.gridList : styles.mobileList}>
        <div className={styles.avatarProfile}>
          <div className={styles.avatarImage}><img src={liberlandEmblemImage} alt="" /></div>
          {!isDesktopHigher && <span className={styles.title}>Name:</span>}
          <div className={styles.avatarName}>{truncate(name, isDesktopHigher ? 13 : 20)}</div>
        </div>
        {total && (
        <div className={styles.listItem}>
          {!isDesktopHigher && <span className={styles.title}>Total Stake:</span>}
          {' '}
          {totalValue}
          {' '}
          LLD
        </div>
        )}
        {own && (
        <div className={styles.listItem}>
          {!isDesktopHigher && <span className={styles.title}>Own Stake:</span>}
          {ownValue}
          {' '}
          LLD
        </div>
        )}
        {total && own && (
        <div className={styles.listItem}>
          {!isDesktopHigher && <span className={styles.title}>Other Stake:</span>}
          {otherValue || 0}
          {' '}
          LLD
        </div>
        )}
        <div className={styles.listItem}>
          {!isDesktopHigher && <span className={styles.title}>Commission:</span>}
          {commission}
        </div>
        <div className={styles.listItem}>
          {!isDesktopHigher && <span className={styles.title}>Allowed:</span>}
          <div className={blocked ? styles.blocked : styles.available}>{blocked ? 'Blocked' : 'Available' }</div>
        </div>
        <div className={styles.listItem}>
          {!isDesktopHigher && <span className={styles.title}>Return:</span>}
          {stakedReturnCmp}
          %
        </div>
        <div className={styles.listItem}>
          {!isDesktopHigher && <span className={styles.title}>Nominated:</span>}
          <div className={styles.checkBoxWrapper} onClick={() => toggleSelectedValidator(validatorAddress)}>
            <div className={styles.checkBox}>{checkbox}</div>
          </div>
        </div>
        {!isDesktopHigher && <div className={styles.line} />}
      </div>
    </Card>
  );
}

ValidatorCard.defaultProps = {
  name: 'Test Validator',
  commission: '5%',
  blocked: false,
  nominatedByMe: false,
  validatorAddress: '',
  selectingValidatorsDisabled: false,
  total: undefined,
  own: undefined,
  others: undefined,
  stakedReturnCmp: null,
};

ValidatorCard.propTypes = {
  name: PropTypes.string,
  commission: PropTypes.string,
  blocked: PropTypes.bool,
  nominatedByMe: PropTypes.bool,
  toggleSelectedValidator: PropTypes.func.isRequired,
  validatorAddress: PropTypes.string,
  selectingValidatorsDisabled: PropTypes.bool,
  // eslint-disable-next-line react/forbid-prop-types
  total: PropTypes.object,
  // eslint-disable-next-line react/forbid-prop-types
  own: PropTypes.object,
  // eslint-disable-next-line react/forbid-prop-types
  others: PropTypes.object,
  stakedReturnCmp: PropTypes.number,
};

export default ValidatorCard;
