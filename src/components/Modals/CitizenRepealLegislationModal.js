import React from 'react';
import PropTypes from 'prop-types';
import Form from 'antd/es/form';
import Title from 'antd/es/typography/Title';
import Popconfirm from 'antd/es/popconfirm';
import Flex from 'antd/es/flex';
import { useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import Button from '../Button/Button';
import { democracyActions } from '../../redux/actions';
import { ProposalDiscussionFields } from '../Voting/Referendum/ProposalForms/ProposalDiscussionFields';
import ReadOnlyLegislation from '../Congress/ReadOnlyLegislation';
import OpenModalButton from './components/OpenModalButton';
import modalWrapper from './components/ModalWrapper';

function CitizenRepealLegislationForm({
  onClose, tier, id, section,
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
    onClose();
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
      <ReadOnlyLegislation section={section} />
      <ProposalDiscussionFields />
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

CitizenRepealLegislationForm.propTypes = {
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

function ButtonModal(props) {
  return (
    <OpenModalButton text="Propose citizen referendum to repeal" {...props} />
  );
}

ButtonModal.propTypes = {
  isMint: PropTypes.bool.isRequired,
};

const AddLiquidityModal = modalWrapper(CitizenRepealLegislationForm, ButtonModal);

export default AddLiquidityModal;
