import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Form from 'antd/es/form';
import Flex from 'antd/es/flex';
import Title from 'antd/es/typography/Title';
import TextArea from 'antd/es/input/TextArea';
import { useDispatch, useSelector } from 'react-redux';
import ModalRoot from './ModalRoot';
import Button from '../Button/Button';
import { congressActions } from '../../redux/actions';
import { legislationSelectors } from '../../redux/selectors';
import FastTrackForm, { FastTrackDefaults } from '../Congress/FastTrackForm';
import { ProposalDiscussionFields } from '../Voting/Referendum/ProposalForms/ProposalDiscussionFields';
import DisplayOnlyLegislation from '../Congress/DisplayOnlyLegislation';

function CongressAmendLegislationViaReferendumModal({
  closeModal, tier, id, section,
}) {
  const dispatch = useDispatch();
  const allLegislation = useSelector(legislationSelectors.legislation);
  const legislation = allLegislation[tier][id.year][id.index];
  const sectionContent = legislation?.sections?.[section]?.content.toHuman() ?? '';
  const [form] = Form.useForm();

  const onSubmit = ({
    discussionName,
    discussionDescription,
    discussionLink,
    content,
    fastTrack,
    fastTrackVotingPeriod,
    fastTrackEnactmentPeriod,
  }) => {
    dispatch(congressActions.congressAmendLegislationViaReferendum.call({
      discussionName,
      discussionDescription,
      discussionLink,
      tier,
      id,
      section,
      content,
      fastTrack,
      fastTrackVotingPeriod,
      fastTrackEnactmentPeriod,
    }));
    closeModal();
  };

  return (
    <Form
      onFinish={onSubmit}
      form={form}
      layout="vertical"
      initialValues={{
        tier,
        year: id.year,
        index: id.index,
        section,
        content: sectionContent,
        ...FastTrackDefaults,
      }}
    >
      <Title level={3}>
        Propose a Motion for Referendum -
        {legislation.sections?.[section] ? 'amend legislation' : 'add legislation section'}
      </Title>

      <DisplayOnlyLegislation section={section} />
      <Form.Item name="content" label="Legislation content" rules={[{ required: true }]}>
        <TextArea />
      </Form.Item>

      <ProposalDiscussionFields />
      <FastTrackForm form={form} />

      <Flex wrap gap="15px">
        <Button
          medium
          onClick={closeModal}
        >
          Cancel
        </Button>
        <Button
          primary
          medium
          type="submit"
        >
          Submit
        </Button>
      </Flex>
    </Form>
  );
}

CongressAmendLegislationViaReferendumModal.propTypes = {
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

export default function CongressAmendLegislationViaReferendumModalWrapper({
  add,
  tier,
  id,
  section,
}) {
  const [show, setShow] = useState();
  return (
    <>
      <Button link onClick={() => setShow(true)}>
        {add
          ? 'Propose add section referendum as congress'
          : 'Propose amend referendum as congress'}
      </Button>
      {show && (
        <ModalRoot onClose={() => setShow(false)}>
          <CongressAmendLegislationViaReferendumModal
            closeModal={() => setShow(false)}
            id={id}
            section={section}
            tier={tier}
          />
        </ModalRoot>
      )}
    </>
  );
}

CongressAmendLegislationViaReferendumModalWrapper.propTypes = {
  add: PropTypes.bool,
  tier: PropTypes.string.isRequired,
  id: PropTypes.shape({
    // eslint-disable-next-line react/forbid-prop-types
    year: PropTypes.object.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    index: PropTypes.object.isRequired,
  }).isRequired,
  section: PropTypes.number,
};
