import React from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { votingActions } from '../../../redux/actions';

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

  return (
    <>
      <Card className={styles.getCitizenshipCard}>
        <img src={Matte} alt="speaker" />
        <h3>24th June 2021</h3>
        <p>Next Congressional assembly date coming soon</p>
        <Button primary small onClick={handleClick}>View</Button>
      </Card>
    </>
  );
};

export default NextAssemblyCard;
