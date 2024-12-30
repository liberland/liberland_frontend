import React from 'react';
import { useSelector } from 'react-redux';
import Title from 'antd/es/typography/Title';
import { officesSelectors } from '../../../redux/selectors';
import CompanyRequest from './CompanyRequest';
import CompanyForm from './CompanyForm';
import CompanyRegistration from './CompanyRegistration';

function CompanyRegistry() {
  const request = useSelector(officesSelectors.selectorCompanyRequest);
  const registration = useSelector(officesSelectors.selectorCompanyRegistration);
  return (
    <>
      <CompanyForm />
      {registration && (
        <>
          <Title level={4}>Currently registered data:</Title>
          <CompanyRegistration registration={registration} />
        </>
      )}
      {request && (
        <>
          <Title level={4}>Request:</Title>
          <CompanyRequest companyRequest={request} />
        </>
      )}
    </>
  );
}

export default CompanyRegistry;
