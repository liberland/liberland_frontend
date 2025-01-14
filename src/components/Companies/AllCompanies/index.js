import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Alert from 'antd/es/alert';
import { registriesSelectors } from '../../../redux/selectors';
import { registriesActions } from '../../../redux/actions';
import CompaniesCard from '../CompaniesCard';

function AllCompanies() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(registriesActions.getOfficialRegistryEntries.call());
  }, [dispatch]);

  const allRegistries = useSelector(registriesSelectors.allRegistries);

  if (!allRegistries.officialRegistryEntries?.length) {
    return (
      <Alert type="info" message="No registries found" />
    );
  }
  return (
    <CompaniesCard registries={allRegistries.officialRegistryEntries} type="all" />
  );
}

export default AllCompanies;
