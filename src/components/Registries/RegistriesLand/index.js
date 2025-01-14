import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Collapse from 'antd/es/collapse';
import List from 'antd/es/list';
import { blockchainSelectors, registriesSelectors } from '../../../redux/selectors';
import { registriesActions } from '../../../redux/actions';

function RegistriesLand() {
  const dispatch = useDispatch();
  const registries = useSelector(registriesSelectors.registries);
  const userWalletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);
  useEffect(() => {
    dispatch(registriesActions.getOfficialUserRegistryEntries.call(userWalletAddress));
  }, [dispatch, userWalletAddress]);

  return (
    <Collapse
      defaultActiveKey={['physicalLand', 'metaverseLand']}
      items={[
        {
          key: 'physicalLand',
          label: 'Land In Liberland',
          children: (
            <List
              dataSource={registries?.officialUserRegistryEntries?.land.physical || []}
              renderItem={({ id, data }) => (
                <List.Item>
                  <List.Item.Meta title={id} description={data.data} />
                </List.Item>
              )}
            />
          ),
        },
        {
          key: 'metaverseLand',
          label: 'Land In Metaverse',
          children: (
            <List
              dataSource={registries?.officialUserRegistryEntries?.land.metaverse || []}
              renderItem={({ id, data }) => (
                <List.Item>
                  <List.Item.Meta title={id} description={data.data} />
                </List.Item>
              )}
            />
          ),
        },
      ]}
    />
  );
}

export default RegistriesLand;
