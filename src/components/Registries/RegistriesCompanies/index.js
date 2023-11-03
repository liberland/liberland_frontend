import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { blockchainSelectors, registriesSelectors } from '../../../redux/selectors';
import Card from '../../Card';
import { registriesActions } from '../../../redux/actions';
import Button from '../../Button/Button';
import styles from './styles.module.scss';
import { RenderRegistryItemDetails } from '../../../utils/registryFormBuilder';
import DeleteCompanyModal from '../../Modals/DeleteCompanyModal';
import router from '../../../router';

function RegistriesCompanies() {
  const [expandedDetailsForCompany, setExpandedDetailsForCompany] = useState(null);
  const [isDeleteCompanyModalOpen, setIsDeleteCompanyModalOpen] = useState(false);
  const dispatch = useDispatch();
  const userWalletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);
  useEffect(() => {
    dispatch(registriesActions.getOfficialUserRegistryEntries.call(userWalletAddress));
  }, [dispatch, registriesActions]);
  const registries = useSelector(registriesSelectors.registries);

  const handleOpenNewCompanyRequestForm = () => {
    dispatch(registriesActions.setRegistryCRUDAction.call({
      registry: 'company',
      action: 'create',
    }));
  };
  const handleOpenEditCompanyForm = (dataObject) => {
    dispatch(registriesActions.setRegistryCRUDAction.call({
      registry: 'company',
      action: 'edit',
      dataObject,
    }));
  };

  return (
    <div>
      <NavLink
        to={`${router.registries.companiesCRUD}`}
        className={styles.newCompanyButton}
      >
        <Button primary large onClick={handleOpenNewCompanyRequestForm}><h3>Register new company</h3></Button>
      </NavLink>
      <Card title="Registered Companies" key="registeredCompanies">
        {registries?.officialUserRegistryEntries?.companies?.registered.map((registeredCompany) => (
          <Card
            title={registeredCompany?.staticFields[0]?.display}
            key={registeredCompany?.staticFields[0]?.display}
            className={styles.companyCardContainer}
          >
            <div className={styles.companyContentContainer}>
              <RenderRegistryItemDetails
                mainDataObject={registeredCompany}
                showAll={registeredCompany?.staticFields[0]?.display === expandedDetailsForCompany}
              />
              <div className={styles.companyContentContainer}>
                <Button
                  green
                  small
                  onClick={() => setExpandedDetailsForCompany(registeredCompany?.staticFields[0]?.display)}
                  className={styles.buttonSeparation}
                >
                  View details
                </Button>
                <NavLink
                  to={`${router.registries.companiesCRUD}`}
                >
                  <Button
                    primary
                    small
                    onClick={() => handleOpenEditCompanyForm(registeredCompany)}
                    className={styles.buttonSeparation}
                  >
                    Request change
                  </Button>
                </NavLink>
                <Button
                  red
                  small
                  onClick={() => setIsDeleteCompanyModalOpen(true)}
                  className={styles.buttonSeparation}
                >
                  Request Deletion
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </Card>
      <Card title="Requested Companies" key="requestedCompanies">
        {registries?.officialUserRegistryEntries?.companies?.requested.map((requestedCompany) => (
          <Card
            title={requestedCompany?.staticFields[0]?.display}
            key={requestedCompany?.staticFields[0]?.display}
            className={styles.companyCardContainer}
          >
            <div className={styles.companyContentContainer}>
              <RenderRegistryItemDetails
                mainDataObject={requestedCompany}
                showAll={requestedCompany?.staticFields[0]?.display === expandedDetailsForCompany}
              />
              <div className={styles.companyContentContainer}>
                <Button
                  green
                  small
                  onClick={() => setExpandedDetailsForCompany(requestedCompany?.staticFields[0]?.display)}
                  className={styles.buttonSeparation}
                >
                  View details
                </Button>
                <Button red small onClick={() => {}} className={styles.buttonSeparation}>Delete request</Button>
              </div>
            </div>
          </Card>
        ))}
      </Card>

      {
      isDeleteCompanyModalOpen && (
        <DeleteCompanyModal
          closeModal={() => { setIsDeleteCompanyModalOpen(false); }}
        />
      )
}
    </div>

  );
}

export default RegistriesCompanies;
