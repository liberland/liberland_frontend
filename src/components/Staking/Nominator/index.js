import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import cx from 'classnames';
import styles from './styles.module.scss';
import { blockchainSelectors, walletSelectors } from '../../../redux/selectors';
import ValidatorList from './ValidatorList/ValidatorList';
import Button from '../../Button/Button';
import { walletActions } from '../../../redux/actions';
import stylesPage from '../../../utils/pagesBase.module.scss';
import Card from '../../Card';

function Nominator() {
  const walletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(walletActions.getValidators.call());
    dispatch(walletActions.getNominatorTargets.call());
  }, [dispatch]);

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

  const updateNominations = (newNominatorTargets) => {
    dispatch(walletActions.setNominatorTargets.call({ newNominatorTargets, walletAddress }));
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
    <Card title="Validators" className={cx(stylesPage.overviewWrapper, styles.nominatorWrapper)}>
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
        <Button small primary onClick={() => goToAdvancedPage()}>
          ADVANCED
        </Button>
        <Button
          className={styles.button}
          small
          primary
          onClick={() => updateNominations(selectedValidatorsAsTargets)}
        >
          UPDATE NOMINATIONS
        </Button>
      </div>
    </Card>
  );
}

export default Nominator;
