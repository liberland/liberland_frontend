import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import Form from 'antd/es/form';
import Title from 'antd/es/typography/Title';
import DatePicker from 'antd/es/date-picker';
import Flex from 'antd/es/flex';
import dayjs from 'dayjs';
import InputNumber from 'antd/es/input-number';
import Select from 'antd/es/select';
import Card from 'antd/es/card';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../../../Button/Button';
import router from '../../../../../router';
import { congressSelectors } from '../../../../../redux/selectors';
import { AddLegislationFields } from '../AddLegislationFields/AddLegislationFields';
import { congressActions } from '../../../../../redux/actions';
import styles from '../../../styles.module.scss';

function CongressAddLegislation() {
  const dispatch = useDispatch();
  const isLoading = useSelector(congressSelectors.isLoading);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  const [form] = Form.useForm();
  if (!isLoading && shouldRedirect) {
    return <Redirect to={router.congress.motions} />;
  }

  const propose = ({
    tier, year, index, sections: sectionsRaw,
  }) => {
    const sections = sectionsRaw.map((v) => v.value);
    dispatch(congressActions.congressProposeLegislation.call({
      tier,
      id: { year: year.year(), index },
      sections,
    }));
    setShouldRedirect(true);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={propose}
      initialValues={{
        tier: 'InternationalTreaty',
        year: dayjs(new Date()),
        index: 1,
        sections: [
          { value: '' },
        ],
      }}
    >
      <Card
        title={(
          <Title className={styles.formTitle} level={3}>Propose a new International Treaty</Title>
        )}
      >
        <Form.Item
          name="tier"
          label="Legislation tier"
          rules={[{ required: true }]}
        >
          <Select
            options={[
              { value: 'InternationalTreaty', label: 'International Treaty' },
            ]}
          />
        </Form.Item>
        <Form.Item
          name="index"
          label="Legislation index"
          rules={[{ required: true }]}
        >
          <InputNumber controls={false} />
        </Form.Item>
        <Form.Item
          name="year"
          label="Legislation year"
          rules={[{ required: true }]}
          getValueProps={(value) => ({ value: value ? dayjs(value) : '' })}
        >
          <DatePicker picker="year" />
        </Form.Item>
        <AddLegislationFields form={form} />
        <Flex wrap gap="15px">
          <Button
            primary
            medium
            type="submit"
          >
            Submit
          </Button>
        </Flex>
      </Card>
    </Form>
  );
}

export default CongressAddLegislation;
