import { useSelector } from 'react-redux';
import { identitySelectors } from '../../../redux/selectors';
import { formatMerits } from '../../../utils/walletHelpers';
import { useAddIdToContext } from './useAddIdToContext';

function useTransferLLM(proposal) {
  const names = useSelector(identitySelectors.selectorIdentityMotions);
  const accountId = proposal.args[0].toString();
  const value = proposal.args[1];
  const formattedValue = formatMerits(value);
  const symbol = proposal.method === 'sendLlm' ? 'LLM' : 'PolitiPooled LLM';
  const identity = names?.[accountId]?.identity;
  useAddIdToContext(accountId);

  return {
    symbol,
    formattedValue,
    identity,
    accountId,
  };
}

export default useTransferLLM;
