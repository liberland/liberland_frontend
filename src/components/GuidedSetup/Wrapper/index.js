import React from 'react';
import PropTypes from 'prop-types';
import Flex from 'antd/es/flex';
import Card from 'antd/es/card/Card';
import styles from './styles.module.scss';

export function GuidedSetupWrapper({ children }) {
  return (
    <Flex justify="center" align="center" className={styles.wrapper}>
      <Card>
        {children}
      </Card>
    </Flex>
  );
}

GuidedSetupWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

export default GuidedSetupWrapper;
