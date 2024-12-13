import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useMediaQuery } from 'usehooks-ts';
import QRCode from 'react-qr-code';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import ModalRoot from '../../../Modals/ModalRoot';
import { TextInput, TextArea } from '../../../InputComponents';
import Button from '../../../Button/Button';
import { identitySelectors } from '../../../../redux/selectors';
import { identityActions } from '../../../../redux/actions';
import { formatDollars, parseDollars } from '../../../../utils/walletHelpers';
import Table from '../../../Table';
import { ReactComponent as DocumentsIcon } from '../../../../assets/icons/documents.svg';
import router from '../../../../router';
import styles from './styles.module.scss';
import CopyLink from '../CopyLink';

function WalletLinkFactory({
  onClose,
  walletAddress,
}) {
  const {
    handleSubmit,
    register,
    setValue,
    watch,
    setError,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm({
    mode: 'onChange',
  });

  const dispatch = useDispatch();
  const identity = useSelector(identitySelectors.selectorIdentity);
  const identityIsLoading = useSelector(identitySelectors.selectorIsLoading);
  const [linkData, setLinkData] = React.useState();

  React.useEffect(() => {
    if (walletAddress) {
      dispatch(identityActions.getIdentity.call(walletAddress));
    }
  }, [dispatch, walletAddress]);

  const onSubmit = async ({ amount, note }) => {
    try {
      const realAmount = parseDollars(amount).toString();
      const data = window.btoa(JSON.stringify({
        amount: realAmount,
        note,
        recipient: walletAddress,
      }));
      const link = `${window.location.protocol}//${window.location.host}${router.wallet.payMe}?data=${data}`;
      const subwalletLink = `https://mobile.subwallet.app/browser?url=${window.encodeURIComponent(link)}`;
      const edgeLink = `https://deep.edge.app/pay/liberland/${walletAddress}?amount=${realAmount}`;
      setLinkData({
        amount: realAmount,
        note,
        link,
        subwalletLink,
        edgeLink,
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      setError('amount', 'Something went wrong');
    }
  };

  const amount = watch('amount', '');
  const note = watch('note', '');
  const isLargerThanTable = useMediaQuery('(min-width: 768px)');

  if (identityIsLoading) {
    return <div className={styles.form}>Loading...</div>;
  }

  const { info } = identity?.unwrap() || {};
  const displayName = info?.display?.toHuman()?.Raw || walletAddress || 'No name';
  const submitText = linkData ? 'Update payment link' : 'Create payment link';

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={styles.form}
    >
      {linkData && (
        <div>
          {isLargerThanTable ? (
            <div className={styles.tableContainer}>
              <Table
                columns={[
                  {
                    Header: 'Link',
                    accessor: 'name',
                  },
                  {
                    Header: '',
                    accessor: 'value',
                  },
                  {
                    Header: 'QR code',
                    accessor: 'qr',
                  },
                ]}
                data={[
                  {
                    name: 'Direct link',
                    value: <CopyLink link={linkData.link} />,
                    qr: <QRCode value={linkData.link} />,
                  },
                  {
                    name: 'Subwallet link',
                    value: <CopyLink link={linkData.subwalletLink} />,
                    qr: <QRCode value={linkData.subwalletLink} />,
                  },
                  {
                    name: 'Edge link',
                    value: <CopyLink link={linkData.edgeLink} />,
                    qr: <QRCode value={linkData.edgeLink} />,
                  },
                ]}
              />
            </div>
          ) : (
            <div className={styles.listContainer}>
              <h2>Payment links</h2>
              <ul>
                <li>
                  Direct:
                  {' '}
                  <CopyLink link={linkData.link} />
                </li>
                <li>
                  Subwallet:
                  {' '}
                  <CopyLink link={linkData.subwalletLink} />
                </li>
                <li>
                  Edge:
                  {' '}
                  <CopyLink link={linkData.edgeLink} />
                </li>
              </ul>
              <h2>Payment QR codes</h2>
              <ul>
                <li>
                  Direct:
                  {' '}
                  <QRCode value={linkData.link} />
                </li>
                <li>
                  Subwallet:
                  {' '}
                  <QRCode value={linkData.subwalletLink} />
                </li>
                <li>
                  Edge:
                  {' '}
                  <QRCode value={linkData.edgeLink} />
                </li>
              </ul>
            </div>
          )}
          <div className={styles.tableContainer}>
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
                  value: `${formatDollars(linkData.amount, true)} LLD`,
                },
              ].concat(linkData.note ? [{
                name: 'Note',
                value: linkData.note,
              }] : [])}
            />
          </div>
        </div>
      )}
      <label className={styles.wrapper} htmlFor="amount">
        Requested payment amount in LLD
        <div className={styles.inputWrapper}>
          <TextInput
            id="amount"
            register={register}
            name="amount"
            errorTitle="Amount"
            value={amount}
            className={styles.input}
            onChange={(event) => setValue('amount', event.target.value)}
            validate={(input) => (!input || /^\d*\.?\d+$/.test(input) ? undefined : 'Invalid amount')}
            disabled={isSubmitting}
            placeholder="LLD"
            required
          />
        </div>
        {errors.amount && (
          <div className={styles.error}>
            {errors.amount.message}
          </div>
        )}
      </label>
      <label className={styles.wrapper} htmlFor="note">
        Note (optional)
        <div className={styles.inputWrapper}>
          <TextArea
            register={register}
            id="note"
            name="note"
            value={note}
            className={styles.textarea}
            onChange={(event) => setValue('note', event.target.value)}
            disabled={isSubmitting}
          />
        </div>
      </label>
      <div className={styles.buttonRow}>
        <div className={styles.closeForm}>
          <Button disabled={isSubmitting} medium onClick={onClose}>
            Close
          </Button>
        </div>
        <div>
          <Button
            primary
            medium
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Loading...' : submitText}
          </Button>
        </div>
      </div>
    </form>
  );
}

WalletLinkFactory.propTypes = {
  onClose: PropTypes.func.isRequired,
  walletAddress: PropTypes.string.isRequired,
};

function WalletLinkFactoryModalWrapper(props) {
  const [show, setShow] = React.useState();
  return (
    <>
      <Button className={styles.button} primary small onClick={() => setShow(true)}>
        <div className={styles.requestIcon}>
          <DocumentsIcon />
        </div>
        REQUEST LLD
      </Button>
      {show && (
        <ModalRoot>
          <WalletLinkFactory {...props} onClose={() => setShow(false)} />
        </ModalRoot>
      )}
    </>
  );
}

export default WalletLinkFactoryModalWrapper;
