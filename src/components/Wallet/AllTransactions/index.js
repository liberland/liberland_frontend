import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import WalletTransactionHistory from '../WalletTransactionHistory';
import { walletActions } from '../../../redux/actions';
import { walletSelectors } from '../../../redux/selectors';

const AllTransactions = () => {
  const dispatch = useDispatch();
  const transactionHistory = useSelector(walletSelectors.selectorHistoryTx);

  const onclickGetMoreTx = () => {
    dispatch(walletActions.getMoreTx.call());
  };

  return (
    <>
      <WalletTransactionHistory
        transactionHistory={transactionHistory}
        textForBtn="View All Transactions"
        bottomButtonOnclick={onclickGetMoreTx}
      />
    </>
  );
};

export default AllTransactions;
