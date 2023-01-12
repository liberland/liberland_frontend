import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import styles from './styles.module.scss';
import { blockchainSelectors, walletSelectors } from '../../../redux/selectors';
import ValidatorList from './ValidatorList/ValidatorList';
import Button from '../../Button/Button';
import { setNewNominatorTargets } from '../../../api/nodeRpcCall';

function Nominator() {
  const userWalletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);

  const validators = useSelector(walletSelectors.selectorValidators);
  const nominatorTargets = useSelector(walletSelectors.selectorNominatorTargets);
  const [selectedValidatorsAsTargets, setSelectedValidatorsAsTargets] = useState(nominatorTargets);
  const isMaxNumValidatorsSelected = (selectedValidators) => selectedValidators.length > 15;
  const toggleSelectedValidator = (validatorAddress) => {
    let currentlySelectedValidators = selectedValidatorsAsTargets;
    if (currentlySelectedValidators.includes(validatorAddress)) {
      currentlySelectedValidators = currentlySelectedValidators.filter((e) => e !== validatorAddress);
    } else if (isMaxNumValidatorsSelected(selectedValidatorsAsTargets)) {
      // max num of validators nominated, do not add more
      return;
    } else {
      currentlySelectedValidators.push(validatorAddress);
    }
    setSelectedValidatorsAsTargets([...currentlySelectedValidators]);
  };

  const updateNominations = (newNominations) => {
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
