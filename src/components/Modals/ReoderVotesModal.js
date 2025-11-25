import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'antd/es/form';
import Title from 'antd/es/typography/Title';
import Flex from 'antd/es/flex';
import Divider from 'antd/es/divider';
import PropTypes from 'prop-types';
import Button from '../Button/Button';
import modalWrapper from './components/ModalWrapper';
import OpenModalButton from './components/OpenModalButton';
import { democracyActions } from '../../redux/actions';
import { blockchainSelectors } from '../../redux/selectors';
import SelectedCandidateCard from '../Voting/CongressionalAssembly/SelectedCandidateCard';

function ReoderVotesForm({
  onClose,
  candidates,
}) {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const userWalletAddress = useSelector(
    blockchainSelectors.userWalletAddressSelector,
  );
  return (
    <Form
      form={form}
      initialValues={{ candidates }}
      layout="vertical"
      onFinish={(values) => {
        dispatch(democracyActions.voteForCongress.call({
          selectedCandidates: values.candidates,
          userWalletAddress,
        }));
        onClose();
      }}
    >
      <Title level={3}>Change selected candidates</Title>
      <Form.List name="candidates">
        {(fields, { move, remove }) => (
          <Flex vertical gap="16px">
            {fields.map((field, index) => (
              <div key={field.key}>
                <SelectedCandidateCard
                  candidateIndex={index}
                  candidatesLength={fields.length}
                  moveSelectedCandidate={(direction) => move(index, index + direction)}
                  politician={form.getFieldValue(field.name)}
                  unselectCandidate={() => remove(index)}
                />
                <Divider />
              </div>
            ))}
          </Flex>
        )}
      </Form.List>
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
          Confirm selection
        </Button>
      </Flex>
    </Form>
  );
}

ReoderVotesForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  candidates: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

function ButtonModal(props) {
  return (
    <OpenModalButton primary text="Change or remove my votes" {...props} />
  );
}

const ReoderVotesModal = modalWrapper(ReoderVotesForm, ButtonModal);

export default ReoderVotesModal;
