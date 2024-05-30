import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import cx from 'classnames';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';
import styles from './styles.module.scss';
import { blockchainSelectors, walletSelectors } from '../../../redux/selectors';
import ValidatorList from './ValidatorList/ValidatorList';
import Button from '../../Button/Button';
import { walletActions } from '../../../redux/actions';
import stylesPage from '../../../utils/pagesBase.module.scss';
import Card from '../../Card';
import AgreeDisagreeModal from '../../Modals/AgreeDisagreeModal';
import ModalRoot from '../../Modals/ModalRoot';
import stylesModal from '../../Modals/styles.module.scss';
import { areArraysSame } from '../../../utils/staking';

function Nominator() {
  const dispatch = useDispatch();
  const history = useHistory();

  const walletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);
  const validators = useSelector(walletSelectors.selectorValidators);
  const nominatorTargets = useSelector(walletSelectors.selectorNominatorTargets);

  const [selectedValidatorsAsTargets, setSelectedValidatorsAsTargets] = useState(nominatorTargets);
  const [isListSelectedValidatorsChanged, setIsListSelectedValidatorsChanged] = useState(false);
  const [isSideBlocked, setIsSideBlocked] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [navigationToLeave, setNavigationToLeave] = useState(null);

  const isMaxNumValidatorsSelected = (selectedValidators) => selectedValidators.length > 15;
  const toggleSelectedValidator = (validatorAddress) => {
    if (isMaxNumValidatorsSelected(selectedValidatorsAsTargets)) return;

    let currentlySelectedValidators = selectedValidatorsAsTargets;
    const selectedValidatorsIncludesAddress = currentlySelectedValidators.includes(validatorAddress);

    if (selectedValidatorsIncludesAddress) {
      currentlySelectedValidators = currentlySelectedValidators.filter((e) => e !== validatorAddress);
    } else {
      currentlySelectedValidators.push(validatorAddress);
    }

    setSelectedValidatorsAsTargets([...currentlySelectedValidators]);
  };

  const updateNominations = (newNominatorTargets) => {
    dispatch(walletActions.setNominatorTargets.call({ newNominatorTargets, walletAddress }));
    setIsModalOpen(false);
  };

  const goToAdvancedPage = () => {
    // eslint-disable-next-line max-len
    const stakingLink = `https://polkadotjs.blockchain.liberland.org/?rpc=${process.env.REACT_APP_NODE_ADDRESS}#/staking`;
    window.open(stakingLink);
  };
  /*
  * TODO mynominations#/maxnominations
  * TODO validator oversubscribed or not
  *
  * */

  const handleDiscardChanges = () => {
    setIsModalOpen(false);
    history.push(navigationToLeave);
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
    let unblock;

    if (isSideBlocked && isListSelectedValidatorsChanged) {
      unblock = history.block((location) => {
        setNavigationToLeave(location.pathname);
        setIsModalOpen(true);
        setIsSideBlocked(false);
        return false;
      });
    }

    return () => {
      if (unblock) {
        unblock();
      }
    };
  }, [history, isListSelectedValidatorsChanged, isSideBlocked]);

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
      {isModalOpen
      && (
      <ModalRoot>
        <AgreeDisagreeModal
          text="You have unsaved changes. What would you like to do with them?"
          buttonLeft="Discard"
          buttonRight="Update"
          style={stylesModal.getCitizenshipModal}
          onDisagree={handleDiscardChanges}
          onAgree={() => updateNominations(selectedValidatorsAsTargets)}
        >
          <span />
        </AgreeDisagreeModal>
      </ModalRoot>
      )}

      <Card title="Validators" className={cx(stylesPage.overviewWrapper, styles.nominatorWrapper)}>
        <div className={styles.nominatorsList}>
          {/* <SearchBar
          setSearchTerm={setSearchTerm}
        /> */}
          <div className={styles.updateNominationsContainer}>
            <Button
              className={styles.button}
              small
              primary
              onClick={() => updateNominations(selectedValidatorsAsTargets)}
            >
              UPDATE NOMINATIONS
            </Button>
          </div>
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
    </>
  );
}

export default Nominator;
