import React, { useEffect } from 'react';
import Flex from 'antd/es/flex';
import Row from 'antd/es/row';
import Collapse from 'antd/es/collapse';
import Col from 'antd/es/col';
import { useMediaQuery } from 'usehooks-ts';
import { useDispatch, useSelector } from 'react-redux';
import Slashes from './Slashes';
import Status from './Status';
import NominatedByList from './NominatedByList';
import Stats from './Stats';
import styles from './styles.module.scss';
import { validatorActions } from '../../../redux/actions';
import MoneyCard from '../../MoneyCard';
import { validatorSelectors } from '../../../redux/selectors';
import { valueToBN } from '../../../utils/walletHelpers';
import UpdateCommissionModal from '../../Modals/UpdateCommissionModal';

export default function Overview() {
  const dispatch = useDispatch();
  const info = useSelector(validatorSelectors.info);
  const nominators = useSelector(validatorSelectors.nominators);

  useEffect(() => {
    dispatch(validatorActions.getNominators.call());
  }, [dispatch]);

  const isLargerThanHdScreen = useMediaQuery('(min-width: 1600px)');
  const appliedSlashes = useSelector(validatorSelectors.appliedSlashes);
  const unappliedSlashes = useSelector(validatorSelectors.unappliedSlashes);

  return (
    <Flex vertical gap="20px">
      <Row gutter={16} className={styles.row}>
        <Col span={isLargerThanHdScreen ? 8 : 24}>
          <MoneyCard
            title="My validator status"
            amount={<Status />}
            description={info.isNextSessionValidator && 'Scheduled for next session'}
          />
        </Col>
        <Col span={isLargerThanHdScreen ? 8 : 24}>
          <MoneyCard
            title="Nominated by"
            amount={`${nominators?.length || 0} nominators`}
            description={nominators?.length ? 'See list of nominators below' : undefined}
          />
        </Col>
        <Col span={isLargerThanHdScreen ? 8 : 24}>
          <MoneyCard
            title="Commission"
            amount={`${valueToBN(info?.validator?.commission || 0).div(valueToBN(10000000))}%`}
            description={info?.validator?.blocked ? 'New nominations blocked' : 'Allows new nominations'}
            actions={[
              <UpdateCommissionModal defaultValues={info?.validator} />,
            ]}
          />
        </Col>
      </Row>
      {nominators?.length ? (
        <Collapse
          defaultActiveKey={['by', 'staking']}
          collapsible="icon"
          items={[
            {
              key: 'by',
              label: 'Nominated by',
              children: (
                <NominatedByList />
              ),
            },
            {
              key: 'staking',
              label: 'Staking rewards',
              children: (
                <Stats />
              ),
            },
            (appliedSlashes?.length || unappliedSlashes?.length) && {
              key: 'slash',
              label: 'Slashes',
              children: (
                <Slashes />
              ),
            },
          ].filter(Boolean)}
        />
      ) : null}
    </Flex>
  );
}
