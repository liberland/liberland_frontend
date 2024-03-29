import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Markdown from 'markdown-to-jsx';
import styles from './styles.module.scss';
import stylesPage from '../../../utils/pagesBase.module.scss';
import Card from '../../Card';
import Button from '../../Button/Button';
import { contractsActions } from '../../../redux/actions';
import { contractsSelectors, blockchainSelectors } from '../../../redux/selectors';
import CopyIconWithAddress from '../../CopyIconWithAddress';
import router from '../../../router';

function TextWrapper({ itemsOrItem, title, isArray }) {
  const identitiesContracts = useSelector(
    contractsSelectors.selectorIdentityContracts,
  );

  return (
    <div className={styles.textWrapper}>
      <span>
        {title}
        : &nbsp;
        {isArray ? (
          <ul className={styles.list}>
            {itemsOrItem.map((item, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <li key={item + index}>
                <CopyIconWithAddress
                  address={item}
                  name={identitiesContracts[item]?.identity}
                />
              </li>
            ))}
          </ul>
        ) : (
          <span>
            <CopyIconWithAddress
              address={itemsOrItem}
              name={identitiesContracts[itemsOrItem]?.identity}
            />
          </span>
        )}
      </span>
    </div>
  );
}

TextWrapper.propTypes = {
  itemsOrItem: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.string,
  ]).isRequired,
  isArray: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
};

function ButtonsWrapper({
  contractId,
  isContractSign,
  isMeSignedAsJudge,
  isMeSigned,
}) {
  const dispatch = useDispatch();
  const isUserJudge = useSelector(contractsSelectors.selectorIsUserJudgde);
  return (
    <div className={styles.buttonsWrapper}>
      {!isMeSigned && (
        <Button
          small
          primary
          onClick={() => dispatch(contractsActions.signContract.call({ contractId }))}
        >
          SIGN AS PARTY
        </Button>
      )}

      {!isMeSignedAsJudge && isUserJudge && (
        <Button
          small
          primary
          onClick={() => dispatch(
            contractsActions.signContractJudge.call({
              contractId,
            }),
          )}
        >
          SIGN AS JUDGE
        </Button>
      )}

      {!isContractSign && (
        <Button
          small
          primary
          onClick={() => dispatch(contractsActions.removeContract.call({ contractId }))}
        >
          REMOVE
        </Button>
      )}
    </div>
  );
}

ButtonsWrapper.propTypes = {
  contractId: PropTypes.string.isRequired,
  isContractSign: PropTypes.bool.isRequired,
  isMeSigned: PropTypes.bool.isRequired,
  isMeSignedAsJudge: PropTypes.bool.isRequired,
};

function ContractItem({
  contractId,
  creator,
  data,
  parties,
  isOneItem,
  judgesSignaturesList,
  partiesSignaturesList,
}) {
  const walletAddress = useSelector(
    blockchainSelectors.userWalletAddressSelector,
  );
  const lines = data.split('\n');
  const truncatedContent = lines.slice(0, 5).join('\n');
  const truncatedContentSlice = truncatedContent.length > 300 ? truncatedContent.slice(0, 300) : truncatedContent;
  const isContractSign = judgesSignaturesList?.length > 0 || partiesSignaturesList?.length > 0;
  const isMeSigned = partiesSignaturesList ? partiesSignaturesList.includes(walletAddress) : false;
  const isMeSignedAsJudge = judgesSignaturesList ? judgesSignaturesList.includes(walletAddress) : false;
  const infoContract = [
    { itemsOrItem: creator, title: 'Creator' },
    { itemsOrItem: parties, title: 'Parties' },
    { itemsOrItem: partiesSignaturesList || [], title: 'Parties Signatures' },
    { itemsOrItem: judgesSignaturesList || [], title: 'Judges Signatures' },
  ];

  const history = useHistory();

  const handleClick = (id) => {
    const routerLink = router.contracts.item.split(':')[0];
    history.push(`${routerLink}${id}`);
  };
  return (
    <Card
      className={cx(stylesPage.overviewWrapper, styles.item)}
      key={contractId}
      title={`Contract ID: ${contractId}`}
    >
      <div className={styles.content}>
        <span className={styles.title}>Content:</span>
        <br />
        <br />
        <Markdown>{isOneItem ? data : truncatedContentSlice}</Markdown>
        {!isOneItem && (
          <div className={styles.buttonMore}>
            <Button green small onClick={() => handleClick(contractId)}>More</Button>
          </div>
        )}
      </div>
      <div className={styles.dataButtons}>
        <div className={styles.data}>
          {infoContract.map(({ itemsOrItem, title }, index) => {
            const isArray = Array.isArray(itemsOrItem);
            if (isArray && itemsOrItem.length < 1) return null;
            return (
              <TextWrapper
                  // eslint-disable-next-line react/no-array-index-key
                key={index + title}
                title={title}
                itemsOrItem={itemsOrItem}
                isArray={isArray}
              />
            );
          })}
        </div>

        <ButtonsWrapper
          isMeSigned={isMeSigned}
          isMeSignedAsJudge={isMeSignedAsJudge}
          contractId={contractId}
          isContractSign={isContractSign}
        />
      </div>
    </Card>
  );
}

ContractItem.defaultProps = {
  isOneItem: false,
};

ContractItem.propTypes = {
  contractId: PropTypes.string.isRequired,
  creator: PropTypes.string.isRequired,
  data: PropTypes.string.isRequired,
  parties: PropTypes.arrayOf(PropTypes.string).isRequired,
  isOneItem: PropTypes.bool,
  judgesSignaturesList: PropTypes.arrayOf(PropTypes.string).isRequired,
  partiesSignaturesList: PropTypes.arrayOf(PropTypes.string).isRequired,
};

function ContractsList({ contracts, isOneItem }) {
  return (
    <div className={styles.itemsWrapper}>
      {contracts.map((contract, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <ContractItem key={contract.contractId + index} {...contract} isOneItem={isOneItem} />
      ))}
    </div>
  );
}

ContractsList.defaultProps = {
  isOneItem: false,
};

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
  isOneItem: PropTypes.bool,
};

export default ContractsList;
