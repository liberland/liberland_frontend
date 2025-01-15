import React from 'react';
import PropTypes from 'prop-types';
import List from 'antd/es/list';
import { useMediaQuery } from 'usehooks-ts';
import ContractListItem from '../ContractListItem';
import styles from './styles.module.scss';

function ContractsList({ contracts, isMyContracts }) {
  const isLargerThanTable = useMediaQuery('(min-width: 1600px)');
  return (
    <List
      dataSource={contracts}
      className={styles.contracts}
      bordered
      size="small"
      pagination={{ pageSize: 10 }}
      itemLayout={isLargerThanTable ? 'horizontal' : 'vertical'}
      renderItem={(contract) => (
        <ContractListItem
          {...contract}
          isMyContracts={isMyContracts}
        />
      )}
    />
  );
}

ContractsList.defaultProps = {
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
};

export default ContractsList;
