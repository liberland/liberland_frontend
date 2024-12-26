import React from 'react';
import PropTypes from 'prop-types';
import Form from 'antd/es/form';
import Title from 'antd/es/typography/Title';
import DatePicker from 'antd/es/date-picker';
import InputNumber from 'antd/es/input-number';
import Select from 'antd/es/select';
import Popconfirm from 'antd/es/popconfirm';
import { useDispatch } from 'react-redux';
import ModalRoot from './ModalRoot';
import Button from '../Button/Button';
import styles from './styles.module.scss';
import { democracyActions } from '../../redux/actions';
import { ProposalDiscussionFields } from '../Voting/Referendum/ProposalForms/ProposalDiscussionFields';

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

      <Form.Item name="tier" label="Legislation tier" rules={{ required: true }}>
        <Select
          options={[
            { value: 'Constitution', label: 'Constitution' },
            { value: 'InternationalTreaty', label: 'International Treaty' },
            { value: 'Law', label: 'Law' },
            { value: 'Tier3', label: 'Tier 3' },
            { value: 'Tier4', label: 'Tier 4' },
            { value: 'Tier5', label: 'Tier 5' },
            { value: 'Decision', label: 'Decision' },
          ]}
          disabled
        />
      </Form.Item>
      <Form.Item name="year" label="Legislation year" rules={{ required: true }}>
        <DatePicker picker="year" disabled />
      </Form.Item>
      <Form.Item name="index" label="Legislation Index" rules={{ required: true }}>
        <InputNumber controls={false} disabled />
      </Form.Item>
      {section !== null && (
        <Form.Item name="section" label="Legislation section" rules={{ required: true }}>
          <InputNumber controls={false} disabled />
        </Form.Item>
      )}
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

function CitizenRepealLegislationModalWrapper(props) {
  return (
    <ModalRoot>
      <CitizenRepealLegislationModal {...props} />
    </ModalRoot>
  );
}

export default CitizenRepealLegislationModalWrapper;
