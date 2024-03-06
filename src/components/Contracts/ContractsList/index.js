import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import styles from './styles.module.scss';
import stylesPage from '../../../utils/pagesBase.module.scss';
import Card from '../../Card';
import Button from '../../Button/Button';
import { contractsActions } from '../../../redux/actions';
import { contractsSelectors, blockchainSelectors } from '../../../redux/selectors';
import CopyIconWithAddress from '../../CopyIconWithAddress';

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
            {itemsOrItem.map((item) => (
              <li key={item}>
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

function ContractsList({ contracts }) {
  const walletAddress = useSelector(
    blockchainSelectors.userWalletAddressSelector,
  );
  return (
    <div className={styles.itemsWrapper}>
      {contracts.map((contract) => {
        const {
          contractId,
          creator,
          data,
          judgesSignatures,
          parties,
          partiesSignatures,
        } = contract;

        const isContractSign = judgesSignatures.length > 0 || partiesSignatures.length > 0;
        const isMeSigned = partiesSignatures.includes(walletAddress);
        const isMeSignedAsJudge = judgesSignatures.includes(walletAddress);
        const infoContract = [
          { itemsOrItem: creator, title: 'Creator' },
          { itemsOrItem: parties, title: 'Parties' },
          { itemsOrItem: partiesSignatures, title: 'Parties Signatures' },
          { itemsOrItem: judgesSignatures, title: 'Judges Signatures' },
        ];
        return (
          <Card
            className={cx(stylesPage.overviewWrapper, styles.item)}
            key={contractId}
            title={`Contract ID: ${contractId}`}
          >
            <div className={styles.content}>
              <span className={styles.title}>Content: &nbsp;</span>
              <span>{data}</span>
            </div>
            <div className={styles.dataButtons}>
              <div className={styles.data}>
                {infoContract.map(({ itemsOrItem, title }) => {
                  const isArray = Array.isArray(itemsOrItem);
                  if (isArray && itemsOrItem.length < 1) return null;
                  return (
                    <TextWrapper
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
      })}
    </div>
  );
}

ContractsList.propTypes = {
  contracts: PropTypes.arrayOf(
    PropTypes.shape({
      contractId: PropTypes.string.isRequired,
      creatorId: PropTypes.string.isRequired,
      creator: PropTypes.string.isRequired,
      data: PropTypes.string.isRequired,
      judgesSignatures: PropTypes.arrayOf(PropTypes.string).isRequired,
      parties: PropTypes.arrayOf(PropTypes.string).isRequired,
      partiesSignatures: PropTypes.arrayOf(PropTypes.string).isRequired,
    }),
  ).isRequired,
};

export default ContractsList;
