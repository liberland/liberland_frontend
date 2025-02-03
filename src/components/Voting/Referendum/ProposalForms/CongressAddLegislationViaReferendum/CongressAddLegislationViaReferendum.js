import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import DatePicker from 'antd/es/date-picker';
import Flex from 'antd/es/flex';
import Form from 'antd/es/form';
import InputNumber from 'antd/es/input-number';
import Select from 'antd/es/select';
import Title from 'antd/es/typography/Title';
import Paragraph from 'antd/es/typography/Paragraph';
import dayjs from 'dayjs';
import Button from '../../../../Button/Button';
import router from '../../../../../router';
import { congressSelectors } from '../../../../../redux/selectors';
import { AddLegislationFields } from '../AddLegislationFields/AddLegislationFields';
import { congressActions } from '../../../../../redux/actions';
import FastTrackForm, { FastTrackDefaults } from '../../../../Congress/FastTrackForm';
import { ProposalDiscussionFields } from '../ProposalDiscussionFields';

function CongressAddLegislationViaReferendum() {
  const dispatch = useDispatch();
  const isLoading = useSelector(congressSelectors.isLoading);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  const [form] = Form.useForm();

  if (!isLoading && shouldRedirect) {
    return <Redirect to={router.congress.motions} />;
  }

  const propose = ({
    discussionName,
    discussionDescription,
    discussionLink,
    tier,
    year,
    index,
    sections: sectionsRaw,
    fastTrack,
    fastTrackVotingPeriod,
    fastTrackEnactmentPeriod,
  }) => {
    const sections = sectionsRaw.map((v) => v.value);
    dispatch(congressActions.congressProposeLegislationViaReferendum.call({
      discussionName,
      discussionDescription,
      discussionLink,
      tier,
      id: { year: year.year(), index },
      sections,
      fastTrack,
      fastTrackVotingPeriod,
      fastTrackEnactmentPeriod,
    }));
    setShouldRedirect(true);
  };

  return (
    <Form
      onFinish={propose}
      initialValues={{
        year: dayjs(new Date()),
        index: 1,
        FastTrackDefaults,
        sections: [
          { value: 'Paste markdown to autosplit sections' },
        ],
      }}
      form={form}
      layout="vertical"
    >
      <Title level={3}>Propose a new Congress Motion</Title>
      <Paragraph>Propose a new Congress Motion to propose a Referendum</Paragraph>
      <Form.Item
        name="tier"
        label="Legislation tier"
        rules={[{ required: true }]}
      >
        <Select
          options={[
            { value: 'InternationalTreaty', display: 'International Treaty' },
            { value: 'Law', display: 'Law' },
            { value: 'Tier3', display: 'Tier 3' },
            { value: 'Tier4', display: 'Tier 4' },
            { value: 'Tier5', display: 'Tier 5' },
            { value: 'Decision', display: 'Decision' },
          ]}
        />
      </Form.Item>
      <Form.Item
        name="year"
        label="Legislation year"
        rules={[{ required: true }]}
        getValueProps={(value) => ({ value: value ? dayjs(value) : '' })}
      >
        <DatePicker picker="year" />
      </Form.Item>
      <Form.Item
        name="index"
        label="Legislation index"
        rules={[{ required: true }]}
      >
        <InputNumber controls={false} />
      </Form.Item>

      <ProposalDiscussionFields />
      <AddLegislationFields form={form} />
      <FastTrackForm form={form} />

      <Flex wrap gap="15px">
        <Button
          primary
          type="submit"
        >
          Submit
        </Button>
      </Flex>
    </Form>
  );
}

export default CongressAddLegislationViaReferendum;
