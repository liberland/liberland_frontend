import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Card from 'antd/es/card';
import List from 'antd/es/list';
import { blockchainSelectors, registriesSelectors } from '../../../redux/selectors';
import { registriesActions } from '../../../redux/actions';

function RegistriesOverview() {
  const dispatch = useDispatch();
  const userWalletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);
  useEffect(() => {
    dispatch(registriesActions.getOfficialUserRegistryEntries.call(userWalletAddress));
  }, [dispatch, userWalletAddress]);
  const registries = useSelector(registriesSelectors.registries);

  return (
    <div>
      <Card>
        <Card.Meta
          title="Companies"
          description={(
            <List
              dataSource={[
                {
                  name: 'Registered companies',
                  count: registries?.officialUserRegistryEntries?.companies?.registered?.length || 0,
                },
                {
                  name: 'Requested companies',
                  count: registries?.officialUserRegistryEntries?.companies?.requested?.length || 0,
                },
                {
                  name: 'Plots of physical land',
                  count: 0,
                },
                {
                  name: 'Plots of Metaverse land',
                  count: 0,
                },
                {
                  name: 'Assets',
                  count: 0,
                },
                {
                  name: 'Other NFTs',
                  count: 0,
                },
              ]}
              renderItem={({ name, count }) => (
                <List.Item>
                  <List.Item.Meta title={name} description={count} />
                </List.Item>
              )}
            />
          )}
        />
      </Card>
    </div>
  );
}

export default RegistriesOverview;
