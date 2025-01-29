import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { BN_ZERO } from '@polkadot/util';
import Card from 'antd/es/card';
import List from 'antd/es/list';
import { formatDollars } from '../../../../utils/walletHelpers';
import ModalRoot from '../../../Modals/ModalRoot';
import { blockchainSelectors, validatorSelectors } from '../../../../redux/selectors';
import { blockTimeFormatted, stakingInfoToProgress } from '../../../../utils/staking';
import { validatorActions } from '../../../../redux/actions';
import styles from './styles.module.scss';
import Button from '../../../Button/Button';

function Unbonding({ info }) {
  const dispatch = useDispatch();
  const { stakingInfo, sessionProgress } = useSelector(validatorSelectors.stakingData);
  const blockNumber = useSelector(blockchainSelectors.blockNumber);
  const stakingData = stakingInfoToProgress(stakingInfo, sessionProgress) ?? [];

  useEffect(() => {
    if (info.unlocking.length !== 0) {
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

export default function UnbondingModalWrapper(props) {
  const [show, setShow] = useState();
  return (
    <>
      <Button onClick={() => setShow(true)}>
        Show unbonding details
      </Button>
      {show && (
        <ModalRoot onClose={() => setShow(false)}>
          <Unbonding {...props} />
        </ModalRoot>
      )}
    </>
  );
}

Unbonding.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  info: PropTypes.object.isRequired,
};
