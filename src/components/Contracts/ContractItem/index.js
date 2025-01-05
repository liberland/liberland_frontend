import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Card from 'antd/es/card';
import List from 'antd/es/list';
import Paragraph from 'antd/es/typography/Paragraph';
import Markdown from 'markdown-to-jsx';
import router from '../../../router';
import { blockchainSelectors, contractsSelectors } from '../../../redux/selectors';
import Button from '../../Button/Button';
import ButtonsWrapper from '../ButtonsWrapper';
import CopyIconWithAddress from '../../CopyIconWithAddress';

function ContractItem({
  contractId,
  creator,
  data,
  parties,
  isOneItem,
  judgesSignaturesList,
  partiesSignaturesList,
  isMyContracts,
}) {
  const walletAddress = useSelector(
    blockchainSelectors.userWalletAddressSelector,
  );
  const identitiesContracts = useSelector(
    contractsSelectors.selectorIdentityContracts,
  );
  const isContractSign = judgesSignaturesList?.length > 0 || partiesSignaturesList?.length > 0;
  const isMeSigned = partiesSignaturesList ? partiesSignaturesList.includes(walletAddress) : false;
  const isMeSignedAsJudge = judgesSignaturesList ? judgesSignaturesList.includes(walletAddress) : false;
  const infoContract = [
    { itemsOrItem: creator, name: 'Creator' },
    { itemsOrItem: parties, name: 'Parties' },
    { itemsOrItem: partiesSignaturesList || [], name: 'Parties Signatures' },
    { itemsOrItem: judgesSignaturesList || [], name: 'Judges Signatures' },
  ];

  const history = useHistory();
  const title = useState(`Contract id: ${contractId}`);

  const handleClick = (id) => {
    const routerLink = router.contracts.item.split(':')[0];
    history.push(`${routerLink}${id}`);
  };
  return (
    <Card
      extra={!isOneItem ? (
        <Button link onClick={() => handleClick(contractId)}>More</Button>
      ) : null}
      actions={(
        <ButtonsWrapper
          contractId={contractId}
          isContractSign={isContractSign}
          isMeSigned={isMeSigned}
          isMeSignedAsJudge={isMeSignedAsJudge}
          isMyContracts={isMyContracts}
        />
      )}
    >
      <Card.Meta
        title={title}
        description={(
          <Paragraph ellipsis={{ rows: 300 }}>
            <Markdown>{data}</Markdown>
          </Paragraph>
        )}
      />
      <List
        dataSource={infoContract.filter(
          ({ itemsOrItem }) => !Array.isArray(itemsOrItem) || itemsOrItem.length !== 0,
        )}
        renderItem={({ itemsOrItem, name }) => (
          <List.Item>
            <List.Item.Meta
              title={name}
              description={
                Array.isArray(itemsOrItem)
                  ? (
                    <List
                      dataSource={itemsOrItem}
                      renderItem={(item, index) => (
                        <List.Item>
                          <List.Item.Meta
                            title={`${name} ${index + 1}`}
                            description={(
                              <CopyIconWithAddress
                                address={item}
                                name={identitiesContracts[item]?.identity?.name}
                                legal={identitiesContracts[item]?.identity?.legal}
                              />
                            )}
                          />
                        </List.Item>
                      )}
                    />
                  )
                  : (
                    <CopyIconWithAddress
                      address={itemsOrItem}
                      name={identitiesContracts[itemsOrItem]?.identity?.name}
                      legal={identitiesContracts[itemsOrItem]?.identity?.legal}
                    />
                  )
              }
            />
          </List.Item>
        )}
      />
    </Card>
  );
}

ContractItem.defaultProps = {
  isOneItem: false,
  isMyContracts: false,
};

ContractItem.propTypes = {
  isMyContracts: PropTypes.bool,
  contractId: PropTypes.string.isRequired,
  creator: PropTypes.string.isRequired,
  data: PropTypes.string.isRequired,
  parties: PropTypes.arrayOf(PropTypes.string).isRequired,
  isOneItem: PropTypes.bool,
  judgesSignaturesList: PropTypes.arrayOf(PropTypes.string).isRequired,
  partiesSignaturesList: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ContractItem;
