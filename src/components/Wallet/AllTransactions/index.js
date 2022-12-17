import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import WalletTransactionHistory from '../WalletTransactionHistory';
import { walletActions } from '../../../redux/actions';
import { walletSelectors } from '../../../redux/selectors';

const AllTransactions = () => {
  const dispatch = useDispatch();
  const transactionHistory = useSelector(walletSelectors.selectorAllHistoryTx);

  useEffect(() => {
    return () => {
      dispatch(walletActions.setCurrentPageNumber.success(0));
    };
  }, [dispatch]);

  return (
    <>
      <WalletTransactionHistory
        transactionHistory={transactionHistory.reverse()}
        textForBtn="Load more transaction"
      />
    </>
  );
};

export default AllTransactions;
