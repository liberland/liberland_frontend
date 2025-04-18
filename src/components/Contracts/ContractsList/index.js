import React from 'react';
import PropTypes from 'prop-types';
import List from 'antd/es/list';
import { useMediaQuery } from 'usehooks-ts';
import ContractListItem from '../ContractListItem';
import { getDefaultPageSizes } from '../../../utils/pageSize';

function ContractsList({ contracts }) {
  const isLargerThanHdScreen = useMediaQuery('(min-width: 1600px)');
  return (
    <List
      dataSource={contracts}
      size="small"
      pagination={getDefaultPageSizes(10)}
      itemLayout={isLargerThanHdScreen ? 'horizontal' : 'vertical'}
      renderItem={(contract) => (
        <ContractListItem
          {...contract}
        />
      )}
    />
  );
}

ContractsList.propTypes = {
  contracts: PropTypes.arrayOf(
    PropTypes.shape({
      contractId: PropTypes.string.isRequired,
      creator: PropTypes.string.isRequired,
      data: PropTypes.string.isRequired,
      parties: PropTypes.arrayOf(PropTypes.string).isRequired,
      judgesSignaturesList: PropTypes.arrayOf(PropTypes.string).isRequired,
      partiesSignaturesList: PropTypes.arrayOf(PropTypes.string).isRequired,
    }),
  ).isRequired,
};

export default ContractsList;
