/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Flex from 'antd/es/flex';
import Title from 'antd/es/typography/Title';
import Paragraph from 'antd/es/typography/Paragraph';
import { democracySelectors } from '../../../redux/selectors';
import CurrentAssembly from './CurrentAssembly';
import { democracyActions } from '../../../redux/actions';
import styles from '../styles.module.scss';

function CongressionalAssembly() {
  const dispatch = useDispatch();
  const democracy = useSelector(democracySelectors.selectorDemocracyInfo);

  useEffect(() => {
    dispatch(democracyActions.getDemocracy.call());
  }, [dispatch]);

  return (
    <Flex vertical gap="32px">
      <Title level={2}>
        Acting congressional assembly
      </Title>
      <Paragraph className={styles.paragraph}>
        This menu allows you to delegate your citizen authority to the Liberland Congressional Assembly.
        By selecting this option, you empower the Assembly to act on your behalf in legislative
        matters while retaining the right to rescind delegation at any time.
      </Paragraph>
      <CurrentAssembly
        currentCongressMembers={democracy?.democracy?.currentCongressMembers || []}
      />
    </Flex>
  );
}

export default CongressionalAssembly;
