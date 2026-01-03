/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Flex from 'antd/es/flex';
import Title from 'antd/es/typography/Title';
import Paragraph from 'antd/es/typography/Paragraph';
import Link from 'antd/es/typography/Link';
import { democracySelectors } from '../../../redux/selectors';
import CurrentAssembly from './CurrentAssembly';
import { democracyActions } from '../../../redux/actions';
import Information from './Information';
import styles from '../styles.module.scss';

function CongressionalAssembly() {
  const dispatch = useDispatch();
  const democracy = useSelector(democracySelectors.selectorDemocracyInfo);

  useEffect(() => {
    dispatch(democracyActions.getDemocracy.call());
  }, [dispatch]);

  return (
    <Flex vertical gap="24px">
      <Title level={2}>
        Congress
      </Title>
      <Paragraph className={styles.paragraph}>
        Current congress members.
        Congress sets the budgets and passes legislation,
        which needs to be confirmed via public referendum.
        You can delegate your referendum votes to a congress member.
        Learn more
        {' '}
        <Link href="https://docs.liberland.org/blockchain/for-citizens/become-congressmen">
          here
        </Link>
        .
      </Paragraph>
      <CurrentAssembly
        currentCongressMembers={democracy?.democracy?.currentCongressMembers || []}
      />
      <Information />
    </Flex>
  );
}

export default CongressionalAssembly;
