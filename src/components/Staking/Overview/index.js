import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Spin from 'antd/es/spin';
import Collapse from 'antd/es/collapse';
import { blockchainSelectors, validatorSelectors } from '../../../redux/selectors';
import { validatorActions } from '../../../redux/actions';
import StakeManagement from '../StakeManagement';
import Validator from '../Validator';
import Nominator from '../Nominator';

export default function StakingOverview() {
  const dispatch = useDispatch();
  const info = useSelector(validatorSelectors.info);
  const walletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);

  useEffect(() => {
    dispatch(validatorActions.getInfo.call());
  }, [dispatch, walletAddress]);

  if (!info) {
    return <Spin />;
  }

  return (
    <>
      <StakeManagement />
      <Collapse
        defaultActiveKey={['validator', 'nominator']}
        items={[
          info.isStakingValidator && {
            key: 'validator',
            label: 'Validator',
            children: <Validator />,
          },
          info.stash && {
            key: 'nominator',
            label: 'Nominators',
            children: <Nominator />,
          },
        ].filter(Boolean)}
      />
    </>
  );
}
