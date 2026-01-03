import React from 'react';
import Form from 'antd/es/form';
import Input from 'antd/es/input';
import Title from 'antd/es/typography/Title';
import Card from 'antd/es/card';
import Divider from 'antd/es/divider';
import { useDispatch } from 'react-redux';
import { officesActions } from '../../../../redux/actions';
import Button from '../../../Button/Button';
import styles from './styles.module.scss';

function CompanyForm() {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const onSubmit = ({ entity_id }) => {
    dispatch(officesActions.getCompanyRequest.call(entity_id));
    dispatch(officesActions.getCompanyRegistration.call(entity_id));
  };

  return (
    <Card
      title={(
        <Title className={styles.title} level={3}>Search by Company/Request ID</Title>
      )}
    >
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Form.Item
          name="entity_id"
          label="Company / Request ID"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Divider />
        <Button
          primary
          type="submit"
        >
          Fetch data
        </Button>
      </Form>
    </Card>
  );
}

export default CompanyForm;
