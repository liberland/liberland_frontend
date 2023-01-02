import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import styles from './styles.module.scss';
import { blockchainSelectors, walletSelectors } from '../../../redux/selectors';
import SearchBar from '../../SearchBar';
import ValidatorCard from './ValidatorCard/ValidatorCard';
import ValidatorList from './ValidatorList/ValidatorList';
import { ReactComponent as GraphIcon } from '../../../assets/icons/graph.svg';
import Button from '../../Button/Button';
import { setNewNominatorTargets } from '../../../api/nodeRpcCall';

function Nominator({
  testProp,
}) {
  const userWalletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);

  const validators = useSelector(walletSelectors.selectorValidators);
  const nominatorTargets = useSelector(walletSelectors.selectorNominatorTargets);
  const [selectedValidatorsAsTargets, setSelectedValidatorsAsTargets] = useState(nominatorTargets);
  const isMaxNumValidatorsSelected = (selectedValidators) => selectedValidators.length > 15;
  const toggleSelectedValidator = (validatorAddress) => {
    console.log('toggling selected validator');
    let currentlySelectedValidators = selectedValidatorsAsTargets;
    if (currentlySelectedValidators.includes(validatorAddress)) {
      currentlySelectedValidators = currentlySelectedValidators.filter((e) => e !== validatorAddress);
    } else if (isMaxNumValidatorsSelected(selectedValidatorsAsTargets)) {
      // max num of validators nominated, do not add more
      return;
    } else {
      currentlySelectedValidators.push(validatorAddress);
    }
    console.log('currentlySelectedValidators');
    console.log(currentlySelectedValidators);
    setSelectedValidatorsAsTargets([...currentlySelectedValidators]);
  };

  const [searchTerm, setSearchTerm] = useState(null);

  const updateNominations = (newNominations) => {
    console.log('updating nominations');
    console.log(newNominations);
    setNewNominatorTargets(newNominations, userWalletAddress);
  };

  const goToAdvancedPage = () => {
    const stakingLink = `https://polkadot.js.org/apps/?rpc=${process.env.REACT_APP_NODE_ADDRESS}#/staking`;
    window.open(stakingLink);
  };
  /*
  * TODO mynominations#/maxnominations
  * TODO validator oversubscribed or not
  *
  * */

  return (
    <div className={styles.nominatorWrapper}>
      <div className={styles.nominatorsList}>
        {/* <SearchBar
          setSearchTerm={setSearchTerm}
        /> */}
        <ValidatorList
          validators={validators}
          selectedValidatorsAsTargets={selectedValidatorsAsTargets}
          selectingValidatorsDisabled={isMaxNumValidatorsSelected(selectedValidatorsAsTargets)}
          toggleSelectedValidator={toggleSelectedValidator}
        />
      </div>
      <div className={styles.updateNominationsContainer}>
        <div>
          <Button small primary onClick={() => goToAdvancedPage()}>
            Advanced
          </Button>
        </div>
        <div>
          <Button large primary onClick={() => updateNominations(selectedValidatorsAsTargets)}>
            Update Nominations
          </Button>
        </div>
      </div>
    </div>
  );
}

Nominator.defaultProps = {
  testProp: 'test',
};

Nominator.propTypes = {
  testProp: PropTypes.string,
};

export default Nominator;
