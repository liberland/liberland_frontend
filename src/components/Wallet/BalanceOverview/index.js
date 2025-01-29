import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Row from 'antd/es/row';
import Col from 'antd/es/col';
import Card from 'antd/es/card';
import Avatar from 'antd/es/avatar';
import Flex from 'antd/es/flex';
import Title from 'antd/es/typography/Title';
import { useMediaQuery } from 'usehooks-ts';
import LLD from '../../../assets/icons/lld.svg';
import LLM from '../../../assets/icons/llm.svg';
import { formatDollars, formatMerits } from '../../../utils/walletHelpers';
import SendLLDModal from '../../Modals/SendLLDModal';
import SendLLMModal from '../../Modals/SendLLMModal';
import RequestLLDModal from '../../Modals/RequestLLDModal';
import UnpoolModal from '../../Modals/UnpoolModal';
import PolitipoolLLMModal from '../../Modals/PolitipoolModal';
import styles from './styles.module.scss';

function BalanceOverview({
  balances, liquidMerits, showStaked,
}) {
  const overviewInfo = useMemo(() => (showStaked
    ? [
      {
        amount: formatMerits(balances.liberstake.amount),
        title: 'PolitiPooled LLM',
        currency: 'LLM',
        icon: LLM,
        actions: [
          <UnpoolModal key="unpool" />,
        ],
      },
      {
        amount: formatDollars(balances.polkastake.amount),
        title: 'Validator Staked LLD',
        currency: 'LLD',
        icon: LLD,
      },
    ]
    : []).concat([
    {
      amount: formatMerits(liquidMerits),
      title: 'Liquid LLM',
      currency: 'LLM',
      icon: LLM,
      actions: [
        <SendLLMModal key="send" />,
        <PolitipoolLLMModal key="pool" />,
      ],
    },
    {
      amount: formatDollars(balances.liquidAmount.amount),
      title: 'Liquid LLD',
      currency: 'LLD',
      icon: LLD,
      actions: [
        <SendLLDModal key="send" />,
        <RequestLLDModal key="request" />,
      ],
    },
  ]), [balances.liberstake.amount, balances.liquidAmount.amount, balances.polkastake.amount, liquidMerits, showStaked]);

  const isBiggerThanDesktop = useMediaQuery('(min-width: 1500px)');

  return (
    <Row gutter={[16, 16]}>
      {overviewInfo.map(({
        actions,
        amount,
        title,
        icon,
        currency,
      }) => (
        <Col span={isBiggerThanDesktop ? 6 : 24} key={title}>
          <Card
            size="small"
            className={styles.card}
            actions={[
              <Flex wrap gap="15px" align="start">
                {actions}
              </Flex>,
            ]}
          >
            <Card.Meta
              title={(
                <span className={styles.name}>
                  {title}
                </span>
              )}
            />
            <Flex wrap gap="5px" align="center">
              <Title level={5} className={styles.title}>
                {amount}
              </Title>
              <Avatar size={22} src={icon} alt={currency} />
            </Flex>
          </Card>
        </Col>
      ))}
    </Row>
  );
}

BalanceOverview.defaultProps = {
  totalBalance: '0x0',
  balances: {},
  liquidMerits: 0,
  showStaked: true,
};

BalanceOverview.propTypes = {
  // eslint-disable-next-line
  totalBalance: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  showStaked: PropTypes.bool,
  balances: PropTypes.shape({
    liquidAmount: PropTypes.shape({
      // eslint-disable-next-line react/forbid-prop-types
      amount: PropTypes.object,
    }),
    liberstake: PropTypes.shape({
      amount: PropTypes.number,
    }),
    polkastake: PropTypes.shape({
      amount: PropTypes.number,
    }),
    liquidMerits: PropTypes.shape({
      amount: PropTypes.string,
    }),
  }),
  liquidMerits: PropTypes.string,
};

export default BalanceOverview;
