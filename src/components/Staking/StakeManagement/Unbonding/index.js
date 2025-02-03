import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { BN_ZERO } from '@polkadot/util';
import Card from 'antd/es/card';
import List from 'antd/es/list';
import { formatDollars } from '../../../../utils/walletHelpers';
import { blockchainSelectors, validatorSelectors } from '../../../../redux/selectors';
import { blockTimeFormatted, stakingInfoToProgress } from '../../../../utils/staking';
import { validatorActions } from '../../../../redux/actions';
import styles from './styles.module.scss';
import OpenModalButton from '../../../Modals/components/OpenModalButton';
import modalWrapper from '../../../Modals/components/ModalWrapper';

function Unbonding({ info }) {
  const dispatch = useDispatch();
  const { stakingInfo, sessionProgress } = useSelector(validatorSelectors.stakingData);
  const blockNumber = useSelector(blockchainSelectors.blockNumber);
  const stakingData = stakingInfoToProgress(stakingInfo, sessionProgress) ?? [];

  useEffect(() => {
    if (info?.unlocking?.length) {
      dispatch(validatorActions.getStakingData.call());
    }
  }, [dispatch, blockNumber, info]);

  if (stakingData.length === 0) {
    return null;
  }

  return (
    <Card
      title="Current unstaking"
      size="small"
      className={styles.unstaking}
    >
      <Card.Meta
        description={stakingInfo?.redeemable?.gt(BN_ZERO)
          ? `${formatDollars(stakingInfo.redeemable)} LLD ready to withdraw`
          : undefined}
      />
      <List
        size="small"
        dataSource={stakingData || []}
        locale={{ emptyText: 'No pending unlock' }}
        renderItem={({
          unlock,
          blocks,
        }) => (
          <List.Item>
            <List.Item.Meta
              title={`${formatDollars(unlock.value)} will unlock in ${blockTimeFormatted(blocks)}`}
            />
          </List.Item>
        )}
      />
    </Card>
  );
}

function ButtonModal(props) {
  return (
    <OpenModalButton text="Show unbonding details" primary {...props} />
  );
}

const UnbondingModal = modalWrapper(Unbonding, ButtonModal);

export default UnbondingModal;

Unbonding.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  info: PropTypes.object.isRequired,
};
