/* eslint-disable react/prop-types */
import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { votingSelectors } from '../../../redux/selectors';
import { votingActions } from '../../../redux/actions';

import TableComponent from '../TableComponent';
import Button from '../../Button/Button';

import { ReactComponent as CancelIcon } from '../../../assets/icons/cancel.svg';
import styles from './styles.module.scss';

const CurrentCongressionalAssemble = () => {
  const listCandidats = useSelector(votingSelectors.selectorCandidateList);
  const [allCandidatesData, setAllCandidatesData] = useState([]);
  const [selectedCandidatesData, setSelectedCandidatesData] = useState([]);
  const isVotingInProgress = useSelector(votingSelectors.selectorIsVotingInProgress);
  const history = useHistory();

  const dispatch = useDispatch();

  const handleVote = useCallback((id) => {
    setAllCandidatesData(allCandidatesData.filter((candidate) => candidate.id !== id));
    setSelectedCandidatesData(
      [
        ...selectedCandidatesData,
        allCandidatesData.find((candidate) => candidate.id === id),
      ],
    );
    dispatch(votingActions.addCandidacyToElectoralSheet.success([
      ...selectedCandidatesData,
      allCandidatesData.find((candidate) => candidate.id === id),
    ]));
  }, [selectedCandidatesData, allCandidatesData, dispatch]);

  const handleCancel = useCallback((id) => {
    setSelectedCandidatesData(selectedCandidatesData.filter((candidate) => candidate.id !== id));
    setAllCandidatesData(
      [
        ...allCandidatesData,
        selectedCandidatesData.find((candidate) => candidate.id === id),
      ],
    );
    dispatch(votingActions.addCandidacyToElectoralSheet.success([
      ...allCandidatesData,
      selectedCandidatesData.find((candidate) => candidate.id === id),
    ]));
  }, [allCandidatesData, selectedCandidatesData, dispatch]);

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

  const handlerOnClickCastVoting = useCallback(() => {
    dispatch(votingActions.sendElectoralSheet.call({ history }));
  }, [history]);

  useEffect(() => {
    setAllCandidatesData(listCandidats);
  }, [listCandidats]);

  return (
    <div className={styles.currentAssemble}>
      <TableComponent title="All candidates" data={allCandidatesData} columns={allCandidatesColumns} />
      <TableComponent
        title="electoral_sheet"
        data={selectedCandidatesData}
        columns={selectedCandidatesColumns}
        handlerOnClickCastVoting={handlerOnClickCastVoting}
        isVotingInProgress={isVotingInProgress}
      />
    </div>
  );
};

export default CurrentCongressionalAssemble;
