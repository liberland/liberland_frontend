import React from 'react';
import Card from 'antd/es/card';
import PropTypes from 'prop-types';
import Flex from 'antd/es/flex';
import HistoryCopyIconWithAddress from '../../Wallet/HistoryCopyIconWithAddress';
import { formatMerits } from '../../../utils/walletHelpers';
import CurrencyIcon from '../../CurrencyIcon';

const getRankSuffix = (rank) => {
  if (rank === 1) return 'st';
  if (rank === 2) return 'nd';
  if (rank === 3) return 'rd';
  return 'th';
};

function TaxPayerCard({
  index,
  address,
  totalValue,
}) {
  return (
    <Card hoverable>
      <Flex vertical gap="15px">
        <Card.Meta
          description={`${index + 1}${getRankSuffix(index + 1)} Top Tax Payer`}
        />
        <Card.Meta
          title={<HistoryCopyIconWithAddress address={address} />}
        />
        <Flex wrap gap="10px" align="center">
          <div>
            <strong>
              Total Value:
            </strong>
            {' '}
            {formatMerits(totalValue)}
            {' '}
            LLM
          </div>
          <CurrencyIcon size={24} symbol="LLM" />
        </Flex>
      </Flex>
    </Card>
  );
}

TaxPayerCard.propTypes = {
  index: PropTypes.number.isRequired,
  address: PropTypes.string.isRequired,
  totalValue: PropTypes.string.isRequired,
};

export default TaxPayerCard;
