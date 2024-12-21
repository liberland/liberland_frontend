import { useEffect } from 'react';
import { useMotionContext } from '../../WalletCongresSenate/ContextMotions';

export const useAddIdToContext = (target) => {
  const contextData = useMotionContext();

  useEffect(() => {
    if (target && contextData?.addNewId) {
      contextData.addNewId(target);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);
};
