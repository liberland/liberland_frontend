import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Result from 'antd/es/result';
import Collapse from 'antd/es/collapse';
import Spin from 'antd/es/spin';
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
  const isLoading = useSelector(registriesSelectors.isGetRegistries);
  const getRelevantAssets = useCompanyAssets();
  const getRelevantPools = useTradePools();

  if (isLoading) {
    return <Spin size="large" style={{ display: 'block', margin: '60px auto' }} />;
  }

  if (!allRegistries.officialRegistryEntries?.length) {
    return (
      <Result status="info" title="No registries found" />
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
