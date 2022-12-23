import React from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { votingActions } from '../../../redux/actions';

import Tabs from '../../Tabs';
import Button from '../../Button/Button';
import router from '../../../router';
import { ReactComponent as CalendarIcon } from '../../../assets/icons/calendar.svg';
import styles from './styles.module.scss';

const navigationList = [
  {
    route: router.voting.congressionalAssemble,
    title: 'Congressional Assembly',
  },
  {
    route: router.voting.referendum,
    title: 'Referendum',
  },
];
function VotingHeader() {
  const history = useHistory();
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(votingActions.getListOfCandidacy.call());
    history.push(router.voting.currentCongressional.replace(':id', '1'));
  };
  return (
    <>
      <Tabs navigationList={navigationList} />
      <Button primary className={styles.upcomingVotings} onClick={handleClick}>
        <CalendarIcon />
        {' '}
        Upcoming votings
        {' '}
      </Button>
    </>
  );
}

export default VotingHeader;
