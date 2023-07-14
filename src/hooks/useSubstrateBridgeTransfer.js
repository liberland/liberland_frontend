import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bridgeSelectors } from '../redux/selectors';
import { bridgeActions } from '../redux/actions';
import { bridgeSubscribe } from '../api/nodeRpcCall';

export default function useSubstrateBridgeTransfer(asset, txHash, receipt_id) {
    const dispatch = useDispatch();
    const [unsub, setUnsub] = useState({ unsub: null });
    const transfers = useSelector(bridgeSelectors.toSubstrateTransfers);

    useEffect(() => {
        if (!receipt_id) return;
        let deinitializing = false;

        // FIXME we should go through redux here, but I'm temporarily tired of
        // amount of boilerplate it requires
        (async () => {
            setUnsub(await bridgeSubscribe(asset, receipt_id, (status) => {
                if (deinitializing) return;
                dispatch(bridgeActions.updateTransferStatus.set({ asset, txHash, status }));
            }));
        })();

        return () => {
            deinitializing = true;
            if (unsub.unsubscribe) unsub.unsubscribe();
        };
        // unsub is excluded from deps on purpose, otherwise we'd immediately unsubscribe
    }, [setUnsub, dispatch, asset, receipt_id]);

    return transfers[txHash];
};
