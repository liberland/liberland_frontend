import React from 'react';
import PropTypes from 'prop-types';
import List from 'antd/es/list';
import { useSelector } from 'react-redux';
import PoliticanCard from '../PoliticianCard';
import { blockchainSelectors, democracySelectors } from '../../../../redux/selectors';
import DelegateModalWrapper from '../../../Modals/DelegateModal';

function CurrentAssemble({
  currentCongressMembers,
}) {
  const userWalletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);
  const democracy = useSelector(democracySelectors.selectorDemocracyInfo);
  const delegatingTo = democracy.democracy?.userVotes?.Delegating?.target;
  return (
    <List
      dataSource={currentCongressMembers}
      locale={{ emptyText: 'No current assemble' }}
      renderItem={(politician) => (
        <List.Item>
          <PoliticanCard
            politician={politician}
            actions={[
              politician.rawIdentity === userWalletAddress || delegatingTo === politician.rawIdentity ? (
                <div />
              ) : (
                <DelegateModalWrapper
                  delegateAddress={politician.rawIdentity}
                  currentlyDelegatingTo={delegatingTo}
                />
              ),
            ]}
            isElected
          />
        </List.Item>
      )}
    />
  );
}

CurrentAssemble.propTypes = {
  currentCongressMembers: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
  })).isRequired,
};

export default CurrentAssemble;
