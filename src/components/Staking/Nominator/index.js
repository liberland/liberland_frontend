import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useMediaQuery } from 'usehooks-ts';
import { useHistory } from 'react-router-dom';
import Alert from 'antd/es/alert';
import Flex from 'antd/es/flex';
import Modal from 'antd/es/modal';
import WarningTwoTone from '@ant-design/icons/WarningTwoTone';
import { blockchainSelectors, walletSelectors } from '../../../redux/selectors';
import ValidatorList from './ValidatorList';
import ValidatorListMobile from './ValidatorListMobile';
import { identityActions, walletActions } from '../../../redux/actions';
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

  useEffect(() => {
    dispatch(identityActions.getIdentityMotions.call(
      validators.map(({ accountId }) => accountId.toString()),
    ));
  }, [validators, dispatch]);

  const isBiggerThanDesktop = useMediaQuery('(min-width: 1600px)');

  return (
    <Flex vertical gap="20px">
      <Modal
        open={Boolean(navigationAction)}
        title="Are you certain you want to leave?"
        onOk={() => updateNominations(selectedValidatorsAsTargets)}
        onCancel={handleDiscardChanges}
        okText="Update nominations"
        cancelText="Cancel and leave"
      >
        Your nominations haven&#96;t been saved, would you like to save them?
      </Modal>
      {!selectedValidatorsAsTargets?.length && (
        <Alert
          icon={<WarningTwoTone twoToneColor={['#243F5F', 'transparent']} />}
          showIcon
          type="warning"
          message={(
            <>
              In order to receive staking rewards you need to nominate at least one validator.
              See the list of active validators below.
            </>
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
