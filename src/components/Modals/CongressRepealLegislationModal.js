import React from 'react';
import PropTypes from 'prop-types';
import Form from 'antd/es/form';
import Flex from 'antd/es/flex';
import Title from 'antd/es/typography/Title';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../Button/Button';
import { congressActions } from '../../redux/actions';
import ReadOnlyLegislation from '../Congress/ReadOnlyLegislation';
import { congressSelectors } from '../../redux/selectors';
import OpenModalButton from './components/OpenModalButton';
import modalWrapper from './components/ModalWrapper';

function CongressRepealLegislationForm({
  onClose, tier, id, section,
}) {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const onSubmitRepeal = () => {
    dispatch(congressActions.congressRepealLegislation.call({ tier, id, section }));
    onClose();
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onSubmitRepeal}
      initialValues={{
        tier,
        year: dayjs(new Date(id.year, 0, 1)),
        index: id.index,
        section,
      }}
    >
      <Title level={3}>
        Propose a Congress Motion - repeal legislation
      </Title>

      <ReadOnlyLegislation section={section} />

      <Flex wrap gap="15px">
        <Button
          medium
          onClick={onClose}
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

CongressRepealLegislationForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  tier: PropTypes.string.isRequired,
  id: PropTypes.shape({
    // eslint-disable-next-line react/forbid-prop-types
    year: PropTypes.object.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    index: PropTypes.object.isRequired,
  }).isRequired,
  section: PropTypes.string.isRequired,
};

function ButtonModal(props) {
  const userIsMember = useSelector(congressSelectors.userIsMember);
  if (!userIsMember) {
    return null;
  }

  return (
    <OpenModalButton text="Propose congress motion to repeal" {...props} />
  );
}

const CongressRepealLegislationModal = modalWrapper(CongressRepealLegislationForm, ButtonModal);

export default CongressRepealLegislationModal;
