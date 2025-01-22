import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Spin from 'antd/es/spin';
import Collapse from 'antd/es/collapse';
import Flex from 'antd/es/flex';
import Space from 'antd/es/space';
import Title from 'antd/es/typography/Title';
import Paragraph from 'antd/es/typography/Paragraph';
import GlobalOutlined from '@ant-design/icons/GlobalOutlined';
import { blockchainSelectors, validatorSelectors } from '../../../redux/selectors';
import { validatorActions } from '../../../redux/actions';
import StakeManagement from '../StakeManagement';
import Validator from '../Validator';
import Nominator from '../Nominator';
import styles from './styles.module.scss';
import Button from '../../Button/Button';

export default function StakingOverview() {
  const dispatch = useDispatch();
  const info = useSelector(validatorSelectors.info);
  const walletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);
  const validatorLink = 'https://docs.liberland.org/blockchain/for-validators-nominators-and-stakers/run-a-validator';
  const nominatorLink = 'https://docs.liberland.org/blockchain/for-validators-nominators-and-stakers/staking';

  useEffect(() => {
    dispatch(validatorActions.getInfo.call());
  }, [dispatch, walletAddress]);

  if (!info) {
    return <Spin />;
  }

  if (!info.isStakingValidator && !info.stash) {
    return (
      <Flex
        vertical
        align="center"
        justify="center"
        className={styles.splash}
        gap="20px"
      >
        <Flex vertical className={styles.content}>
          <Title level={2} className={styles.title}>
            To get started, please select a staking mode
          </Title>
          <Paragraph className={styles.paragraph}>
            New LLDs are distributed to stakers.
            Nominators are able to stake their LLD,
            whereas Validators act like servers to which the LLD is staked.
            Validators receive rewards for staking (about 15% APY), take a commission,
            and distribute the remaining rewards to the nominators.
          </Paragraph>
          <Flex wrap gap="15px" justify="center">
            <Button
              primary
              onClick={() => {
                window.location.href = nominatorLink;
              }}
            >
              Get started as Nominator
              <Space />
              <GlobalOutlined />
            </Button>
            <Button
              primary
              onClick={() => {
                window.location.href = validatorLink;
              }}
            >
              Get started as Validator
              <Space />
              <GlobalOutlined />
            </Button>
          </Flex>
        </Flex>
      </Flex>
    );
  }

  return (
    <Flex vertical gap="20px">
      <StakeManagement />
      <Collapse
        collapsible="icon"
        defaultActiveKey={['validator', 'nominator']}
        items={[
          info.isStakingValidator && {
            key: 'validator',
            label: 'My validator status',
            children: <Validator />,
          },
          info.stash && {
            key: 'nominator',
            label: 'Nominators',
            children: <Nominator />,
          },
        ].filter(Boolean)}
      />
    </Flex>
  );
}
