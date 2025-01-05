import React from 'react';
import PropTypes from 'prop-types';
import styles from '../styles.module.scss';
import ContractItem from '../ContractItem';

function ContractsList({ contracts, isOneItem, isMyContracts }) {
  return (
    <div className={styles.itemsWrapper}>
      {contracts.map((contract, index) => (
        <ContractItem
          // eslint-disable-next-line react/no-array-index-key
          key={contract.contractId + index}
          {...contract}
          isOneItem={isOneItem}
          isMyContracts={isMyContracts}
        />
      ))}
    </div>
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
