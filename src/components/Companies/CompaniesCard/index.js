import React, { useState } from 'react';

import PropTypes from 'prop-types';
import { RenderRegistryItemDetails } from '../../../utils/registryFormBuilder';
import Card from '../../Card';
import Button from '../../Button/Button';
import styles from './styles.module.scss';
import stylesPage from '../../../utils/pagesBase.module.scss';

function InvalidCompany({ id }) {
  return (
    <Card title={`ID: ${id}`} className={styles.companyCardContainer}>
      <div className={styles.companyContentContainer}>
        This company&apos;s registry data is corrupted. Please contact administration.
      </div>
    </Card>
  );
}

InvalidCompany.propTypes = {
  id: PropTypes.string.isRequired,
};

function CompaniesCard({ registries }) {
  const [expandedDetailsForCompany, setExpandedDetailsForCompany] = useState(null);
  return (
    <div className={stylesPage.gapFlex}>
      {registries?.officialRegistryEntries?.map((registeredCompany) => (
        registeredCompany?.invalid
          ? <InvalidCompany key={registeredCompany?.id} id={registeredCompany?.id} />
          : (
            <Card
              className={stylesPage.overviewWrapper}
              title={registeredCompany?.staticFields[0]?.display}
            >
              <div
                key={registeredCompany?.id}
                className={stylesPage.transactionHistoryCard}
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
                </div>
                <Button
                  green
                  small
                  onClick={() => setExpandedDetailsForCompany(registeredCompany?.staticFields[0]?.display)}
                  className={styles.buttonSeparation}
                >
                  View details
                </Button>
              </div>
            </Card>
          )
      ))}
    </div>
  );
}

CompaniesCard.propTypes = {
  registries: PropTypes.shape({
    // eslint-disable-next-line react/forbid-prop-types
    officialRegistryEntries: PropTypes.array.isRequired,
  }).isRequired,
};

export default CompaniesCard;
