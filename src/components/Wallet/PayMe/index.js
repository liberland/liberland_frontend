import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useHistory } from 'react-router-dom';
import Spin from 'antd/es/spin';
import PropTypes from 'prop-types';
import { identityActions, walletActions } from '../../../redux/actions';
import { identitySelectors, walletSelectors } from '../../../redux/selectors';
import { formatDollars } from '../../../utils/walletHelpers';
import Table from '../../Table';
import routes from '../../../router';
import { ReactComponent as UploadIcon } from '../../../assets/icons/upload.svg';
import styles from './styles.module.scss';
import Button from '../../Button/Button';
import modalWrapper from '../../Modals/components/ModalWrapper';

function SuccessModal({ onClose }) {
  const history = useHistory();
  return (
    <div className={styles.successModal}>
      <h2>Transfer successful!</h2>
      <Button
        primary
        medium
        green
        onClick={() => {
          onClose();
          history.push(routes.wallet.overView);
        }}
      >
        Get back to wallet
      </Button>
    </div>
  );
}

SuccessModal.propTypes = {
  onClose: PropTypes.func.isRequired,
};

function PayMe() {
  const dispatch = useDispatch();
  const identity = useSelector(identitySelectors.selectorIdentity);
  const identityIsLoading = useSelector(identitySelectors.selectorIsLoading);
  const transferState = useSelector(walletSelectors.selectorTransferState);
  const [linkData, setLinkData] = useState();
  const { search } = useLocation();

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

  const { info } = (identity && identity.isSome) ? identity.unwrap() : {};
  const displayName = info?.display?.toHuman()?.Raw || linkData?.recipient || 'No name';

  const payRecipient = () => {
    dispatch(
      walletActions.sendTransfer.call({
        recipient: linkData.recipient,
        amount: linkData.amount,
      }),
    );
  };

  if (identityIsLoading || !linkData) {
    return <Spin />;
  }
  const SuccessModalWrapper = modalWrapper(SuccessModal);
  return (
    <>
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
            value: `${linkData?.amount ? formatDollars(linkData.amount) : 0} LLD`,
          },
        ].concat(linkData?.note ? [{
          name: 'Note',
          value: linkData.note,
        }] : [])}
        footer={(
          <Button primary type="button" onClick={payRecipient}>
            <div className={styles.icon}>
              <UploadIcon />
            </div>
            Pay recipient
          </Button>
        )}
      />
      {transferState === 'success' ? (
        <SuccessModalWrapper />
      ) : null}
    </>
  );
}

export default PayMe;
