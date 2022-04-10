import React, { useState } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import { walletActions } from '../../../redux/actions';
import { blockchainSelectors, walletSelectors } from '../../../redux/selectors';

import prettyNumber from '../../../utils/prettyNumber';

import { ReactComponent as ArrowYellowUpIcon } from '../../../assets/icons/arrow-yellow-up.svg';
import { ReactComponent as ArrowYellowDownIcon } from '../../../assets/icons/arrow-yellow-down.svg';
import { ReactComponent as ArrowRedDownIcon } from '../../../assets/icons/arrow-red-down.svg';
import { ReactComponent as ArrowRedUpIcon } from '../../../assets/icons/arrow-red-up.svg';
import { ReactComponent as ArrowBlueDownIcon } from '../../../assets/icons/arrow-blue-down.svg';
import { ReactComponent as ArrowBlueUpIcon } from '../../../assets/icons/arrow-blue-up.svg';
import { ChoseStakeModal } from '../../Modals';
import Card from '../../Card';

import styles from './styles.module.scss';
import {formatMerits} from "../../../utils/walletHelpers";

const WalletOverview = ({
  totalBalance, balances, liquidMerits,
}) => {
  const [isModalOpenStake, setIsModalOpenStake] = useState(false);
  const [modalShown, setModalShown] = useState(1);
  const { handleSubmit, register } = useForm();
  const dispatch = useDispatch();

  const handleModalOpenStake = (title) => {
    setIsModalOpenStake(!isModalOpenStake);

    if (title === 'Liberstake') {
      setModalShown(2);
    } else if (title === 'Polkastake') {
      setModalShown(1);
    } else {
      setIsModalOpenStake(false);
    }
  };

  const isUserHaveStake = useSelector(walletSelectors.selectorIsUserHaveStake);
  const walletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);

  const handleSubmitStakePolka = (values) => {
    dispatch(walletActions.stakeToPolka.call({ values, isUserHaveStake, walletAddress }));
    handleModalOpenStake();
  };
  const handleSubmitStakeLiberland = (values) => {
    dispatch(walletActions.stakeToLiberland.call({ values, isUserHaveStake, walletAddress }));
    handleModalOpenStake();
  };

  const overviewInfo = [
    {
      amount: prettyNumber(balances.liberstake.amount),
      title: 'PolitiPooled',
      diff: 2.4,
      // eslint-disable-next-line no-constant-condition
      getIcon: () => (2.4 > 0 ? <ArrowYellowUpIcon /> : <ArrowYellowDownIcon />),
    },
    {
      amount: formatMerits(balances.polkastake.amount),
      title: 'Validator Staked',
      diff: 2.4,
      // eslint-disable-next-line no-constant-condition
      getIcon: () => (2.4 > 0 ? <ArrowRedUpIcon /> : <ArrowRedDownIcon />),
    },
    {
      amount: formatMerits(liquidMerits),
      title: 'Liquid Merits',
      diff: -0.4,
      // eslint-disable-next-line no-constant-condition
      getIcon: () => (-0.4 > 0 ? <ArrowBlueUpIcon /> : <ArrowBlueDownIcon />),
    },
    {
      amount: formatMerits(totalBalance),
      title: 'Total merits',

      diff: -0.6,
      // eslint-disable-next-line no-constant-condition
      getIcon: () => (-0.6 > 0 ? <ArrowRedUpIcon /> : <ArrowRedDownIcon />),
    },
  ];

  return (
    <Card className={styles.overviewWrapper} title="Overview">
      <div className={styles.overViewCard}>
        {
          overviewInfo.map((cardInfo) => {
            const isDiffPositive = cardInfo.diff > 0;

            return (
              <div
                className={styles.cardInfo}
                key={cardInfo.title}
                onClick={() => handleModalOpenStake(cardInfo.title)}
              >
                {/*<div className={styles.cardInfoIcon}>{cardInfo.getIcon()}</div>*/}
                <div className={styles.cardInfoAmountWrapper}>
                  <p className={styles.cardInfoAmount}>
                    {cardInfo.amount}
                    <span> LLM</span>
                  </p>
                  {/*<p className={cx(styles.cardInfoAmountDiff, {
                    [styles.cardInfoAmountDiffRed]: !isDiffPositive,
                    [styles.cardInfoAmountDiffGreen]: isDiffPositive,
                  })}
                  >
                    {`${isDiffPositive ? `+${cardInfo.diff}% ` : `${cardInfo.diff}% `} `}
                    {isDiffPositive ? (
                      <svg width="11" height="12" viewBox="0 0 11 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 6L5.5 1L10 6M5.5 11V1.71429" stroke="#38CB89" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      <svg width="11" height="12" viewBox="0 0 11 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 6L5.5 11L1 6M5.5 1L5.5 10.2857" stroke="#FF5630" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </p>*/}
                </div>
                <p className={styles.cardInfoTitle}>{cardInfo.title}</p>
              </div>
            );
          })
        }
      </div>
      {isModalOpenStake && (
        <ChoseStakeModal
          closeModal={handleModalOpenStake}
          handleSubmit={handleSubmit}
          register={register}
          modalShown={modalShown}
          setModalShown={setModalShown}
          handleSubmitStakePolka={handleSubmitStakePolka}
          handleSubmitStakeLiberland={handleSubmitStakeLiberland}
        />
      )}
    </Card>
  );
};
WalletOverview.defaultProps = {
  totalBalance: 0,
  balances: {},
  liquidMerits: 0,
};

WalletOverview.propTypes = {
  totalBalance: PropTypes.number,
  balances: PropTypes.shape({
    free: PropTypes.shape({
      amount: PropTypes.number,
    }),
    liberstake: PropTypes.shape({
      amount: PropTypes.number,
    }),
    polkastake: PropTypes.shape({
      amount: PropTypes.number,
    }),
    liquidMerits: PropTypes.shape({
      amount: PropTypes.number,
    }),
  }),
  liquidMerits: PropTypes.number,
};

export default WalletOverview;
