import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Collapse from 'antd/es/collapse';
import {
  blockchainSelectors,
  registriesSelectors,
} from '../../../redux/selectors';
import { registriesActions } from '../../../redux/actions';
import CompaniesCard from '../CompaniesCard';

function CompaniesOverview() {
  const dispatch = useDispatch();
  const userWalletAddress = useSelector(
    blockchainSelectors.userWalletAddressSelector,
  );
  const registries = useSelector(registriesSelectors.registries);

  useEffect(() => {
    dispatch(
      registriesActions.getOfficialUserRegistryEntries.call(userWalletAddress),
    );
  }, [dispatch, userWalletAddress]);

  return (
    <Collapse
      defaultActiveKey={['registered', 'requested']}
      items={[
        {
          label: 'My registered companies',
          key: 'registered',
          children: (
            <CompaniesCard
              type="mine"
              registries={registries?.officialUserRegistryEntries?.companies?.registered || []}
              hideOwner
            />
          ),
        },
        {
          label: 'My requested companies',
          key: 'requested',
          children: (
            <CompaniesCard
              type="requested"
              registries={registries?.officialUserRegistryEntries?.companies?.requested || []}
              hideOwner
            />
          ),
        },
      ]}
    />
  );
}

export default CompaniesOverview;
