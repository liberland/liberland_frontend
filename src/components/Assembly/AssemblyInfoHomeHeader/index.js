import React from 'react';

import { ReactComponent as AssemblyYourPlace } from '../../../assets/icons/assembly-your-place.svg';
import { ReactComponent as AssemblyStakedOnYou } from '../../../assets/icons/assemly-staked-on-you.svg';
import { ReactComponent as ArrowGrowUpGreen } from '../../../assets/icons/arrow-grow-up-green.svg';
import { ReactComponent as ArrowGrowDownRed } from '../../../assets/icons/arrow-grow-down-red.svg';

import styles from './styles.module.scss';

const AssemblyInfoHomeHeader = () => (
  <div className={styles.assemblyInfoWrapper}>
    <div className={styles.infoBox}>
      <AssemblyYourPlace />
      <div className={styles.rightSideInfobox}>
        <p>Your place</p>
        <div>
          <span>7/29</span>
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
          <span>2101 LLM</span>
          <ArrowGrowDownRed />
          <span className={styles.redGrow}>30%</span>
        </div>
      </div>
    </div>
  </div>
);

export default AssemblyInfoHomeHeader;
