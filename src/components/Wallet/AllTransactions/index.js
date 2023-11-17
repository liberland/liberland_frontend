import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import WalletTransactionHistory from '../WalletTransactionHistory';
import { walletActions } from '../../../redux/actions';
import { walletSelectors } from '../../../redux/selectors';

function AllTransactions() {
  const dispatch = useDispatch();
  const transactionHistory = useSelector(walletSelectors.selectorAllHistoryTx);
  const historyFetchFailed = useSelector(walletSelectors.selectorTxHistoryFailed);

  useEffect(() => () => {
    dispatch(walletActions.setCurrentPageNumber.success(0));
  }, [dispatch]);

  return (
    <WalletTransactionHistory
      failure={historyFetchFailed}
      transactionHistory={transactionHistory.reverse()}
      textForBtn="Load more transaction"
    />
  );
}

export default AllTransactions;
