import React from 'react';
import Form from 'antd/es/form';
import Flex from 'antd/es/flex';
import Select from 'antd/es/select';
import Title from 'antd/es/typography/Title';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../Button/Button';
import { validatorActions } from '../../redux/actions';
import { validatorSelectors } from '../../redux/selectors';
import OpenModalButton from './components/OpenModalButton';
import modalWrapper from './components/ModalWrapper';

function StakingRewardsDestinationForm({
  onClose,
}) {
  const dispatch = useDispatch();
  const payee = useSelector(validatorSelectors.payee);

  const [form] = Form.useForm();

  const onSubmit = (values) => {
    dispatch(validatorActions.setPayee.call(values));
    onClose();
  };

  return (
    <Form
      onFinish={onSubmit}
      form={form}
      layout="vertical"
      initialValues={{
        payee: payee.toString(),
      }}
    >
      <Title level={3}>Change staking rewards destination</Title>
      <Form.Item
        label="New destination"
        name="payee"
      >
        <Select
          options={[
            { value: 'Staked', label: 'Increase stake' },
            { value: 'Stash', label: 'Deposit in the account (without staking)' },
            { value: 'Controller', label: 'Controller (deprecated)' },
          ]}
        />
      </Form.Item>
      <Flex wrap gap="15px">
        <Button
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          primary
          type="submit"
        >
          Change destination
        </Button>
      </Flex>
    </Form>
  );
}

StakingRewardsDestinationForm.propTypes = {
  onClose: PropTypes.func.isRequired,
};

function ButtonModal(props) {
  return (
    <OpenModalButton text="Change destination" {...props} />
  );
}

const StakingRewardsDestinationModal = modalWrapper(StakingRewardsDestinationForm, ButtonModal);

export default StakingRewardsDestinationModal;
