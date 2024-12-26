import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Form from 'antd/es/form';
import Title from 'antd/es/typography/Title';
import Popconfirm from 'antd/es/popconfirm';
import { useDispatch } from 'react-redux';
import ModalRoot from './ModalRoot';
import Button from '../Button/Button';
import styles from './styles.module.scss';
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
        section,
      }),
    );
    closeModal();
  };

  return (
    <Form
      onFinish={onSubmitRepeal}
      form={form}
      initialValues={{
        tier,
        year: id.year,
        index: id.index,
        section,
      }}
    >
      <Title level={3}>
        Propose referendum for legislation repeal
      </Title>
      <DisplayOnlyLegislation section={section} />
      <ProposalDiscussionFields />
      <div className={styles.buttonWrapper}>
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
      </div>
    </Form>
  );
}

CitizenRepealLegislationModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  tier: PropTypes.string.isRequired,
  id: PropTypes.shape({
    year: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired,
  }).isRequired,
  section: PropTypes.string.isRequired,
};

function CitizenRepealLegislationModalWrapper({
  tier,
  id,
  section,
}) {
  const [show, setShow] = useState();
  return (
    <>
      <Button link multiline onClick={() => setShow(true)}>
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
    year: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired,
  }).isRequired,
  section: PropTypes.string.isRequired,
};

export default CitizenRepealLegislationModalWrapper;
