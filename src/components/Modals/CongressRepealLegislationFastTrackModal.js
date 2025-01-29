import React from 'react';
import PropTypes from 'prop-types';
import Form from 'antd/es/form';
import Title from 'antd/es/typography/Title';
import Flex from 'antd/es/flex';
import Popconfirm from 'antd/es/popconfirm';
import { useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import Button from '../Button/Button';
import { congressActions } from '../../redux/actions';
import FastTrackForm, { FastTrackDefaults } from '../Congress/FastTrackForm';
import { ProposalDiscussionFields } from '../Voting/Referendum/ProposalForms/ProposalDiscussionFields';
import ReadOnlyLegislation from '../Congress/ReadOnlyLegislation';

function CongressRepealLegislationFastTrackForm({
  onClose,
  tier,
  id,
  section,
}) {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const onSubmitRepeal = ({
    discussionName,
    discussionDescription,
    discussionLink,
    fastTrack,
    fastTrackVotingPeriod,
    fastTrackEnactmentPeriod,
  }) => {
    dispatch(
      congressActions.congressProposeRepealLegislation.call({
        discussionName,
        discussionDescription,
        discussionLink,
        tier,
        id,
        section: section || null,
        fastTrack,
        fastTrackVotingPeriod,
        fastTrackEnactmentPeriod,
      }),
    );
    onClose();
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        tier,
        year: dayjs(new Date(id.year, 0, 1)),
        index: id.index,
        section,
        ...FastTrackDefaults,
      }}
      onFinish={onSubmitRepeal}
    >
      <Title level={3}>
        Propose a Congress Motion - propose referendum for legislation
        repeal
      </Title>

      <ReadOnlyLegislation section={section} />
      <ProposalDiscussionFields />
      <FastTrackForm form={form} />

      <Flex wrap gap="15px">
        <Button medium onClick={onClose}>
          Cancel
        </Button>
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
    </Form>
  );
}

CongressRepealLegislationFastTrackForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  tier: PropTypes.string.isRequired,
  id: PropTypes.shape({
    // eslint-disable-next-line react/forbid-prop-types
    year: PropTypes.object.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    index: PropTypes.object.isRequired,
  }).isRequired,
  section: PropTypes.number,
};

export default CongressRepealLegislationFastTrackForm;
