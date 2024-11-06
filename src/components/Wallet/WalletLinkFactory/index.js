import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import QRCode from 'react-qr-code';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import ModalRoot from '../../Modals/ModalRoot';
import { TextInput } from '../../InputComponents';
import Button from '../../Button/Button';
import { identitySelectors } from '../../../redux/selectors';
import { identityActions } from '../../../redux/actions';
import { formatDollars } from '../../../utils/walletHelpers';
import Table from '../../Table';
import UploadIcon from '../../../assets/icons/upload.svg';
import styles from './styles.module.scss';

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
    dispatch(identityActions.getIdentity.call(walletAddress));
  }, [dispatch, walletAddress]);

  const onSubmit = async ({ amount, note }) => {
    try {
      const data = window.btoa(JSON.stringify({
        amount,
        note,
        walletAddress,
      }));
      const link = `${window.location.protocol}//${window.location.host}/pay-me?data=${data}`;
      const subwalletLink = `https://mobile.subwallet.app/browser?url=${window.encodeURI(link)}`;
      setLinkData({
        amount,
        note,
        link,
        subwalletLink,
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      setError('amount', 'Something went wrong');
    }
  };

  const amount = watch('amount', '');
  const note = watch('note', '');

  if (identityIsLoading) {
    return <div className={styles.form}>Loading...</div>;
  }

  const { info } = identity?.unwrap() || {};
  const displayName = info?.display || walletAddress;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={styles.form}
    >
      {linkData && (
        <Table
          columns={[
            {
              Header: 'Link data',
              accessor: 'name',
            },
            {
              Header: '',
              accessor: 'value',
            },
          ]}
          data={[
            {
              name: 'Link',
              value: linkData.link,
            },
            {
              name: 'QR code',
              value: <QRCode value={linkData.link} />,
            },
            {
              name: 'Subwallet link',
              value: linkData.subwalletLink,
            },
            {
              name: 'QR code',
              value: <QRCode value={linkData.subwalletLink} />,
            },
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
            validate={(input) => (!input || /^-?\d*\.?\d+$/.test(input) ? undefined : 'Invalid amount')}
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
          <TextInput
            register={register}
            id="note"
            name="note"
            value={note}
            className={styles.input}
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
            {isSubmitting ? 'Loading...' : 'Create payment link'}
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
    <div className={styles.modal}>
      <Button primary medium onClick={() => setShow(true)}>
        <UploadIcon />
        {' '}
        Request payment
      </Button>
      {show && (
        <ModalRoot>
          <WalletLinkFactory {...props} onClose={() => setShow(false)} />
        </ModalRoot>
      )}
    </div>
  );
}

export default WalletLinkFactoryModalWrapper;
