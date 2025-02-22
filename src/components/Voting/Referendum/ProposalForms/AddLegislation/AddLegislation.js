import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Form from 'antd/es/form';
import Flex from 'antd/es/flex';
import Title from 'antd/es/typography/Title';
import InputNumber from 'antd/es/input-number';
import Select from 'antd/es/select';
import Card from 'antd/es/card';
import Popconfirm from 'antd/es/popconfirm';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../../../Button/Button';
import { democracyActions } from '../../../../../redux/actions';
import router from '../../../../../router';
import { democracySelectors } from '../../../../../redux/selectors';
import { AddLegislationFields } from '../AddLegislationFields/AddLegislationFields';
import { ProposalDiscussionFields } from '../ProposalDiscussionFields';
import styles from './styles.module.scss';

function AddLegislation() {
  const history = useHistory();
  const dispatch = useDispatch();
  const isLoading = useSelector(
    democracySelectors.selectorGettingDemocracyInfo,
  );
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [form] = Form.useForm();

  const propose = ({
    tier,
    index,
    discussionName,
    discussionDescription,
    discussionLink,
    sections: sectionsRaw,
  }) => {
    const sections = sectionsRaw.map((v) => v.value);
    dispatch(
      democracyActions.propose.call({
        tier,
        index,
        discussionName,
        discussionDescription,
        discussionLink,
        sections,
      }),
    );
    setShouldRedirect(true);
  };

  useEffect(() => {
    if (!isLoading && shouldRedirect) {
      history.push(router.voting.referendum);
    }
  }, [shouldRedirect, isLoading, history]);

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        tier: 'Law',
        sections: [{ value: '' }],
      }}
      onFinish={propose}
    >
      <Card
        title={(
          <Title className={styles.title} level={3}>Propose a new Referendum</Title>
        )}
      >
        <Form.Item
          name="tier"
          label="Legislation tier"
          rules={[{ required: true }]}
        >
          <Select
            options={[
              { value: 'Constitution', label: 'Constitution' },
              { value: 'InternationalTreaty', label: 'International Treaty' },
              { value: 'Law', label: 'Law' },
              { value: 'Tier3', label: 'Tier 3' },
              { value: 'Tier4', label: 'Tier 4' },
              { value: 'Tier5', label: 'Tier 5' },
              { value: 'Decision', label: 'Decision' },
            ]}
          />
        </Form.Item>
        <Form.Item
          label="Legislation index"
          name="index"
          rules={[{ required: true }]}
        >
          <InputNumber controls={false} />
        </Form.Item>
        <ProposalDiscussionFields />
        <AddLegislationFields form={form} />
        <Flex wrap gap="15px">
          <Popconfirm
            title="Confirm form submission"
            description="This operation costs 100 LLD."
            onConfirm={() => form.submit()}
          >
            <Button primary>
              Submit
            </Button>
          </Popconfirm>
        </Flex>
      </Card>
    </Form>
  );
}

export default AddLegislation;
