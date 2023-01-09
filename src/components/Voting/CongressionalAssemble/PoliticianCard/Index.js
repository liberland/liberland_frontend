import React from 'react';
import styles from './styles.module.scss';
import liberlandEmblemImage from '../../../../assets/images/liberlandEmblem.svg';
import libertarianTorch from '../../../../assets/images/libertariantorch.png';
import lawIcon from '../../../../assets/images/lawicon.png';

function PoliticanCard({
  politician,
}) {
  return (
    <div className={styles.politicianCardContainer}>
      <div className={styles.politicianData}>
        <div className={styles.politicianImageContainer}><img src={liberlandEmblemImage} style={{ height: '3rem' }} alt="" /></div>
        <div className={styles.politicianPartyImageContainer}><img src={libertarianTorch} style={{ height: '2.5rem' }} alt="" /></div>
        <div className={styles.politicianDisplayName}>{politician.name}</div>
      </div>
      <div className={styles.politicianVotingPower}>
        <div className={styles.politicianVotingPowerItems}>
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
    </div>
  );
}

export default PoliticanCard;
