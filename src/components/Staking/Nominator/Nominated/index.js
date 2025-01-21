import React, { useMemo } from 'react';
import Flex from 'antd/es/flex';
import Checkbox from 'antd/es/checkbox';
import uniqueId from 'lodash/uniqueId';
import PropTypes from 'prop-types';
import { useMediaQuery } from 'usehooks-ts';
import classNames from 'classnames';

function Nominated({
  nominatedByMe,
  selectingValidatorsDisabled,
  toggleSelectedValidator,
  address,
}) {
  const isBiggerThanDesktop = useMediaQuery('(min-width: 1600px)');
  const id = useMemo(() => uniqueId('checkbox_'), []);
  return (
    <Flex gap="5px">
      <label htmlFor={id} className={classNames({ 'sr-only': !isBiggerThanDesktop })}>
        Nominated
      </label>
      <Checkbox
        disabled={selectingValidatorsDisabled}
        checked={nominatedByMe}
        onChange={() => toggleSelectedValidator(address)}
        id={id}
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
