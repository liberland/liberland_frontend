import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cx from 'classnames';
import { blockchainSelectors, validatorSelectors } from '../../../redux/selectors';
import { validatorActions } from '../../../redux/actions';
import StakeManagement from '../StakeManagement';
import Validator from '../Validator';
import Nominator from '../Nominator';
import styles from '../../../utils/pagesBase.module.scss';
import stylesStacking from './styles.module.scss';


export default function StakingOverview() {
  const dispatch = useDispatch();
  const info = useSelector(validatorSelectors.info);
  const walletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);

  useEffect(() => {
    dispatch(validatorActions.getInfo.call());
  }, [dispatch, walletAddress]);

  if (!info) return null; // loading

  let render = null;
  if (info.isStakingValidator) {
    render = <Validator />;
  } else if (info.stash) {
    render = <Nominator />;
  }

  return (
    <div className={styles.sectionWrapper}>
      <div className={cx(styles.contentWrapper, stylesStacking.contentWrapper)}>
        <StakeManagement />
        {render}
      </div>
    </div>
  );
}
