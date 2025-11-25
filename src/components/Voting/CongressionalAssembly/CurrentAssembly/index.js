import React from 'react';
import PropTypes from 'prop-types';
import List from 'antd/es/list';
import { useSelector } from 'react-redux';
import { useMediaQuery } from 'usehooks-ts';
import PoliticanCard from '../PoliticianCard';
import { blockchainSelectors, democracySelectors } from '../../../../redux/selectors';
import DelegateModalWrapper from '../../../Modals/DelegateModal';

function CurrentAssembly({
  currentCongressMembers,
}) {
  const userWalletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);
  const democracy = useSelector(democracySelectors.selectorDemocracyInfo);
  const delegatingTo = democracy.democracy?.userVotes?.Delegating?.target;
  const isLargeScreen = useMediaQuery('(min-width: 1600px)');
  const isVeryLargeScreen = useMediaQuery('(min-width: 1920px)');

  return (
    <List
      dataSource={currentCongressMembers}
      locale={{ emptyText: 'No current assemble' }}
      className="compactList"
      grid={isLargeScreen ? { column: isVeryLargeScreen ? 4 : 2 } : undefined}
      bordered={false}
      renderItem={(politician) => (
        <List.Item>
          <PoliticanCard
            politician={politician}
            actions={[
              politician.rawIdentity !== userWalletAddress && delegatingTo !== politician.rawIdentity && (
                <DelegateModalWrapper
                  delegateAddress={politician.rawIdentity}
                  currentlyDelegatingTo={delegatingTo}
                />
              ),
            ].filter(Boolean)}
          />
        </List.Item>
      )}
    />
  );
}

CurrentAssembly.propTypes = {
  currentCongressMembers: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
  })).isRequired,
};

export default CurrentAssembly;
