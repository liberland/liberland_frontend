import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Form from 'antd/es/form';
import Title from 'antd/es/typography/Title';
import Popconfirm from 'antd/es/popconfirm';
import Flex from 'antd/es/flex';
import { useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import ModalRoot from './ModalRoot';
import Button from '../Button/Button';
import { democracyActions } from '../../redux/actions';
import { ProposalDiscussionFields } from '../Voting/Referendum/ProposalForms/ProposalDiscussionFields';
import DisplayOnlyLegislation from '../Congress/DisplayOnlyLegislation';

function CitizenRepealLegislationModal({
  closeModal, tier, id, section,
}) {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const onSubmitRepeal = ({
    discussionName,
    discussionDescription,
    discussionLink,
  }) => {
    dispatch(
      democracyActions.citizenProposeRepealLegislation.call({
        discussionName,
        discussionDescription,
        discussionLink,
        tier,
        id,
        section: section || null,
      }),
    );
    closeModal();
  };

  return (
    <Form
      onFinish={onSubmitRepeal}
      form={form}
      layout="vertical"
      initialValues={{
        tier,
        year: dayjs(new Date(id.year.toString(), 0, 1)),
        index: id.index,
        section,
      }}
    >
      <Title level={3}>
        Propose referendum for legislation repeal
      </Title>
      <DisplayOnlyLegislation section={section} />
      <ProposalDiscussionFields />
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

CitizenRepealLegislationModal.propTypes = {
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

function CitizenRepealLegislationModalWrapper({
  tier,
  id,
  section,
}) {
  const [show, setShow] = useState();
  return (
    <>
      <Button onClick={() => setShow(true)}>
        Propose citizen referendum to repeal
      </Button>
      {show && (
        <ModalRoot onClose={() => setShow(false)}>
          <CitizenRepealLegislationModal
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

CitizenRepealLegislationModalWrapper.propTypes = {
  tier: PropTypes.string.isRequired,
  id: PropTypes.shape({
    // eslint-disable-next-line react/forbid-prop-types
    year: PropTypes.object.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    index: PropTypes.object.isRequired,
  }).isRequired,
  section: PropTypes.number,
};

export default CitizenRepealLegislationModalWrapper;
