import React, { useState } from 'react';
import Form from 'antd/es/form';
import Flex from 'antd/es/flex';
import Input from 'antd/es/input';
import List from 'antd/es/list';
import Title from 'antd/es/typography/Title';
import Card from 'antd/es/card';
import { useDispatch } from 'react-redux';
import { officesActions } from '../../../../redux/actions';
import { fetchCompanyRequests } from '../../../../api/nodeRpcCall';
import Button from '../../../Button/Button';
import styles from './styles.module.scss';

function CompanyForm() {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const [requestedCompanies, setRequestedCompanies] = useState([]);

  const onSubmit = ({ entity_id }) => {
    dispatch(officesActions.getCompanyRequest.call(entity_id));
    dispatch(officesActions.getCompanyRegistration.call(entity_id));
  };

  const doFetchRequestedCompanies = async () => {
    const pendingCompanyIndexes = await fetchCompanyRequests();
    setRequestedCompanies(pendingCompanyIndexes);
  };

  return (
    <Card
      title={(
        <Title className={styles.title} level={3}>Verify company registration request</Title>
      )}
    >
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Form.Item
          name="entity_id"
          label="Company ID"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Flex wrap gap="15px">
          <Button onClick={() => doFetchRequestedCompanies()}>
            Fetch requested companies
          </Button>
          <Button
            primary
            type="submit"
          >
            Fetch data
          </Button>
        </Flex>
      </Form>
      <List
        dataSource={requestedCompanies}
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
    </Card>
  );
}

export default CompanyForm;
