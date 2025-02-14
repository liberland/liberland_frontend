import React, { useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import Row from 'antd/es/row';
import Col from 'antd/es/col';
import { useMediaQuery } from 'usehooks-ts';
import LLD from '../../../assets/icons/lld.svg';
import LLM from '../../../assets/icons/llm.svg';
import { formatDollars, formatMerits } from '../../../utils/walletHelpers';
import SendLLDModal from '../../Modals/SendLLDModal';
import RequestLLDModal from '../../Modals/RequestLLDModal';
import SendLLMModalWrapper from '../../Modals/SendLLMModal';
import UnpoolLLMModalWrapper from '../../Modals/UnpoolModal';
import PolitipoolLLMModalWrapper from '../../Modals/PolitipoolModal';
import MoneyCard from '../../MoneyCard';
import Button from '../../Button/Button';
import router from '../../../router';

function BalanceOverview({
  balances, liquidMerits, showStaked, isCongress,
}) {
  const history = useHistory();
  const overviewInfo = useMemo(() => [
    {
      amount: formatDollars(balances.liquidAmount.amount, false, 2),
      title: 'Liquid LLD',
      currency: 'LLD',
      icon: LLD,
      actions: [
        <SendLLDModal key="send" />,
        <RequestLLDModal key="request" />,
      ],
    },
    showStaked && {
      amount: formatDollars(balances.polkastake.amount, false, 2),
      title: 'Validator Staked LLD',
      currency: 'LLD',
      icon: LLD,
      actions: [
        <Button primary onClick={() => history.push(router.staking.overview)}>
          Stake
        </Button>,
      ],
    },
    {
      amount: formatMerits(liquidMerits, false, 2),
      title: 'Liquid LLM',
      currency: 'LLM',
      icon: LLM,
      actions: [
        <SendLLMModalWrapper key="send" />,
        <PolitipoolLLMModalWrapper key="pool" />,
      ],
    },
    showStaked && {
      amount: formatMerits(balances.liberstake.amount, false, 2),
      title: 'PolitiPooled LLM',
      currency: 'LLM',
      icon: LLM,
      actions: [
        <UnpoolLLMModalWrapper key="unpool" />,
      ],
    },
  ].filter(Boolean), [
    balances.liberstake.amount,
    balances.liquidAmount.amount,
    balances.polkastake.amount,
    liquidMerits,
    showStaked,
    history,
  ]);

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
          <MoneyCard
            actions={isCongress ? undefined : actions}
            amount={amount}
            alt={currency}
            icon={icon}
            title={title}
          />
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
  isCongress: PropTypes.bool,
};

export default BalanceOverview;
