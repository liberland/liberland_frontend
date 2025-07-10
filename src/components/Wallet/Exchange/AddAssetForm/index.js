import React, { useEffect, useMemo, useState } from 'react';
import Form from 'antd/es/form';
import Flex from 'antd/es/flex';
import Select from 'antd/es/select';
import Spin from 'antd/es/spin';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import Title from 'antd/es/typography/Title';
import { createNewPool } from '../../../../api/nodeRpcCall';
import Button from '../../../Button/Button';
import { walletSelectors, blockchainSelectors } from '../../../../redux/selectors';
import { walletActions, dexActions } from '../../../../redux/actions';
import { ExchangeItemPropTypes } from '../proptypes';
import OpenModalButton from '../../../Modals/components/OpenModalButton';
import modalWrapper from '../../../Modals/components/ModalWrapper';

function AddAssetForm({
  poolsData,
  onClose,
  isStock,
}) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState();

  const dispatch = useDispatch();
  const additionalAssets = useSelector(walletSelectors.selectorAdditionalAssets);
  const walletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);

  useEffect(() => {
    dispatch(walletActions.getWallet.call());
    dispatch(walletActions.getAdditionalAssets.call());
  }, [dispatch]);

  const filtered = useMemo(() => {
    const allOptions = additionalAssets
      ?.reduce((pairings, aAsset, index) => {
        if (isStock === aAsset.isStock) {
          pairings.push(['Native', aAsset]);
        }
        additionalAssets.slice(index + 1).forEach((bAsset) => {
          if (isStock && (aAsset.isStock || bAsset.isStock)) {
            pairings.push([
              aAsset,
              bAsset,
            ]);
          } else if (!isStock && (!aAsset.isStock && !bAsset.isStock)) {
            pairings.push([
              aAsset,
              bAsset,
            ]);
          }
        });
        return pairings;
      }, []);

    const usedPairings = poolsData.map(({
      asset1,
      assetData1,
      asset2,
      assetData2,
    }) => {
      if (asset1 === 'Native') {
        return ['Native', assetData2.symbol];
      } if (asset2 === 'Native') {
        return [assetData1.symbol, 'Native'];
      }
      return [assetData1.symbol, assetData2.symbol];
    }).reduce((pairings, [aAsset, bAsset]) => {
      pairings[aAsset] ||= {};
      pairings[aAsset][bAsset] = true;
      return pairings;
    }, {});

    return allOptions?.reduce((mappedOptions, [aAsset, bAsset]) => {
      if (aAsset === 'Native') {
        if (!usedPairings[aAsset]?.[bAsset.metadata.symbol] && !usedPairings[bAsset.metadata.symbol]?.[aAsset]) {
          mappedOptions[aAsset] ||= {};
          mappedOptions[aAsset][bAsset.metadata.symbol] = [aAsset, bAsset];
          mappedOptions[bAsset.metadata.symbol] ||= {};
          mappedOptions[bAsset.metadata.symbol][aAsset] = [bAsset, aAsset];
        }
      } else if (bAsset === 'Native') {
        if (!usedPairings[aAsset.metadata.symbol]?.[bAsset] && !usedPairings[bAsset]?.[aAsset.metadata.symbol]) {
          mappedOptions[aAsset.metadata.symbol] ||= {};
          mappedOptions[aAsset.metadata.symbol][bAsset] = [aAsset, bAsset];
          mappedOptions[bAsset] ||= {};
          mappedOptions[bAsset][aAsset.metadata.symbol] = [bAsset, aAsset];
        }
      } else if (!usedPairings[aAsset.metadata.symbol]?.[bAsset.metadata.symbol]
        && !usedPairings[bAsset.metadata.symbol]?.[aAsset.metadata.symbol]) {
        mappedOptions[aAsset.metadata.symbol] ||= {};
        mappedOptions[aAsset.metadata.symbol][bAsset.metadata.symbol] = [aAsset, bAsset];
        mappedOptions[bAsset.metadata.symbol] ||= {};
        mappedOptions[bAsset.metadata.symbol][aAsset.metadata.symbol] = [bAsset, aAsset];
      }
      return mappedOptions;
    }, {});
  }, [additionalAssets, poolsData, isStock]);

  const onSubmit = async ({ firstAsset: firstAssetKey, secondAsset: secondAssetKey }) => {
    setLoading(true);
    try {
      const [aAsset, bAsset] = filtered[firstAssetKey][secondAssetKey];
      const getAssetId = (asset) => (
        asset === 'Native'
          ? { Native: 'Native' }
          : { Asset: asset.index.toString() }
      );
      await createNewPool(getAssetId(aAsset), getAssetId(bAsset), walletAddress);
      dispatch(dexActions.getPools.call());
      onClose();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      setLoading(false);
    }
  };

  const keySort = React.useCallback(([aKey], [bKey]) => {
    const aIsNative = aKey === 'Native' ? 1 : -1;
    const bIsNative = bKey === 'Native' ? 1 : -1;
    if (aIsNative === bIsNative) {
      return aKey.localeCompare(bKey);
    }
    return bIsNative - aIsNative;
  }, []);

  const firstAssets = useMemo(() => (
    Object.entries(filtered)
      .filter(([_, values]) => Object.keys(values).length > 0)
      .sort(keySort)
  ), [filtered, keySort]);

  const firstAsset = Form.useWatch('firstAsset', form);

  if (!filtered) {
    return <Spin />;
  }

  return (
    <Form layout="vertical" form={form} onFinish={onSubmit}>
      <Title level={2}>
        Create pool
      </Title>
      <Flex gap="15px" wrap>
        <Form.Item
          label="Select first pool asset"
          name="firstAsset"
          rules={[{ required: true }]}
        >
          <Select>
            <Select.Option value="" />
            {firstAssets.map(([key, value]) => {
              const humanReadableName = key === 'Native'
                ? 'Liberland dollar'
                : Object.values(value)[0][0].metadata.symbol;
              return (
                <Select.Option
                  value={key}
                  key={key}
                >
                  {humanReadableName}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
        {firstAsset && (
          <Form.Item
            label="Select second pool asset"
            name="secondAsset"
            rules={[
              { required: true },
            ]}
          >
            <Select>
              <Select.Option value="" />
              {Object.entries(filtered[firstAsset])
                .sort(keySort)
                .map(([key, value]) => {
                  const humanReadableName = key === 'Native'
                    ? 'Liberland dollar'
                    : value[1].metadata.symbol;
                  return (
                    <Select.Option
                      value={key}
                      key={key}
                    >
                      {humanReadableName}
                    </Select.Option>
                  );
                })}
            </Select>
          </Form.Item>
        )}
      </Flex>
      <Flex gap="15px" wrap>
        <Button type="button" medium onClick={onClose} disabled={loading}>
          Close
        </Button>
        <Button type="submit" medium primary disabled={loading}>
          {loading ? 'Loading...' : 'Create pair'}
        </Button>
      </Flex>
    </Form>
  );
}

AddAssetForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  poolsData: PropTypes.arrayOf(
    PropTypes.shape(ExchangeItemPropTypes).isRequired,
  ).isRequired,
  isStock: PropTypes.bool,
};

function ButtonModal(props) {
  return <OpenModalButton text="Create pool" medium primary {...props} />;
}

const AddAssetModal = modalWrapper(AddAssetForm, ButtonModal);

export default AddAssetModal;
