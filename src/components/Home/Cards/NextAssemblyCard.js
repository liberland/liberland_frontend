import React from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { votingActions } from '../../../redux/actions';

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

  const dateOfElections = new Date(useSelector(blockchainSelectors.startElectionsAssemblySelector));
  const options = {
    year: 'numeric', month: 'long', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit',
  };
  return (
    <>
      <Card className={styles.getCitizenshipCard}>
        <img src={Matte} alt="speaker" />
        <h3>{new Intl.DateTimeFormat('en-US', options).format(dateOfElections)}</h3>
        <p>Next Congressional assembly date coming soon</p>
        <Button primary small onClick={handleClick}>View</Button>
      </Card>
    </>
  );
};

export default NextAssemblyCard;
