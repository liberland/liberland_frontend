import { useMemo } from 'react';

const useProposerList = (crossReferencedList, isProposer = false) => {
  const proposersList = useMemo(
    () => {
      const newMapedList = crossReferencedList.map((proposal) => {
        const list = proposal.centralizedDatas.map((item) => item.proposerAddress);
        return isProposer ? [proposal.proposer, ...list] : [...list];
      });
      return newMapedList.flat();
    },
    [crossReferencedList],
  );
  return proposersList;
};

export default useProposerList;
