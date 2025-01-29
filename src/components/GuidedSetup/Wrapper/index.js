import React from 'react';
import PropTypes from 'prop-types';
import Flex from 'antd/es/flex';
import modalWrapper from '../../Modals/components/ModalWrapper';

export function GuidedSetupWrapper({ children }) {
  return (
    <Flex justify="center" align="center">
      {children}
    </Flex>
  );
}

GuidedSetupWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

const GuidedSetupModal = modalWrapper(GuidedSetupWrapper);

export default GuidedSetupModal;
