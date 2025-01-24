import React from 'react';
import Flex from 'antd/es/flex';
import Checkbox from 'antd/es/checkbox';
import PropTypes from 'prop-types';
import styles from './styles.module.scss';

function Nominated({
  nominatedByMe,
  selectingValidatorsDisabled,
  toggleSelectedValidator,
  address,
}) {
  return (
    <Flex gap="10px" align="center">
      <Checkbox
        disabled={selectingValidatorsDisabled}
        checked={nominatedByMe}
        onChange={() => toggleSelectedValidator(address)}
        className={styles.checkbox}
      />
    </Flex>
  );
}

Nominated.propTypes = {
  address: PropTypes.string.isRequired,
  toggleSelectedValidator: PropTypes.func.isRequired,
  nominatedByMe: PropTypes.bool,
  selectingValidatorsDisabled: PropTypes.bool,
};

export default Nominated;
