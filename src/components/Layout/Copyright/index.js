import React from 'react';
import Flex from 'antd/es/flex';
import Button from 'antd/es/button';
import { useMediaQuery } from 'usehooks-ts';
import styles from '../styles.module.scss';

function Copyright() {
  const isBiggerThanSmallScreen = useMediaQuery('(min-width: 992px)');

  return (
    <Flex align="center">
      <div className={styles.copyright}>
        ©2023 Liberland. All rights reserved.
        {!isBiggerThanSmallScreen && <div className={styles.slogan}>To Live and let Live</div>}
      </div>
      {isBiggerThanSmallScreen && (
        <Flex justify="end" align="center" className={styles.slogan}>
          To Live and let Live
        </Flex>
      )}
      <div className={styles.donate}>
        <Button href="https://liberland.org/contribution" className={styles.donateButton}>
          {isBiggerThanSmallScreen ? 'Donate to Liberland' : 'Donate'}
        </Button>
      </div>
    </Flex>
  );
}

export default Copyright;
