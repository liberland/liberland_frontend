import React, { useEffect, useMemo, useState } from 'react';
import Form from 'antd/es/form';
import Flex from 'antd/es/flex';
import List from 'antd/es/list';
import Title from 'antd/es/typography/Title';
import Card from 'antd/es/card';
import Switch from 'antd/es/switch';
import Divider from 'antd/es/divider';
import { useDispatch, useSelector } from 'react-redux';
import { contractsActions, officesActions, registriesActions } from '../../../../redux/actions';
import { contractsSelectors, registriesSelectors } from '../../../../redux/selectors';
import Button from '../../../Button/Button';
import InputSearch from '../../../InputComponents/InputSearchAddressName';
import styles from './styles.module.scss';

function CompanyRequestList() {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [onlySigned, setOnlySigned] = useState(false);
  const [filterByWallet, setFilterByWallet] = useState();
  const requestedCompanies = useSelector(
    registriesSelectors.allCompanyRequests,
  );
  const contracts = useSelector(contractsSelectors.selectorContracts);

  useEffect(() => {
    dispatch(contractsActions.getContracts.call());
    dispatch(registriesActions.fetchCompanyRequests.call());
  }, [dispatch]);

  const onSubmit = ({ walletAddress }) => {
    setFilterByWallet(walletAddress);
  };

  const signedRequests = useMemo(() => {
    if (!contracts?.length || !requestedCompanies?.length) {
      return [];
    }
    const dormant = contracts.find(
      ({ contractId }) => contractId === process.env.REACT_APP_DORMANT_COMPANY_CONTRACT_ID,
    );
    const liberland = contracts.find(
      ({ contractId }) => contractId === process.env.REACT_APP_LIBERLAND_COMPANY_CONTRACT_ID,
    );
    const international = contracts.find(
      ({ contractId }) => contractId === process.env.REACT_APP_INTERNATIONAL_COMPANY_CONTRACT_ID,
    );
    const map = {
      dormant,
      liberland,
      international,
    };
    return requestedCompanies.filter(({
      owner, data,
    }) => {
      if (!data) {
        return false;
      }
      const type = data.companyType?.toHuman(true).toLowerCase();
      return map[type]?.partiesSignaturesList?.some((party) => owner === party);
    });
  }, [requestedCompanies, contracts]);

  const orderedContracts = useMemo(
    () => (
      onlySigned ? signedRequests : requestedCompanies
    ).sort((aRequest, bRequest) => {
      const aOrderId = aRequest.indexes[1];
      const bOrderId = bRequest.indexes[1];
      return bOrderId - aOrderId;
    }).filter(({ owner }) => !filterByWallet || owner === filterByWallet),
    [filterByWallet, signedRequests, onlySigned, requestedCompanies],
  );

  return (
    <Card
      title={(
        <Title className={styles.title} level={3}>List of company requests</Title>
      )}
    >
      <Flex vertical gap="32px">
        <Form form={form} layout="vertical" onFinish={onSubmit}>
          <Form.Item
            name="walletAddress"
            label="Wallet address"
          >
            <InputSearch allowClear />
          </Form.Item>
          <Divider />
          <Button
            primary
            type="submit"
          >
            Search
          </Button>
        </Form>
        <List
          dataSource={orderedContracts}
          header={(
            <Flex
              wrap
              gap="32px"
              justify="space-between"
              align="center"
              className={styles.requestsContainer}
            >
              <Title level={4} className={styles.requestsTitle}>
                Requests
              </Title>
              <Switch
                loading={!contracts?.length}
                checkedChildren="Show all"
                unCheckedChildren="Show only signed"
                checked={onlySigned}
                onChange={setOnlySigned}
              />
            </Flex>
          )}
          pagination={{ position: 'bottom', align: 'end' }}
          renderItem={(requestedCompany) => (
            <List.Item
              actions={[
                <Button
                  onClick={() => dispatch(officesActions.getCompanyRequest.call(requestedCompany.indexes[1]))}
                >
                  fetch
                </Button>,
              ]}
            >
              <List.Item.Meta
                title={`Registrar id ${requestedCompany.indexes[0]} request index ${requestedCompany.indexes[1]}`}
              />
            </List.Item>
          )}
        />
      </Flex>
    </Card>
  );
}

export default CompanyRequestList;
