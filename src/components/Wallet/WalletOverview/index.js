import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import { walletActions } from '../../../redux/actions';
import { blockchainSelectors, walletSelectors } from '../../../redux/selectors';

import { ChoseStakeModal } from '../../Modals';
import Card from '../../Card';

import styles from './styles.module.scss';
import { formatDollars, formatMerits } from '../../../utils/walletHelpers';

function WalletOverview({
  totalBalance, balances, liquidMerits,
}) {
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
      amount: formatMerits(balances.liberstake.amount),
      title: 'PolitiPooled',
      diff: 2.4,
      currency: 'LLM',
    },
    {
      amount: formatDollars(balances.polkastake.amount),
      title: 'Validator Staked',
      diff: 2.4,
      currency: 'LLD',
    },
    {
      amount: formatMerits(liquidMerits),
      title: 'Liquid Merits',
      diff: -0.4,
      currency: 'LLM',
    },
    {
      amount: formatDollars(totalBalance),
      title: 'Liquid LLD',
      diff: -0.6,
      currency: 'LLD',
    },
  ];

  return (
    <Card className={styles.overviewWrapper} title="Overview">
      <div className={styles.overViewCard}>
        {
          overviewInfo.map((cardInfo) => (
            <div
              className={styles.cardInfo}
              key={cardInfo.title}
              onClick={() => handleModalOpenStake(cardInfo.title)}
            >
              <div className={styles.cardInfoAmountWrapper}>
                <p className={styles.cardInfoAmount}>
                  {cardInfo.amount}
                  <span>
                    {' '}
                    {cardInfo.currency}
                  </span>
                </p>
              </div>
              <p className={styles.cardInfoTitle}>{cardInfo.title}</p>
            </div>
          ))
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
}
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
