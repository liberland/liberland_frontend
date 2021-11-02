/* eslint-disable react/prop-types */
import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import cx from 'classnames';
import { selectUserId } from '../../../redux/selectors/userSelectors';
import ProgressBar from '../../ProgressBar';
import TableComponent from '../../Voting/TableComponent';
import Button from '../../Button/Button';

import { ReactComponent as GreenLike } from '../../../assets/icons/like-green.svg';
import { ReactComponent as RedLike } from '../../../assets/icons/like-red.svg';

import styles from './styles.module.scss';
import ProposalDetailsModal from '../../Modals/ProposalDetailsModal';

const VoteHistory = () => {
  const userId = useSelector(selectUserId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [proposalModalProps, setproposalModalProps] = useState({});

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

  const data = useMemo(() => [
    {
      id: '4',
      voterId: '4',
      proposal: 'Create lorem ipsum dolor sit consectet...',
      supported: 430,
      timeLeft: '12 May 2021. 12:34',
      status: 'declined',
    },
    {
      id: '2',
      voteId: '2',
      proposal: 'Create lorem ipsum dolor sit consectet...',
      supported: 21430,
      timeLeft: '12 May 2021. 12:34',
      status: 'supported',
    },
    {
      id: '1',
      voterId: '1',
      proposal: 'Create lorem ipsum dolor sit consectet...',
      supported: 15000,
      timeLeft: '12 May 2021. 12:34',
      status: 'declined',
    },
    {
      id: '3',
      voterId: '3',
      proposal: 'Create lorem ipsum dolor sit consectet...',
      supported: 9000,
      timeLeft: '12 May 2021. 12:34',
      status: 'supported',
    },
  ], []);

  const columns = useMemo(
    () => [
      {
        Header: 'PROPOSAL',
        accessor: 'proposal',
        Cell: ({ cell }) => (
          <div className={styles.proposalWrapper}>
            <span>
              {cell.row.original.proposal}
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
              {cell.row.original.supported}
              /21430 LLM
            </span>
            <ProgressBar currentValue={cell.row.original.supported} maxValue={21430} />
          </div>
        ),
      },
      {
        Header: 'VOTING ENDED',
        accessor: 'timeLeft',
      },
      {
        Header: 'YOUR ACTION',
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

          return null;
        },
      },
    ],
    [userId, data, handleModalOpen],
  );

  const rowProps = (row) => {
    if (row.original.voterId === `${userId}`) {
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
      <TableComponent title={`Votes history (${data.length})`} data={data} columns={columns} rowProps={rowProps} />
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

export default VoteHistory;
