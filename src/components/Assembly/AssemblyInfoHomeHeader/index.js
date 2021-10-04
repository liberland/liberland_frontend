import React from 'react';
import { useSelector } from 'react-redux';

import { userSelectors, votingSelectors } from '../../../redux/selectors';

import { ReactComponent as AssemblyYourPlace } from '../../../assets/icons/assembly-your-place.svg';
import { ReactComponent as AssemblyStakedOnYou } from '../../../assets/icons/assemly-staked-on-you.svg';
import { ReactComponent as ArrowGrowUpGreen } from '../../../assets/icons/arrow-grow-up-green.svg';
import { ReactComponent as ArrowGrowDownRed } from '../../../assets/icons/arrow-grow-down-red.svg';

import styles from './styles.module.scss';

const AssemblyInfoHomeHeader = () => {
  const ministryList = useSelector(votingSelectors.selectorMinistersList);
  const passportId = useSelector(userSelectors.selectUserPassportId);
  const currentMinister = ministryList.find((minister) => minister.deputies === passportId);

  return (
    <div className={styles.assemblyInfoWrapper}>
      <div className={styles.infoBox}>
        <AssemblyYourPlace />
        <div className={styles.rightSideInfobox}>
          <p>Your place</p>
          <div>
            { currentMinister && (
            <span>{`${currentMinister.place}/${ministryList.length}`}</span>
            )}
            <ArrowGrowUpGreen />
            <span className={styles.greenGrow}>3</span>
          </div>
        </div>
      </div>
      <div className={styles.infoBox}>
        <AssemblyStakedOnYou />
        <div className={styles.rightSideInfobox}>
          <p>Staked on you</p>
          <div>
            <span>{`${currentMinister?.supported} LLM`}</span>
            <ArrowGrowDownRed />
            <span className={styles.redGrow}>30%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssemblyInfoHomeHeader;
