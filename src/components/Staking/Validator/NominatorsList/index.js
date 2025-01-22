import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMediaQuery } from 'usehooks-ts';
import List from 'antd/es/list';
import Card from 'antd/es/card';
import Flex from 'antd/es/flex';
import { validatorSelectors } from '../../../../redux/selectors';
import { validatorActions } from '../../../../redux/actions';
import { parseLegal, parseIdentityData } from '../../../../utils/identityParser';
import Table from '../../../Table';
import DisplayUser from '../../DisplayUser';
import Actions from '../Actions';
import styles from './styles.module.scss';

function getNominatorName(identity) {
  const display = parseIdentityData(identity?.display);
  if (display) {
    return display;
  }
  const legal = parseLegal(identity);
  if (legal) {
    return legal;
  }
  return '';
}

export default function NominatorsList() {
  const dispatch = useDispatch();
  const nominators = useSelector(validatorSelectors.nominators);
  const isLargerThanHdScreen = useMediaQuery('(min-width: 1600px)');

  useEffect(() => {
    dispatch(validatorActions.getNominators.call());
  }, [dispatch]);

  const formatted = useMemo(() => nominators.map(({
    address,
    identity,
  }) => ({
    address,
    name: (
      <DisplayUser
        address={isLargerThanHdScreen ? undefined : address}
        displayName={getNominatorName(identity)}
      />
    ),
  })), [isLargerThanHdScreen, nominators]);

  return isLargerThanHdScreen ? (
    <Table
      data={formatted}
      columns={[
        {
          Header: 'Name',
          accessor: 'name',
        },
        {
          Header: 'Address',
          accessor: 'address',
        }, // Here should be date of nomination, not found in the object
      ]}
      footer={<Actions />}
    />
  ) : (
    <Flex vertical gap="20px">
      <List
        dataSource={formatted}
        renderItem={({
          name,
        }) => (
          <Card
            size="small"
            className={styles.card}
            classNames={{
              header: styles.header,
              body: styles.body,
            }}
            title={name}
          />
        )}
      />
      <Actions />
    </Flex>
  );
}
