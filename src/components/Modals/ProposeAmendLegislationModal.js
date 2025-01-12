import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Form from 'antd/es/form';
import Title from 'antd/es/typography/Title';
import TextArea from 'antd/es/input/TextArea';
import Flex from 'antd/es/flex';
import Popconfirm from 'antd/es/popconfirm';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import ModalRoot from './ModalRoot';
import Button from '../Button/Button';
import { democracyActions } from '../../redux/actions';
import { legislationSelectors } from '../../redux/selectors';
import { ProposalDiscussionFields } from '../Voting/Referendum/ProposalForms/ProposalDiscussionFields';
import DisplayOnlyLegislation from '../Congress/DisplayOnlyLegislation';

function ProposeAmendLegislationModal({
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
  }) => {
    dispatch(
      democracyActions.proposeAmendLegislation.call({
        discussionName,
        discussionDescription,
        discussionLink,
        tier,
        id,
        section,
        content,
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

      <DisplayOnlyLegislation section={section} />
      <Form.Item
        name="content"
        label="Legislation Content"
      >
        <TextArea />
      </Form.Item>
      <ProposalDiscussionFields />
      <Flex wrap gap="15px">
        <Button onClick={closeModal}>
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

ProposeAmendLegislationModal.propTypes = {
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

function ProposeAmendLegislationModalWrapper({
  add,
  tier,
  id,
  section,
}) {
  const [show, setShow] = useState();
  return (
    <>
      <Button onClick={() => setShow(true)}>
        {add ? 'Add section' : 'Amend'}
      </Button>
      {show && (
        <ModalRoot onClose={() => setShow(false)}>
          <ProposeAmendLegislationModal
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

ProposeAmendLegislationModalWrapper.propTypes = {
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

export default ProposeAmendLegislationModalWrapper;
