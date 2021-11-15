import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import WalletTransactionHistory from '../WalletTransactionHistory';
import { walletActions } from '../../../redux/actions';
import { walletSelectors } from '../../../redux/selectors';

const AllTransactions = () => {
  const dispatch = useDispatch();
  const transactionHistory = useSelector(walletSelectors.selectorAllHistoryTx);

  const onclickGetMoreTx = () => {
    dispatch(walletActions.getMoreTx.call());
  };

  useEffect(() => {
    dispatch(walletActions.getMoreTx.call());
    return () => {
      dispatch(walletActions.setCurrentPageNumber.success(0));
      dispatch(walletActions.getMoreTx.success([]));
    };
  }, [dispatch]);

  return (
    <>
      <WalletTransactionHistory
        transactionHistory={transactionHistory.reverse()}
        textForBtn="Load more transaction"
        bottomButtonOnclick={onclickGetMoreTx}
      />
    </>
  );
};

export default AllTransactions;
