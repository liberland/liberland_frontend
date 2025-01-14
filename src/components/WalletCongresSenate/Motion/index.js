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
import ProposalTable from '../../Proposal/ProposalTable';
import styles from './styles.module.scss';

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
      title={(
        <>
          Proposal id:
          <b>{truncate(proposal, 13)}</b>
        </>
      )}
      className={styles.fullWidth}
      actions={userIsMember ? [
        <Flex wrap gap="15px" justify="start" className={styles.actions}>
          {isClosable && (
            <Button
              primary
              onClick={() => dispatch(
                closeMotion({ proposal, index: voting.index }),
              )}
            >
              Close & Execute
            </Button>
          )}
          {!voting.nays.map((v) => v.toString()).includes(userAddress)
            && !isClosable && (
              <Button
                onClick={() => voteMotionCall(false)}
                red
              >
                Vote nay
              </Button>
          )}
          {!voting.ayes.map((v) => v.toString()).includes(userAddress)
            && !isClosable && (
              <Button
                onClick={() => voteMotionCall(true)}
                green
              >
                Vote aye
              </Button>
          )}
          {isClosableNaye && (
            <Button
              onClick={() => dispatch(
                closeMotion({ proposal, index: voting.index, walletAddress }),
              )}
              primary
            >
              Close Motion
            </Button>
          )}
        </Flex>,
      ] : []}
    >
      <Card.Meta
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
            <p>
              Nay
              {' '}
              <b>
                {voting.nays.length}
                /
                {threshold}
              </b>
            </p>
          </Flex>
        )}
      />
      <Flex vertical gap="15px">
        <Proposal proposal={proposalOf} isTableRow={isTableRow} />
        <Flex wrap gap="15px">
          <Card size="small" title="Voted aye">
            <Voters voting={voting.ayes} />
          </Card>
          <Card size="small" title="Voted nay">
            <Voters voting={voting.nays} />
          </Card>
        </Flex>
        <ProposalTable />
      </Flex>
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
