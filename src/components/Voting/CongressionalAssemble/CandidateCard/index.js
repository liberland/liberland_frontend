import React, { useEffect, useState } from 'react';
import styles from './styles.module.scss';
import liberlandEmblemImage from '../../../../assets/images/liberlandEmblem.svg';
import libertarianTorch from '../../../../assets/images/libertariantorch.png';
import addIcon from '../../../../assets/images/arrow-double-right-green.png';

function CandidateCard({
  politician, selectCandidate,
}) {
  return (
    <div className={styles.politicianCardContainer}>
      <div className={styles.politicianData}>
        <div className={styles.politicianImageContainer}><img src={liberlandEmblemImage} style={{ height: '2rem' }} alt="" /></div>
        <div className={styles.politicianPartyImageContainer}><img src={libertarianTorch} style={{ height: '1.75rem' }} alt="" /></div>
        <div className={styles.politicianDisplayName}>{politician.name}</div>
      </div>
      <div className={styles.selectCandidateContainer} onClick={() => selectCandidate(politician)}>
        <div className={styles.selectCandidateItems}>
          <div className={styles.selectCandidateImageContainer}>
            <img src={addIcon} style={{ height: '1.25rem' }} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CandidateCard;
