import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import router from '../../router';
import { blockchainSelectors, contractsSelectors } from '../../redux/selectors';

export const useContractItem = ({
  judgesSignaturesList,
  partiesSignaturesList,
  creator,
  parties,
  contractId,
}) => {
  const walletAddress = useSelector(
    blockchainSelectors.userWalletAddressSelector,
  );
  const identitiesContracts = useSelector(
    contractsSelectors.selectorIdentityContracts,
  );
  const isContractSign = judgesSignaturesList?.length > 0 || partiesSignaturesList?.length > 0;
  const isMeSigned = partiesSignaturesList ? partiesSignaturesList.includes(walletAddress) : false;
  const isMeSignedAsJudge = judgesSignaturesList ? judgesSignaturesList.includes(walletAddress) : false;
  const infoContract = useMemo(() => [
    { itemsOrItem: creator, name: 'Creator' },
    { itemsOrItem: parties, name: 'Parties' },
    { itemsOrItem: partiesSignaturesList || [], name: 'Parties Signatures' },
    { itemsOrItem: judgesSignaturesList || [], name: 'Judges Signatures' },
  ], [creator, parties, partiesSignaturesList, judgesSignaturesList]);

  const [title, setTitle] = useState('');
  const routerLinkBase = router.contracts.item.split(':')[0];
  const routerLink = `${routerLinkBase}${contractId}`;

  return {
    identitiesContracts,
    isContractSign,
    isMeSigned,
    isMeSignedAsJudge,
    infoContract,
    title,
    setTitle,
    routerLink,
  };
};
