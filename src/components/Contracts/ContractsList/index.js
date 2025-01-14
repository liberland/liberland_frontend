import React from 'react';
import PropTypes from 'prop-types';
import List from 'antd/es/list';
import Divider from 'antd/es/divider';
import ContractItem from '../ContractItem';

function ContractsList({ contracts, isOneItem, isMyContracts }) {
  return (
    <List
      dataSource={contracts}
      renderItem={(contract) => (
        <>
          <ContractItem
            {...contract}
            isOneItem={isOneItem}
            isMyContracts={isMyContracts}
          />
          <Divider />
        </>
      )}
    />
  );
}

ContractsList.defaultProps = {
  isOneItem: false,
  isMyContracts: false,
};

ContractsList.propTypes = {
  isMyContracts: PropTypes.bool,
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
  isOneItem: PropTypes.bool,
};

export default ContractsList;
