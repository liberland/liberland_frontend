/* eslint-disable react/prop-types */
import React, { useMemo, useState } from 'react';
import cx from 'classnames';
import Avatar from 'react-avatar';
import TableComponent from '../../Voting/TableComponent';

import { ReactComponent as GreenLike } from '../../../assets/icons/like-green.svg';
import { ReactComponent as RedLike } from '../../../assets/icons/like-red.svg';

import styles from './styles.module.scss';

const PMElection = () => {
  const [data, setData] = useState([
    {
      id: '4',
      vacancy: 'Ministry of Economy and Finance',
      supported: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      candidate: 'John Wayne',
      status: 'pending',
    },
    {
      id: '2',
      vacancy: 'Ministry of Justice',
      supported: [1, 2, 3, 4, 5],
      candidate: 'Latisha Peacock',
      status: 'supported',
    },
    {
      id: '1',
      vacancy: 'Ministry of Health',
      supported: [1, 2, 3, 4],
      candidate: 'Vernon Leonard',
      status: 'declined',
    },
    {
      id: '3',
      vacancy: 'Ministry of Education',
      supported: [1],
      candidate: 'Guto Callaghan',
      status: 'pending',
    },
  ]);

  const onDecline = (id) => {
    setData(data.map((el) => (el.id === id ? { ...el, status: 'declined' } : el)));
  };

  const onSupport = (id) => {
    setData(data.map((el) => (el.id === id ? { ...el, status: 'supported' } : el)));
  };

  const columns = useMemo(
    () => [
      {
        Header: 'VACANCY',
        accessor: 'vacancy',
      },
      {
        Header: 'CANDIDATE',
        accessor: 'candidate',
      },
      {
        Header: 'SUPPORTED',
        accessor: 'supported',
        Cell: ({ cell }) => (
          <div className={styles.avatarWrapper}>
            {cell.row.original.supported.map((el, index, array) => {
              if (index < 4) {
                return <Avatar src={`https://www.w3schools.com/w3css/img_avatar${index + 1}.png`} round size="32px" />;
              }

              if (index === 4) {
                return (
                  <div className={styles.emptyAvatar}>
                    +
                    {array.length - index}
                  </div>
                );
              }
              return null;
            })}
          </div>
        ),
      },
      {
        Header: 'ACTION',
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
                onClick={() => onSupport(cell.row.original.id)}
              >
                <GreenLike />
              </button>
            </div>
          );
        },
      },
    ],
    [data],
  );

  return (
    <TableComponent
      title={`Votes history (${data.length})`}
      data={data}
      columns={columns}
      rowProps={() => { }}
      button="apply"
    />
  );
};

export default PMElection;
