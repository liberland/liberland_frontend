import React, { useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import Flex from 'antd/es/flex';
import Form from 'antd/es/form';
import AutoComplete from '../../AutoComplete';
import { walletSelectors } from '../../../redux/selectors';
import ColorAvatar from '../../ColorAvatar';
import truncate from '../../../utils/truncate';

export default function AssetSelector({
  form,
  name,
  label,
  prefix,
}) {
  const additionalAssets = useSelector(
    walletSelectors.selectorAdditionalAssets,
  );
  const mapped = useMemo(() => additionalAssets?.map(({ index, metadata }) => ({
    id: index?.toString(),
    symbol: metadata.symbol,
    name: metadata.name,
  })), [additionalAssets]);
  const value = Form.useWatch([prefix, ...name], form);
  const initialValue = useRef(value);

  return (
    <AutoComplete
      empty="No assets exist"
      form={form}
      keys={['id', 'symbol', 'name']}
      name={name}
      label={label}
      placeholder="Select related asset"
      // eslint-disable-next-line no-shadow
      renderOption={({ id, symbol, name }) => ({
        label: (
          <Flex wrap gap="7px" align="center">
            <ColorAvatar size={24} name={symbol || name || 'U'} />
            <div className="description">
              {truncate(symbol || 'No symbol', 5)}
              {', ID: '}
              {id || 'No ID'}
            </div>
          </Flex>
        ),
        value: id,
      })}
      renderSelected={(assetId, options) => {
        // eslint-disable-next-line no-shadow
        const { symbol, name } = options.find(({ id }) => id === assetId) || {};
        return (
          <Flex wrap gap="7px" align="center">
            <ColorAvatar size={40} name={symbol || name || 'U'} />
            <Flex vertical gap="7px">
              <div className="description">
                {truncate(symbol || 'No symbol', 5)}
                {', ID: '}
                {assetId || 'No ID'}
              </div>
              <strong>
                {truncate(name || 'Unknown', 15)}
              </strong>
            </Flex>
          </Flex>
        );
      }}
      initialValue={initialValue.current}
      options={mapped}
      prefix={prefix}
    />
  );
}

AssetSelector.propTypes = {
  form: PropTypes.shape({}).isRequired,
  name: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.number.isRequired])).isRequired,
  label: PropTypes.string.isRequired,
  prefix: PropTypes.string,
};
