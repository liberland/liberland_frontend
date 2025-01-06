import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Card from 'antd/es/card';
import Flex from 'antd/es/flex';
import Button from '../../Button/Button';
import truncate from '../../../utils/truncate';
import {
  blockchainSelectors,
} from '../../../redux/selectors';
import { Proposal } from '../../Proposal';
import { walletAddress } from '../../../redux/selectors/congress';
import Voters from '../Voters';

export default function Motion({
  proposal,
  proposalOf,
  voting,
  voteMotion,
  closeMotion,
  membersCount,
  userIsMember,
  isTableRow,
}) {
  const dispatch = useDispatch();
  const userAddress = useSelector(
    blockchainSelectors.userWalletAddressSelector,
  );

  const threshold = voting.threshold.toNumber();

  const isClosable = voting.ayes.length >= threshold;

  const isClosableNaye = voting.nays.length > membersCount - threshold;

  const voteMotionCall = (vote) => {
    const voteMotionData = {
      proposal,
      index: voting.index,
      vote,
    };
    dispatch(voteMotion(voteMotionData));
  };

  return (
    <Card
      actions={userIsMember ? [
        isClosable && (
          <Button
            medium
            primary
            onClick={() => dispatch(
              closeMotion({ proposal, index: voting.index }),
            )}
          >
            Close & Execute
          </Button>
        ),
        !voting.nays.map((v) => v.toString()).includes(userAddress)
          && !isClosable && (
            <Button
              small
              secondary
              onClick={() => voteMotionCall(false)}
            >
              Vote nay
            </Button>
        ),
        isClosableNaye && (
          <Button
            small
            secondary
            onClick={() => dispatch(
              closeMotion({ proposal, index: voting.index, walletAddress }),
            )}
          >
            Close Motion
          </Button>
        ),
      ].filter(Boolean) : []}
    >
      <Card.Meta
        title={(
          <>
            Proposal id:
            <b>{truncate(proposal, 13)}</b>
          </>
        )}
        description={(
          <Flex wrap gap="15px">
            <p>
              Aye
              {' '}
              <b>
                {voting.ayes.length}
                /
                {threshold}
              </b>
            </p>
            <Voters voting={voting.ayes} />
            <p>
              Nay
              {' '}
              <b>
                {voting.nays.length}
                /
                {threshold}
              </b>
            </p>
            <Voters voting={voting.nays} />
          </Flex>
        )}
      />
      <Proposal proposal={proposalOf} isTableRow={isTableRow} />
    </Card>
  );
}

/* eslint-disable react/forbid-prop-types */
Motion.propTypes = {
  proposal: PropTypes.string.isRequired,
  proposalOf: PropTypes.shape({
    args: PropTypes.array.isRequired,
    method: PropTypes.string.isRequired,
    section: PropTypes.string.isRequired,
    toHuman: PropTypes.func.isRequired,
  }).isRequired,
  voting: PropTypes.shape({
    index: PropTypes.object.isRequired,
    threshold: PropTypes.object.isRequired,
    ayes: PropTypes.arrayOf(PropTypes.object).isRequired,
    nays: PropTypes.arrayOf(PropTypes.object).isRequired,
    end: PropTypes.object.isRequired,
  }).isRequired,
  closeMotion: PropTypes.func.isRequired,
  voteMotion: PropTypes.func.isRequired,
  membersCount: PropTypes.number.isRequired,
  isTableRow: PropTypes.bool,
  userIsMember: PropTypes.bool.isRequired,
};
