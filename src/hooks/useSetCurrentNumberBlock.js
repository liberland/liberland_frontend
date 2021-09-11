import { useDispatch } from 'react-redux';
import { WsProvider } from '@polkadot/api';
import { votingActions } from '../redux/actions';

const { ApiPromise } = require('@polkadot/api');

const useSetCurrentNumberBlock = async () => {
  const provider = new WsProvider(process.env.REACT_APP_NODE_ADDRESS);
  const api = await ApiPromise.create({ provider });
  const dispatch = useDispatch();
  return api.rpc.chain.subscribeNewHeads((header) => {
    dispatch(votingActions.setCurrentBlockNumber.success(header.number));
    // eslint-disable-next-line no-console
    console.log(`Chain is at block: #${header.number}`);
    // eslint-disable-next-line no-console
  }).catch((e) => console.log(e));
};

export default useSetCurrentNumberBlock;
