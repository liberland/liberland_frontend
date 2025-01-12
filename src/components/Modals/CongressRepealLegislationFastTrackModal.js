import React from 'react';
import PropTypes from 'prop-types';
import Form from 'antd/es/form';
import Title from 'antd/es/typography/Title';
import Flex from 'antd/es/flex';
import Popconfirm from 'antd/es/popconfirm';
import { useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import ModalRoot from './ModalRoot';
import Button from '../Button/Button';
import { congressActions } from '../../redux/actions';
import FastTrackForm, { FastTrackDefaults } from '../Congress/FastTrackForm';
import { ProposalDiscussionFields } from '../Voting/Referendum/ProposalForms/ProposalDiscussionFields';
import DisplayOnlyLegislation from '../Congress/DisplayOnlyLegislation';

function CongressRepealLegislationFastTrackModal({
  closeModal,
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
    closeModal();
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

      <DisplayOnlyLegislation section={section} />
      <ProposalDiscussionFields />
      <FastTrackForm form={form} />

      <Flex wrap gap="15px">
        <Button medium onClick={closeModal}>
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

CongressRepealLegislationFastTrackModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  tier: PropTypes.string.isRequired,
  id: PropTypes.shape({
    // eslint-disable-next-line react/forbid-prop-types
    year: PropTypes.object.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    index: PropTypes.object.isRequired,
  }).isRequired,
  section: PropTypes.number,
};

function CongressRepealLegislationFastTrackModalWrapper(props) {
  return (
    <ModalRoot>
      <CongressRepealLegislationFastTrackModal {...props} />
    </ModalRoot>
  );
}

export default CongressRepealLegislationFastTrackModalWrapper;
