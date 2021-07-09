/* eslint-disable react/prop-types */
import React, { useCallback, useMemo, useState } from 'react';

import TableComponent from '../TableComponent';
import Button from '../../Button/Button';

import { ReactComponent as CancelIcon } from '../../../assets/icons/cancel.svg';
import styles from './styles.module.scss';

const CurrentCongressionalAssemble = () => {
  const [allCandidatesData, setAllCandidatesData] = useState([
    {
      id: '1',
      deputies: 'John Wayne',
      supported: '10.000 LLM',
      action: 'Vote',
      place: '',
    },
    {
      id: '2',
      deputies: 'Latisha Peacock',
      supported: '9.000 LLM',
      action: 'Vote',
      place: '',
    },
    {
      id: '3',
      deputies: 'Vernon Leonard',
      supported: '8.000 LLM',
      action: 'Vote',
      place: '',
    },
    {
      id: '4',
      deputies: 'Guto Callaghan',
      supported: '6.000 LLM',
      action: 'Vote',
      place: '',
    },
  ]);
  const [selectedCandidatesData, setSelectedCandidatesData] = useState([]);

  const handleVote = useCallback((id) => {
    setAllCandidatesData(allCandidatesData.filter((candidate) => candidate.id !== id));
    setSelectedCandidatesData(
      [
        ...selectedCandidatesData,
        allCandidatesData.find((candidate) => candidate.id === id),
      ],
    );
  }, [selectedCandidatesData, allCandidatesData]);

  const handleCancel = useCallback((id) => {
    setSelectedCandidatesData(selectedCandidatesData.filter((candidate) => candidate.id !== id));
    setAllCandidatesData(
      [
        ...allCandidatesData,
        selectedCandidatesData.find((candidate) => candidate.id === id),
      ],
    );
  }, [allCandidatesData, selectedCandidatesData]);

  const allCandidatesColumns = useMemo(() => [
    {
      Header: 'DEPUTIES',
      accessor: 'deputies',
    },
    {
      Header: 'SUPPORTED',
      accessor: 'supported',
    },
    {
      Header: 'ACTIONS',
      accessor: 'action',
      Cell: ({ cell }) => (
        <Button green onClick={() => handleVote(cell.row.original.id)}>
          {cell.row.original.action}
        </Button>
      ),
    },
  ], [handleVote]);
  const selectedCandidatesColumns = useMemo(() => [
    {
      Header: 'PLACE',
      accessor: 'place',
      Cell: ({ cell }) => `# ${cell.row.index + 1}`,
    },
    {
      Header: 'DEPUTIES',
      accessor: 'deputies',
    },
    {
      Header: 'SUPPORTED',
      accessor: 'supported',
      Cell: ({ cell }) => (
        <>
          {cell.row.values.supported}
          {' '}
          <CancelIcon onClick={() => handleCancel(cell.row.original.id)} />
        </>
      ),
    },
  ], [handleCancel]);

  return (
    <div className={styles.currentAssemble}>
      <TableComponent title="All candidates" data={allCandidatesData} columns={allCandidatesColumns} />
      <TableComponent data={selectedCandidatesData} columns={selectedCandidatesColumns} />
    </div>
  );
};

export default CurrentCongressionalAssemble;
