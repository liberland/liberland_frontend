import React from 'react';
import Flex from 'antd/es/flex';
import Button from 'antd/es/button';
import { useMediaQuery } from 'usehooks-ts';
import classNames from 'classnames';
import styles from '../styles.module.scss';

function Copyright() {
  const isBiggerThanSmallScreen = useMediaQuery('(min-width: 768px)');

  return (
    <Flex>
      <div>
        ©2023 Liberland. All rights reserved.
        {!isBiggerThanSmallScreen && <div className={styles.slogan}>To Live and let Live</div>}
      </div>
      {isBiggerThanSmallScreen && (
        <div className={classNames(styles.center, styles.slogan)}>
          To Live and let Live
        </div>
      )}
      <div className={styles.donate}>
        <Button href="https://liberland.org/contribution">
          {isBiggerThanSmallScreen ? 'Donate to Liberland' : 'Donate'}
        </Button>
      </div>
    </Flex>
  );
}

export default Copyright;
