import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Result from 'antd/es/result';
import Collapse from 'antd/es/collapse';
import { registriesSelectors } from '../../../redux/selectors';
import { registriesActions } from '../../../redux/actions';
import CompaniesCard from '../CompaniesCard';
import styles from './styles.module.scss';

function AllCompanies() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(registriesActions.getOfficialRegistryEntries.call());
  }, [dispatch]);

  const allRegistries = useSelector(registriesSelectors.allRegistries);

  if (!allRegistries.officialRegistryEntries?.length) {
    return (
      <Result status={404} title="No registries found" />
    );
  }
  return (
    <Collapse
      collapsible="icon"
      defaultActiveKey={['all']}
      className={styles.all}
      items={[{
        key: 'all',
        label: 'Companies',
        children: (
          <CompaniesCard registries={allRegistries.officialRegistryEntries} type="all" />
        ),
      }]}
    />
  );
}

export default AllCompanies;
