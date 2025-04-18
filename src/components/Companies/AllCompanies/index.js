import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Result from 'antd/es/result';
import Collapse from 'antd/es/collapse';
import { registriesSelectors } from '../../../redux/selectors';
import { registriesActions } from '../../../redux/actions';
import CompaniesCard from '../CompaniesCard';
import { useCompanyAssets, useTradePools } from '../hooks';

function AllCompanies() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(registriesActions.getOfficialRegistryEntries.call());
  }, [dispatch]);

  const allRegistries = useSelector(registriesSelectors.allRegistries);
  const getRelevantAssets = useCompanyAssets();
  const getRelevantPools = useTradePools();

  if (!allRegistries.officialRegistryEntries?.length) {
    return (
      <Result status={404} title="No registries found" />
    );
  }

  return (
    <Collapse
      collapsible="icon"
      defaultActiveKey={['all']}
      items={[{
        key: 'all',
        label: 'Companies',
        children: (
          <CompaniesCard
            registries={allRegistries.officialRegistryEntries}
            type="all"
            getRelevantAssets={getRelevantAssets}
            getRelevantPools={getRelevantPools}
          />
        ),
      }]}
    />
  );
}

export default AllCompanies;
