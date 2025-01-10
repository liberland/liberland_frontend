import React, { useState } from 'react';
import Form from 'antd/es/form';
import Flex from 'antd/es/flex';
import Input from 'antd/es/input';
import List from 'antd/es/list';
import Title from 'antd/es/typography/Title';
import { useDispatch } from 'react-redux';
import { officesActions } from '../../../../redux/actions';
import { fetchCompanyRequests } from '../../../../api/nodeRpcCall';
import Button from '../../../Button/Button';

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
    <div>
      <List
        dataSource={requestedCompanies}
        extra={(
          <Button primary onClick={() => doFetchRequestedCompanies()}>
            Fetch requested companies
          </Button>
        )}
        pagination={{ position: 'bottom', align: 'end' }}
        renderItem={(requestedCompany) => (
          <List.Item actions={[
            {
              children: (
                <Button
                  small
                  onClick={() => dispatch(officesActions.getCompanyRequest.call(requestedCompany.indexes[1]))}
                >
                  fetch
                </Button>
              ),
            },
          ]}
          >
            <List.Item.Meta
              title={`Registrar id ${requestedCompany.indexes[0]} request index ${requestedCompany.indexes[1]}`}
            />
          </List.Item>
        )}
      />
      <Form form={form} layout="vertical" onSubmit={onSubmit}>
        <Title level={3}>Verify company registration request</Title>
        <Form.Item
          name="entity_id"
          label="Company ID"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Flex wrap gap="15px">
          <Button
            primary
            medium
            type="submit"
          >
            Fetch data
          </Button>
        </Flex>
      </Form>
    </div>
  );
}

export default CompanyForm;
