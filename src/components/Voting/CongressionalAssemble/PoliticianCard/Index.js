import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './styles.module.scss';
import liberlandEmblemImage from '../../../../assets/images/liberlandEmblem.svg';
import libertarianTorch from '../../../../assets/images/libertariantorch.png';
import lawIcon from '../../../../assets/images/lawicon.png';

import { useDispatch, useSelector } from 'react-redux';
import { democracyActions } from '../../../../redux/actions';
import { blockchainSelectors, democracySelectors } from '../../../../redux/selectors';
import { DelegateModal } from '../../../Modals';
import { useForm } from 'react-hook-form';
import Button from '../../../Button/Button';

function PoliticanCard({
  politician,
}) {
  const { register, handleSubmit } = useForm();
  const dispatch = useDispatch();
  const [isModalOpenDelegate, setIsModalOpenDelegate] = useState(false);
  const userWalletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);
  const democracy = useSelector(democracySelectors.selectorDemocracyInfo);

  const delegating = democracy.democracy?.userVotes?.Delegating?.target;
  const handleModalOpenDelegate = () => {
    setIsModalOpenDelegate(!isModalOpenDelegate);
  };
  const handleSubmitDelegate = (delegateAddress) => {
    dispatch(democracyActions.delegate.call({ values: { delegateAddress }, userWalletAddress }))
    handleModalOpenDelegate();
  };
  return (
    <div className={styles.politicianCardContainer}>
      <div className={styles.politicianData}>
        <div className={styles.politicianImageContainer}><img src={liberlandEmblemImage} style={{ height: '3rem' }} alt="" /></div>
        <div className={styles.politicianPartyImageContainer}><img src={libertarianTorch} style={{ height: '2.5rem' }} alt="" /></div>
        <div className={styles.politicianDisplayName}>{politician.name}</div>
      </div>
      <div className={styles.politicianVotingPower}>
        <div className={styles.politicianVotingPowerItems}>
          { delegating ? null :
            <div className={styles.buttonWrapper}>
              <Button small primary onClick={handleModalOpenDelegate}>Delegate</Button> 
            </div>
          }
          <div>
            <span className={styles.politicianVotingPowerNumber}>1</span>
            {' '}
            x
            {' '}
          </div>
          <div className={styles.politicianVotingPowerImageContainer}>
            <img src={lawIcon} style={{ height: '2.5rem' }} alt="" />
          </div>
        </div>
      </div>
      {isModalOpenDelegate && (
        <DelegateModal
          closeModal={handleModalOpenDelegate}
          handleSubmit={handleSubmit}
          register={register}
          onSubmitDelegate={handleSubmitDelegate}
          delegateAddress={politician.rawIdentity}
        />
      )}
    </div>
  );
}

PoliticanCard.propTypes = {
  politician: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export default PoliticanCard;
