import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import Card from 'antd/es/card';
import Flex from 'antd/es/flex';
import { blockchainSelectors } from '../../../../redux/selectors';
import UnregisterCompany from '../UnregisterCompany';
import { officesActions } from '../../../../redux/actions';
import Button from '../../../Button/Button';
import styles from './styles.module.scss';
import CompanyEditable from '../CompanyEditable';

function CompanyRequest({ companyRequest }) {
  const dispatch = useDispatch();
  const sender = useSelector(blockchainSelectors.userWalletAddressSelector);
  if (!companyRequest) {
    return null;
  }
  if (companyRequest.invalid) {
    return (
      <>
        Failed to fetch pending registration requests for this company. Maybe it contains invalid data?
      </>
    );
  }
  const { entity_id, request } = companyRequest;
  if (request?.unregister) {
    return <UnregisterCompany entityId={entity_id} />;
  }
  if (!request) {
    return (
      <>
        This company doesn&apos;t exist or has no pending registration requests.
      </>
    );
  }
  const {
    hash,
    data,
    owner,
    editableByRegistrar,
  } = request;

  const onClick = () => {
    dispatch(officesActions.registerCompany.call({
      walletAddress: sender,
      entity_id,
      hash,
    }));
  };

  return (
    <Card
      title="Company data"
      cover={(
        <Flex justify="center" align="center" className={styles.wrapper}>
          <code className={styles.container}>
            <pre className={styles.code}>
              {JSON.stringify(
                {
                  owner,
                  ...data.toJSON(),
                },
                null,
                2,
              )}
            </pre>
          </code>
        </Flex>
      )}
      actions={[
        <Button
          primary
          onClick={onClick}
        >
          Register company
        </Button>,
      ]}
      extra={<CompanyEditable editableByRegistrar={editableByRegistrar} />}
    />
  );
}

export default CompanyRequest;

CompanyRequest.propTypes = {
  companyRequest: PropTypes.shape({
    entity_id: PropTypes.string.isRequired,
    invalid: PropTypes.bool,
    request: PropTypes.shape({
      editableByRegistrar: PropTypes.shape({
        isTrue: PropTypes.bool,
      }).isRequired,
      hash: PropTypes.arrayOf(PropTypes.number).isRequired,
      data: PropTypes.instanceOf(Map).isRequired,
      unregister: PropTypes.bool,
      owner: PropTypes.shape({}),
    }),
  }).isRequired,
};
