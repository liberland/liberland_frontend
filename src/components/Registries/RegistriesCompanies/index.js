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

function InvalidCompany({ id }) {
  return ( <Card title={`ID: ${id}`} className={styles.companyCardContainer}>
    <div className={styles.companyContentContainer}>
      This company's registry data is corrupted. Please contact administration.
    </div>
  </Card>)
}

function RegistriesCompanies() {
  const [expandedDetailsForCompany, setExpandedDetailsForCompany] = useState(null);
  const [isDeleteCompanyModalOpen, setIsDeleteCompanyModalOpen] = useState(false);
  const dispatch = useDispatch();
  const userWalletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);
  useEffect(() => {
    dispatch(registriesActions.getOfficialUserRegistryEntries.call(userWalletAddress));
  }, [dispatch, userWalletAddress]);
  const registries = useSelector(registriesSelectors.registries);

  return (
    <div>
      <NavLink
        to={`${router.registries.companies.create}`}
        className={styles.newCompanyButton}
      >
        <Button
          primary
          medium
        >
          <h3>Register new company</h3>
        </Button>
      </NavLink>
      <Card title="Registered Companies" key="registeredCompanies">
        {registries?.officialUserRegistryEntries?.companies?.registered.map((registeredCompany) => (
          registeredCompany?.invalid ?
          <InvalidCompany key={registeredCompany?.id} id={registeredCompany?.id} />
          :
          <Card
            title={`${registeredCompany?.staticFields[0]?.display}`}
            key={registeredCompany?.id}
            className={styles.companyCardContainer}
          >
            <small>
              Company ID:
              <b>{registeredCompany.id}</b>
            </small>
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
                  to={`${router.registries.companies.home}/edit/${registeredCompany?.id}#registered`}
                >
                  <Button
                    secondary
                    small
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
            {
              isDeleteCompanyModalOpen && (
                <DeleteCompanyModal
                  closeModal={() => { setIsDeleteCompanyModalOpen(false); }}
                  companyId={registeredCompany?.id}
                />
              )
            }
          </Card>
        ))}
      </Card>
      <Card title="Requested Companies" key="requestedCompanies">
        {registries?.officialUserRegistryEntries?.companies?.requested.map((requestedCompany) => (
          requestedCompany?.invalid ?
          <InvalidCompany key={requestedCompany?.id} id={requestedCompany?.id} />
          :
          <Card
            title={`${requestedCompany?.staticFields[0]?.display ?? (requestedCompany.unregister && 'Delete request')}`}
            key={requestedCompany.id}
            className={styles.companyCardContainer}
          >
            <small>
              Company request ID:
              <b>{requestedCompany.id}</b>
            </small>
            <div className={styles.companyContentContainer}>
              <RenderRegistryItemDetails
                mainDataObject={requestedCompany}
                showAll={requestedCompany?.staticFields[0]?.display === expandedDetailsForCompany}
              />
            </div>
            <div className={styles.companyContentEnd}>
              {!requestedCompany.unregister
                && (
                <Button
                  green
                  small
                  onClick={() => setExpandedDetailsForCompany(requestedCompany?.staticFields[0]?.display)}
                  className={styles.buttonSeparation}
                >
                  View details
                </Button>
              )}
              {!requestedCompany.unregister && (
                <NavLink
                  to={`${router.registries.companies.home}/edit/${requestedCompany.id}#requested`}
                >
                  <Button
                    secondary
                    small
                    className={styles.buttonSeparation}
                  >
                    Edit request
                  </Button>
                </NavLink>
              )}
              <Button
                red
                small
                onClick={() => dispatch(
                  registriesActions.cancelCompanyRequest.call({
                    companyId: requestedCompany.id,
                  }),
                )}
                className={styles.buttonSeparation}
              >
                Delete request
              </Button>
            </div>
          </Card>
        ))}
      </Card>
    </div>

  );
}

export default RegistriesCompanies;
