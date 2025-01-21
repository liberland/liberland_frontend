import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Popconfirm from 'antd/es/popconfirm';
import { useHistory } from 'react-router-dom';
import { blockchainSelectors, walletSelectors } from '../../../redux/selectors';
import ValidatorList from './ValidatorList';
import { walletActions } from '../../../redux/actions';
import { areArraysSame } from '../../../utils/staking';

function Nominator() {
  const dispatch = useDispatch();
  const history = useHistory();

  const walletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);
  const validators = useSelector(walletSelectors.selectorValidators);
  const nominatorTargets = useSelector(walletSelectors.selectorNominatorTargets);

  const [selectedValidatorsAsTargets, setSelectedValidatorsAsTargets] = useState(nominatorTargets);
  const [isListSelectedValidatorsChanged, setIsListSelectedValidatorsChanged] = useState(false);
  const [navigationAction, setNavigationAction] = useState();

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

  return (
    <>
      <Popconfirm
        open={Boolean(navigationAction)}
        title="You have unsaved changes. What would you like to do with them?"
        onConfirm={() => updateNominations(selectedValidatorsAsTargets)}
        onCancel={handleDiscardChanges}
      />
      <ValidatorList
        validators={validators}
        selectedValidatorsAsTargets={selectedValidatorsAsTargets}
        selectingValidatorsDisabled={isMaxNumValidatorsSelected(selectedValidatorsAsTargets)}
        toggleSelectedValidator={toggleSelectedValidator}
        goToAdvancedPage={goToAdvancedPage}
        updateNominations={updateNominations}
      />
    </>
  );
}

export default Nominator;
