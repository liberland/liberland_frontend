import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useHistory } from 'react-router-dom';
import { identityActions, walletActions } from '../../../redux/actions';
import { identitySelectors, walletSelectors } from '../../../redux/selectors';
import { formatDollars } from '../../../utils/walletHelpers';
import ModalRoot from '../../Modals/ModalRoot';
import Card from '../../Card';
import Table from '../../Table';
import stylesPage from '../../../utils/pagesBase.module.scss';
import routes from '../../../router';
import { ReactComponent as UploadIcon } from '../../../assets/icons/upload.svg';
import styles from './styles.module.scss';
import Button from '../../Button/Button';

function PayMe() {
  const dispatch = useDispatch();
  const identity = useSelector(identitySelectors.selectorIdentity);
  const identityIsLoading = useSelector(identitySelectors.selectorIsLoading);
  const transferState = useSelector(walletSelectors.selectorTransferState);
  const [linkData, setLinkData] = useState();
  const { search } = useLocation();
  const history = useHistory();

  useEffect(() => {
    try {
      setLinkData(JSON.parse(window.atob(new URLSearchParams(search).get('data'))));
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  }, [search]);

  useEffect(() => {
    if (linkData?.recipient) {
      dispatch(identityActions.getIdentity.call(linkData.recipient));
    }
  }, [dispatch, linkData]);

  const { info } = identity?.unwrap() || {};
  const displayName = info?.display?.toHuman()?.Raw || linkData?.recipient || 'No name';

  const payRecipient = () => {
    dispatch(
      walletActions.sendTransfer.call({
        recipient: linkData.recipient,
        amount: linkData.amount,
      }),
    );
  };

  return (
    <div className={stylesPage.contentWrapper}>
      <div className={stylesPage.sectionWrapper}>
        <Card className={stylesPage.overviewWrapper} title="Send payment">
          <div className={stylesPage.overViewCard}>
            <div className={styles.payMeContainer}>
              {identityIsLoading && <div>Loading...</div>}
              {linkData && (
                <Table
                  columns={[
                    {
                      Header: 'Payment information',
                      accessor: 'name',
                    },
                    {
                      Header: '',
                      accessor: 'value',
                    },
                  ]}
                  data={[
                    {
                      name: 'Recipient',
                      value: displayName,
                    },
                    {
                      name: 'Amount',
                      value: `${formatDollars(linkData.amount)} LLD`,
                    },
                  ].concat(linkData.note ? [{
                    name: 'Note',
                    value: linkData.note,
                  }] : [])}
                />
              )}
              <Button primary medium type="button" onClick={payRecipient}>
                <div className={styles.icon}>
                  <UploadIcon />
                </div>
                Pay recipient
              </Button>
            </div>
          </div>
        </Card>
      </div>
      {transferState === 'success' && (
        <ModalRoot>
          <div className={styles.successModal}>
            <h2>Transfer successful!</h2>
            <Button
              primary
              medium
              green
              onClick={() => {
                history.push(routes.wallet.overView);
              }}
            >
              Get back to wallet
            </Button>
          </div>
        </ModalRoot>
      )}
    </div>
  );
}

export default PayMe;
