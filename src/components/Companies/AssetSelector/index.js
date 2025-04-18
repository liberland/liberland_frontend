import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import Flex from 'antd/es/flex';
import Form from 'antd/es/form';
import classNames from 'classnames';
import AutoComplete from '../../AutoComplete';
import { walletSelectors } from '../../../redux/selectors';
import ColorAvatar from '../../ColorAvatar';
import truncate from '../../../utils/truncate';
import styles from './styles.module.scss';

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
  const [initial, setInitial] = useState(value);
  useEffect(() => {
    setInitial((prev) => (prev || value));
  }, [value]);

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
            <div className={styles.value}>
              {truncate(symbol || 'No symbol', 12)}
            </div>
            <div className="description">
              {'ID: '}
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
          <Flex wrap gap="7px" align="center" className={styles.selected}>
            <ColorAvatar size={36} name={symbol || name || 'U'} />
            <Flex vertical gap="2px">
              <strong className={styles.value}>
                {truncate(name || 'Unknown', 15)}
              </strong>
              <div className={classNames('description', styles.description)}>
                {truncate(symbol || 'No symbol', 12)}
                {', ID: '}
                {assetId || 'No ID'}
              </div>
            </Flex>
          </Flex>
        );
      }}
      initialValue={initial}
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
