import React from 'react';
import PropTypes from 'prop-types';
import Form from 'antd/es/form';
import Title from 'antd/es/typography/Title';
import TextArea from 'antd/es/input/TextArea';
import Flex from 'antd/es/flex';
import Popconfirm from 'antd/es/popconfirm';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../Button/Button';
import { democracyActions } from '../../redux/actions';
import { legislationSelectors } from '../../redux/selectors';
import { ProposalDiscussionFields } from '../Voting/Referendum/ProposalForms/ProposalDiscussionFields';
import OpenModalButton from './components/OpenModalButton';
import modalWrapper from './components/ModalWrapper';
import LegislationHeading from '../Congress/LegislationHeading';

function ProposeAmendLegislationForm({
  onClose, tier, id, section,
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
    // eslint-disable-next-line no-shadow
    tier,
    index,
    year,
    // eslint-disable-next-line no-shadow
    section,
  }) => {
    dispatch(
      democracyActions.proposeAmendLegislation.call({
        discussionName,
        discussionDescription,
        discussionLink,
        tier,
        id: {
          year: year.year(),
          index,
        },
        section,
        content,
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
        index: parseInt(id.index) || 1,
        section,
        content: sectionContent,
      }}
      onFinish={onSubmit}
    >
      <Title level={3}>
        Propose a Referendum -
        {legislation?.sections?.[section]
          ? 'amend legislation'
          : 'add legislation section'}
      </Title>

      <LegislationHeading section={section} />
      <Form.Item
        name="content"
        label="Legislation Content"
      >
        <TextArea />
      </Form.Item>
      <ProposalDiscussionFields />
      <Flex wrap gap="15px">
        <Button onClick={onClose}>
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

ProposeAmendLegislationForm.propTypes = {
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

ProposeAmendLegislationForm.propTypes = {
  onClose: PropTypes.func.isRequired,
};

function ButtonModal(props) {
  const { add } = props;
  const text = add ? 'Add section' : 'Amend';
  return (
    <OpenModalButton text={text} {...props} />
  );
}

ButtonModal.propTypes = {
  add: PropTypes.bool,
};

const ProposeAmendLegislationModal = modalWrapper(ProposeAmendLegislationForm, ButtonModal);

export default ProposeAmendLegislationModal;
