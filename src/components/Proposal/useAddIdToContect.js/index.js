import { useEffect } from 'react';
import { useMotionContext } from '../../WalletCongresSenate/ContextMotions';

export const useAddIdToContext = (target) => {
  const { addNewId } = useMotionContext();

  useEffect(() => {
    if (target && addNewId) {
      addNewId(target);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);
};
