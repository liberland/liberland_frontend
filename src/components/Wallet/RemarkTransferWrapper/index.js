import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { BN, BN_ZERO } from '@polkadot/util';
import { calculateProperBalance, parseDollars } from '../../../utils/walletHelpers';
import { walletActions } from '../../../redux/actions';
import { encodeRemarkUser } from '../../../api/nodeRpcCall';
import { walletSelectors } from '../../../redux/selectors';
import TransferWithRemarkForm from '../../Modals/TransferWithRemarkModal';
import modalWrapper from '../../Modals/components/ModalWrapper';
import OpenModalButton from '../../Modals/components/OpenModalButton';

function RemarkTransferWrapper({ onClose }) {
  const dispatch = useDispatch();
  const onSubmit = async (data, options) => {
    const transferItem = options.find(((item) => data.select === item.value));
    if (!transferItem) return;
    const { decimals, index } = transferItem;

    const {
      description, id, recipient, select, transfer,
    } = data;

    const remartInfo = {
      description, id: Number(id), recipient, select, transfer,
    };

    const properBalance = calculateProperBalance(transfer, index, decimals);
    const encodedRemark = await encodeRemarkUser(remartInfo);
    const transferData = { index, balance: properBalance, recipient };
    dispatch(walletActions.sendTransferRemark.call({ remarkInfo: encodedRemark, transferData }));
    onClose();
  };

  const additionalAssets = useSelector(walletSelectors.selectorAdditionalAssets);
  const balances = useSelector(walletSelectors.selectorBalances);
  const maxUnbond = BN.max(
    BN_ZERO,
    new BN(balances?.liquidAmount?.amount ?? 0).sub(parseDollars('2')),
  );
  const politipoolLlm = balances?.liberstake?.amount;
  useEffect(() => {
    dispatch(walletActions.getAdditionalAssets.call(true));
    dispatch(walletActions.getWallet.call());
  }, [dispatch]);

  return (
    <TransferWithRemarkForm
      onClose={onClose}
      userRemark
      submit={onSubmit}
      additionalAssets={additionalAssets}
      maxUnbond={maxUnbond}
      politipoolLlm={politipoolLlm}
    />
  );
}

RemarkTransferWrapper.propTypes = {
  onClose: PropTypes.func.isRequired,
};

function ButtonModal(props) {
  return <OpenModalButton text="Transfer remark" {...props} />;
}

const RemarkTransferModal = modalWrapper(RemarkTransferWrapper, ButtonModal);

export default RemarkTransferModal;
