/* eslint-disable react/prop-types */
import React, { useState, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cx from 'classnames';
import { selectUserId } from '../../../redux/selectors/userSelectors';
import ProgressBar from '../../ProgressBar';
import TableComponent from '../../Voting/TableComponent';
import Button from '../../Button/Button';

import { ReactComponent as GreenLike } from '../../../assets/icons/like-green.svg';
import { ReactComponent as RedLike } from '../../../assets/icons/like-red.svg';

import styles from './styles.module.scss';
import ProposalDetailsModal from '../../Modals/ProposalDetailsModal';
import { assemblyActions } from '../../../redux/actions';

const ProposalsVoteTable = ({ currentProposals }) => {
  const dispatch = useDispatch();
  const userId = useSelector(selectUserId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [proposalModalProps, setproposalModalProps] = useState({});

  useEffect(() => {
    dispatch(assemblyActions.updateAllProposals.call());
  }, [dispatch]);

  const handleModalOpen = ({
    proposalName,
    proposalStatus,
    shortDescription,
    threadLink,
    id,
  }) => {
    setIsModalOpen(!isModalOpen);
    setproposalModalProps({
      proposalName,
      proposalStatus,
      shortDescription,
      threadLink,
      id,
    });
  };

  //   {
  //     id: '4',
  //     proposal: 'Create lorem ipsum dolor sit consectet...',
  //     supported: 430,
  //     timeLeft: '72h 52m 48s',
  //     status: 'pending',
  //   },
  //   {
  //     id: '2',
  //     proposal: 'Create lorem ipsum dolor sit consectet...',
  //     supported: 21430,
  //     timeLeft: '72h 52m 48s',
  //     status: 'supported',
  //   },
  //   {
  //     id: '1',
  //     proposal: 'Create lorem ipsum dolor sit consectet...',
  //     supported: 15000,
  //     timeLeft: '72h 52m 48s',
  //     status: 'declined',
  //   },
  //   {
  //     id: '3',
  //     proposal: 'Create lorem ipsum dolor sit consectet...',
  //     supported: 9000,
  //     timeLeft: '72h 52m 48s',
  //     status: 'pending',
  //   },
  // ]);

  const onDecline = (id, docHash) => {
    const decision = 'Decline';
    dispatch(assemblyActions.voteByProposal.call({ docHash, decision }));
  };

  const onSupport = (id, docHash) => {
    const decision = 'Accept';
    dispatch(assemblyActions.voteByProposal.call({ docHash, decision }));
  };

  const columns = useMemo(
    () => [
      {
        Header: 'PROPOSAL',
        accessor: 'proposal',
        Cell: ({ cell }) => (
          <div className={styles.proposalWrapper}>
            <span>
              {cell.row.original.proposalName}
            </span>
            <Button grey nano onClick={() => handleModalOpen(cell.row.original)}>Details</Button>
          </div>
        ),
      },
      {
        Header: 'SUPPORTED',
        accessor: 'supported',
        Cell: ({ cell }) => (
          <div className={styles.supportedWrapper}>
            <span className={styles.supportedProgress}>
              {cell.row.original.currentLlm}
              /
              {cell.row.original.requiredAmountLlm}
              LLM
            </span>
            <ProgressBar
              currentValue={cell.row.original.currentLlm}
              maxValue={cell.row.original.requiredAmountLlm}
            />
          </div>
        ),
      },
      {
        Header: 'TIME LEFT',
        accessor: 'timeLeft',
      },
      {
        Header: 'ACTIONS',
        accessor: 'status',
        Cell: ({ cell }) => {
          if (cell.row.original.status === 'supported') {
            return (
              <span className={cx(styles.status, styles.green)}>
                <GreenLike />
                Supported
              </span>
            );
          }
          if (cell.row.original.status === 'declined') {
            return (
              <span className={cx(styles.status, styles.red)}>
                <RedLike />
                Declined
              </span>
            );
          }

          return (
            <div className={styles.actionButtonsWrapper}>
              <button
                aria-label="Decline"
                type="button"
                className={cx(styles.actionButton, styles.actionButtonRed)}
                onClick={() => onDecline(cell.row.original.id)}
              >
                <RedLike />
              </button>
              <button
                aria-label="Support"
                type="button"
                className={cx(styles.actionButton, styles.actionButtonGreen)}
                onClick={() => onSupport(cell.row.original.id, cell.row.original.docHash)}
              >
                <GreenLike />
              </button>
            </div>
          );
        },
      },
    ],
    [userId, currentProposals],
  );

  const rowProps = (row) => {
    if (row.original.id === `${userId}`) {
      return {
        style: {
          boxShadow: '0 0 0 1px #F1C823',
        },
      };
    }
    return {};
  };
  return (
    <>
      <TableComponent title={`Legislation votes (${currentProposals.length})`} data={currentProposals} columns={columns} rowProps={rowProps} />
      {isModalOpen && (
        <ProposalDetailsModal
          closeModal={handleModalOpen}
          proposalName={proposalModalProps.proposalName}
          proposalStatus={proposalModalProps.proposalStatus}
          shortDescription={proposalModalProps.shortDescription}
          threadLink={proposalModalProps.threadLink}
          proposalId={proposalModalProps.id}
        />
      )}
    </>
  );
};

export default ProposalsVoteTable;
