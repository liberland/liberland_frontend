import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Spin from 'antd/es/spin';
import Collapse from 'antd/es/collapse';
import Flex from 'antd/es/flex';
import Title from 'antd/es/typography/Title';
import Paragraph from 'antd/es/typography/Paragraph';
import { blockchainSelectors, validatorSelectors } from '../../../redux/selectors';
import { validatorActions } from '../../../redux/actions';
import StakeManagement from '../StakeManagement';
import Validator from '../Validator';
import Nominator from '../Nominator';
import styles from './styles.module.scss';
import Button from '../../Button/Button';
import { CreateValidatorModal, StakeLLDModal } from '../../Modals';

export default function StakingOverview() {
  const dispatch = useDispatch();
  const info = useSelector(validatorSelectors.info);
  const walletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);
  const infoLink = 'https://docs.liberland.org/blockchain/for-validators-nominators-and-stakers/staking';

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
        gap="15px"
      >
        <Flex vertical gap="25px" className={styles.content}>
          <Title level={2} className={styles.title}>
            To get started, please select a staking mode
          </Title>
          <Paragraph className={styles.paragraph}>
            New LLDs are distributed to stakers.
            Nominators are able to stake their LLD,
            whereas Validators act like servers to which the LLD is staked.
            Validators receive rewards for staking (about 15% APY), take a commission,
            and distribute the remaining rewards to the nominators. Learn more
            {' '}
            <Button
              href={infoLink}
              link
            >
              here
            </Button>
            .
          </Paragraph>
          <Flex wrap gap="15px" justify="center">
            <StakeLLDModal label="Start staking as nominator" />
            <CreateValidatorModal label="Create validator server" />
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
            label: 'Validators',
            children: <Nominator />,
          },
        ].filter(Boolean)}
      />
    </Flex>
  );
}
