import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import Card from 'antd/es/card';
import List from 'antd/es/list';
import Title from 'antd/es/typography/Title';
import Paragraph from 'antd/es/typography/Paragraph';
import Markdown from 'markdown-to-jsx';
import router from '../../../router';
import { blockchainSelectors, contractsSelectors } from '../../../redux/selectors';
import ButtonsWrapper from '../ButtonsWrapper';
import CopyIconWithAddress from '../../CopyIconWithAddress';
import { deriveAndHideContractTitle } from './utils';

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

  const [title, setTitle] = useState(`Contract id: ${contractId}`);
  const routerLinkBase = router.contracts.item.split(':')[0];
  const routerLink = `${routerLinkBase}${contractId}`;

  return (
    <Card
      title={<Title level={1}>{title}</Title>}
      extra={!isOneItem ? (
        <NavLink to={routerLink}>
          More
        </NavLink>
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
        description={(
          <Paragraph
            ref={(p) => deriveAndHideContractTitle(p, title, setTitle)}
            ellipsis={isOneItem ? undefined : {
              rows: 5,
            }}
          >
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
