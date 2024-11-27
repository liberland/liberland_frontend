import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BN, BN_ZERO } from '@polkadot/util';
import Button from '../../Button/Button';
import TransferWithRemarkModalWrapper from '../../Modals/TransferWithRemarkModal';
import { calculateProperBalance, parseDollars } from '../../../utils/walletHelpers';
import { encodeRemarkUser } from '../../../api/nodeRpcCall';
import { walletSelectors } from '../../../redux/selectors';
import { walletActions } from '../../../redux/actions';

function WrapperTransferWithRemark() {
  const [isOpen, setIsOpen] = useState(false);

  const dispatch = useDispatch();
  const onSubmit = async (data, options) => {
    const transferItem = options.find(((item) => data.select === item.value));
    if (!transferItem) return;
    const { decimals, index, value } = transferItem;
    const {
      project, description: descriptionRemark, category, supplier, recipient, transfer, amountInUsd, finalDestination,
    } = data;

    const remartInfo = {
      project,
      description: descriptionRemark,
      category,
      supplier,
      currency: value,
      date: Date.now(),
      finalDestination,
      amountInUSDAtDateOfPayment: Number(amountInUsd),
    };

    const properBalance = calculateProperBalance(transfer, index, decimals);
    const encodedRemark = await encodeRemarkUser(remartInfo);
    const transferData = { index, balance: properBalance, recipient };
    console.log({ encodedRemark, transferData });

    // example for feature transfers in node rpc

    // const transferWithRemarkOffice = async (remarkInfo, transfer, walletAddress) => {
    //   const api = await getApi();
    //   const remark = makeRemarkExtrinsic(api, remarkInfo);
    //   const transferExtrinsic = makeTransferExtrinsic(api, transfer);
    //   const call = [transferExtrinsic, remark];
    //   const extrinsic = api.tx.utility.batch(call);
    //   const executeOffice = api.tx.office.execute(extrinsic);
    //   return submitExtrinsic(extrinsic, walletAddress, api);
    // };

    // change to proper office wallet action
    // dispatch(walletActions.sendTransferOfficeWithRemark.call({ remarkInfo: encodedRemark, transferData }));
    setIsOpen(false);
  };

  // CHANGE bottom data to get data from officeAccount

  const additionalAssets = useSelector(walletSelectors.selectorAdditionalAssets);
  const balances = useSelector(walletSelectors.selectorBalances);

  const maxUnbond = balances?.liquidAmount?.amount !== '0x0' ? BN.max(
    BN_ZERO,
    new BN(balances?.liquidAmount?.amount ?? 0).sub(parseDollars('2')),
  ) : 0;
  const politipoolLlm = balances?.liberstake?.amount;

  useEffect(() => {
    dispatch(walletActions.getAdditionalAssets.call(true));
    dispatch(walletActions.getWallet.call());
  }, [dispatch]);

  return (
    <>
      <Button primary medium onClick={() => setIsOpen(true)}>
        Transfer With Remark
      </Button>
      {isOpen && (
        <TransferWithRemarkModalWrapper
          closeModal={() => setIsOpen(false)}
          submit={onSubmit}
          additionalAssets={additionalAssets}
          maxUnbond={maxUnbond}
          politipoolLlm={politipoolLlm}
        />
      )}
    </>
  );
}

export default WrapperTransferWithRemark;
