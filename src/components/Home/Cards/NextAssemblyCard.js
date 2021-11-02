import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { blockchainActions, votingActions } from '../../../redux/actions';

import { blockchainSelectors } from '../../../redux/selectors';
import Card from '../../Card';
import Button from '../../Button/Button';

import Matte from '../../../assets/icons/matte.png';
import styles from './styles.module.scss';
import router from '../../../router';

const NextAssemblyCard = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(votingActions.getListOfCandidacy.call());
    history.push(router.voting.currentCongressional.replace(':id', '1'));
  };
  // eslint-disable-next-line max-len
  const startElectionTimestamp = useSelector(blockchainSelectors.startFromGenesisElectionsAssemblySelector);
  const endElectionTimestamp = useSelector(blockchainSelectors.endElectionsAssemblySelector);
  const currentElectionBlock = useSelector(blockchainSelectors.electionsBlockSelector);
  const nextElectionTimestamp = useSelector(blockchainSelectors.nextElectionsTimeStampSelector);
  const dateOfElections = new Date(startElectionTimestamp);
  const options = {
    year: 'numeric', month: 'long', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit',
  };
  useEffect(() => {
    const timerId = setInterval(() => {
      if (new Date() > endElectionTimestamp) {
        dispatch(blockchainActions.updateDateElections.call());
      }
    }, 6000);
    return (() => {
      clearInterval(timerId);
    });
  }, [endElectionTimestamp, currentElectionBlock]);
  return (
    <>
      <Card className={styles.getCitizenshipCard}>
        <img src={Matte} alt="speaker" />
        <h3>{new Intl.DateTimeFormat('en-US', options).format(dateOfElections)}</h3>
        <p>
          Next Congressional assembly date
          { new Intl.DateTimeFormat('en-US', options).format(nextElectionTimestamp)}
        </p>
        <Button primary small onClick={handleClick}>View</Button>
      </Card>
    </>
  );
};

export default NextAssemblyCard;
