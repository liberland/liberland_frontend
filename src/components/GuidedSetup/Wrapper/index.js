import React from 'react';
import PropTypes from 'prop-types';
import Flex from 'antd/es/flex';
import ModalRoot from '../../Modals/ModalRoot';

export function GuidedSetupWrapper({ children }) {
  return (
    <ModalRoot>
      <Flex justify="center" align="center">
        {children}
      </Flex>
    </ModalRoot>
  );
}

GuidedSetupWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};
