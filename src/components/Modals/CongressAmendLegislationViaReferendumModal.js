import React from 'react';
import PropTypes from 'prop-types';
import Form from 'antd/es/form';
import Flex from 'antd/es/flex';
import Title from 'antd/es/typography/Title';
import TextArea from 'antd/es/input/TextArea';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../Button/Button';
import { congressActions } from '../../redux/actions';
import { legislationSelectors } from '../../redux/selectors';
import FastTrackForm, { FastTrackDefaults } from '../Congress/FastTrackForm';
import { ProposalDiscussionFields } from '../Voting/Referendum/ProposalForms/ProposalDiscussionFields';
import OpenModalButton from './components/OpenModalButton';
import modalWrapper from './components/ModalWrapper';
import LegislationHeading from '../Congress/LegislationHeading';

function CongressAmendLegislationViaReferendumForm({
  closeModal,
  tier,
  id,
  section,
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
    year,
    index,
    // eslint-disable-next-line no-shadow
    tier,
    // eslint-disable-next-line no-shadow
    section,
  }) => {
    dispatch(
      congressActions.congressAmendLegislationViaReferendum.call({
        discussionName,
        discussionDescription,
        discussionLink,
        tier,
        id: {
          year: year.year(),
          index,
        },
        section: section || null,
        content,
        fastTrack,
        fastTrackVotingPeriod,
        fastTrackEnactmentPeriod,
      }),
    );
    closeModal();
  };

  return (
    <Form
      onFinish={onSubmit}
      form={form}
      layout="vertical"
      initialValues={{
        tier,
        year: dayjs(new Date(id.year, 0, 1)),
        index: parseInt(id.index) || 1,
        section,
        content: sectionContent,
        ...FastTrackDefaults,
      }}
    >
      <Title level={3}>
        Propose a Motion for Referendum -
        {legislation.sections?.[section]
          ? 'amend legislation'
          : 'add legislation section'}
      </Title>

      <LegislationHeading section={section} />
      <Form.Item
        name="content"
        label="Legislation content"
        rules={[{ required: true }]}
      >
        <TextArea />
      </Form.Item>

      <ProposalDiscussionFields />
      <FastTrackForm form={form} />
      <Flex wrap gap="15px">
        <Button medium onClick={closeModal}>
          Cancel
        </Button>
        <Button primary medium type="submit">
          Submit
        </Button>
      </Flex>
    </Form>
  );
}

CongressAmendLegislationViaReferendumForm.propTypes = {
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

function ButtonModal(props) {
  const { add } = props;
  const text = add
    ? 'Propose add section referendum as congress'
    : 'Propose amend referendum as congress';
  return <OpenModalButton text={text} {...props} />;
}

ButtonModal.propTypes = {
  add: PropTypes.bool,
};

const CongressAmendLegislationViaReferendumModal = modalWrapper(
  CongressAmendLegislationViaReferendumForm,
  ButtonModal,
);

export default CongressAmendLegislationViaReferendumModal;
