import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registriesSelectors } from '../../../redux/selectors';
import { registriesActions } from '../../../redux/actions';
import CompaniesCard from '../CompaniesCard';

function RegistriesAllCompanies() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(registriesActions.getOfficialRegistryEntries.call());
  }, [dispatch]);

  const allRegistries = useSelector(registriesSelectors.allRegistries);

  if (allRegistries?.officialRegistryEntries && allRegistries.officialRegistryEntries.length < 1) {
    <div>Not Registries..</div>;
  }
  return (
    <CompaniesCard registries={allRegistries} />
  );
}

export default RegistriesAllCompanies;
