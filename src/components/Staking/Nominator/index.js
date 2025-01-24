import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Button from 'antd/es/button';
import Flex from 'antd/es/flex';
import { useMediaQuery } from 'usehooks-ts';
import { useHistory } from 'react-router-dom';
import Alert from 'antd/es/alert';
import { blockchainSelectors, walletSelectors } from '../../../redux/selectors';
import ValidatorList from './ValidatorList';
import ValidatorListMobile from './ValidatorListMobile';
import { walletActions } from '../../../redux/actions';
import { areArraysSame } from '../../../utils/staking';
import styles from './styles.module.scss';

function Nominator() {
  const dispatch = useDispatch();
  const history = useHistory();

  const walletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);
  const validators = useSelector(walletSelectors.selectorValidators);
  const nominatorTargets = useSelector(walletSelectors.selectorNominatorTargets);

  const [selectedValidatorsAsTargets, setSelectedValidatorsAsTargets] = useState(nominatorTargets);
  const [isListSelectedValidatorsChanged, setIsListSelectedValidatorsChanged] = useState(false);
  const [navigationAction, setNavigationAction] = useState();
  const firstScrollTo = useRef();

  const isMaxNumValidatorsSelected = (selectedValidators) => selectedValidators.length > 15;
  const toggleSelectedValidator = (validatorAddress) => {
    let currentlySelectedValidators = selectedValidatorsAsTargets;
    const selectedValidatorsIncludesAddress = currentlySelectedValidators.includes(validatorAddress);

    if (selectedValidatorsIncludesAddress) {
      currentlySelectedValidators = currentlySelectedValidators.filter((e) => e !== validatorAddress);
    } else if (isMaxNumValidatorsSelected(selectedValidatorsAsTargets)) {
      return;
    } else {
      currentlySelectedValidators.push(validatorAddress);
    }

    setSelectedValidatorsAsTargets([...currentlySelectedValidators]);
  };

  const updateNominations = (newNominatorTargets) => {
    dispatch(walletActions.setNominatorTargets.call({ newNominatorTargets, walletAddress }));
    setNavigationAction(undefined);
  };

  const goToAdvancedPage = () => {
    // eslint-disable-next-line max-len
    const stakingLink = `https://polkadotjs.blockchain.liberland.org/?rpc=${process.env.REACT_APP_NODE_ADDRESS}#/staking`;
    window.open(stakingLink);
  };

  const handleDiscardChanges = () => {
    navigationAction?.();
    setNavigationAction(undefined);
  };

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (isListSelectedValidatorsChanged) {
        event.preventDefault();
        const confirmationMessage = 'Are you sure you want to leave? Your changes will be lost.';
        // eslint-disable-next-line no-param-reassign
        event.returnValue = confirmationMessage;
        return confirmationMessage;
      }
      return null;
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isListSelectedValidatorsChanged]);

  useEffect(() => {
    const unblock = history.block(({ pathname }) => {
      const action = () => {
        unblock();
        history.push(pathname);
      };
      if (!isListSelectedValidatorsChanged) {
        action();
        return true;
      }
      setNavigationAction(() => action);
      return false;
    });
    return unblock;
  }, [history, isListSelectedValidatorsChanged]);

  useEffect(() => {
    setSelectedValidatorsAsTargets([...nominatorTargets]);
  }, [nominatorTargets]);

  useEffect(() => {
    setIsListSelectedValidatorsChanged(
      !areArraysSame([...nominatorTargets], [...selectedValidatorsAsTargets]),
    );
  }, [nominatorTargets, selectedValidatorsAsTargets]);

  useEffect(() => {
    dispatch(walletActions.getValidators.call());
    dispatch(walletActions.getNominatorTargets.call());
  }, [dispatch]);
  const isBiggerThanDesktop = useMediaQuery('(min-width: 1600px)');

  return (
    <Flex vertical gap="20px">
      {navigationAction && (
        <Alert
          type="warning"
          className={styles.alert}
          id="warning"
          ref={(alertRef) => {
            if (alertRef && firstScrollTo.current !== navigationAction) {
              alertRef.nativeElement?.scrollIntoView({
                behavior: 'smooth',
              });
              firstScrollTo.current = navigationAction;
            }
          }}
          message="You have unsaved changes. What would you like to do with them?"
          action={(
            <Flex wrap gap="15px">
              <Button onClick={handleDiscardChanges}>
                Discard
              </Button>
              <Button primary onClick={() => updateNominations(selectedValidatorsAsTargets)}>
                Apply
              </Button>
            </Flex>
          )}
        />
      )}
      {isBiggerThanDesktop ? (
        <ValidatorList
          validators={validators}
          selectedValidatorsAsTargets={selectedValidatorsAsTargets}
          selectingValidatorsDisabled={isMaxNumValidatorsSelected(selectedValidatorsAsTargets)}
          toggleSelectedValidator={toggleSelectedValidator}
          goToAdvancedPage={goToAdvancedPage}
          updateNominations={updateNominations}
        />
      ) : (
        <ValidatorListMobile
          validators={validators}
          selectedValidatorsAsTargets={selectedValidatorsAsTargets}
          selectingValidatorsDisabled={isMaxNumValidatorsSelected(selectedValidatorsAsTargets)}
          toggleSelectedValidator={toggleSelectedValidator}
          goToAdvancedPage={goToAdvancedPage}
          updateNominations={updateNominations}
        />
      )}
    </Flex>
  );
}

export default Nominator;
