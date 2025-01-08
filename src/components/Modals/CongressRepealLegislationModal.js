import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Form from 'antd/es/form';
import Flex from 'antd/es/flex';
import Title from 'antd/es/typography/Title';
import { useDispatch, useSelector } from 'react-redux';
import ModalRoot from './ModalRoot';
import Button from '../Button/Button';
import { congressActions } from '../../redux/actions';
import DisplayOnlyLegislation from '../Congress/DisplayOnlyLegislation';
import { congressSelectors } from '../../redux/selectors';

function CongressRepealLegislationModal({
  closeModal, tier, id, section,
}) {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const onSubmitRepeal = () => {
    dispatch(congressActions.congressRepealLegislation.call({ tier, id, section }));
    closeModal();
  };

  return (
    <Form
      form={form}
      onFinish={onSubmitRepeal}
    >
      <Title level={3}>
        Propose a Congress Motion - repeal legislation
      </Title>

      <DisplayOnlyLegislation section={section} />

      <Flex wrap gap="15px">
        <Button
          medium
          onClick={closeModal}
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

CongressRepealLegislationModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  tier: PropTypes.string.isRequired,
  id: PropTypes.shape({
    // eslint-disable-next-line react/forbid-prop-types
    year: PropTypes.object.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    index: PropTypes.object.isRequired,
  }).isRequired,
  section: PropTypes.string.isRequired,
};

function CongressRepealLegislationModalWrapper({
  tier,
  id,
  section,
}) {
  const [show, setShow] = useState();
  const userIsMember = useSelector(congressSelectors.userIsMember);
  if (!userIsMember) {
    return null;
  }

  return (
    <>
      <Button link onClick={() => setShow(true)}>
        Propose congress motion to repeal
      </Button>
      {show && (
        <ModalRoot onClose={() => setShow(false)}>
          <CongressRepealLegislationModal
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

CongressRepealLegislationModalWrapper.propTypes = {
  tier: PropTypes.string.isRequired,
  id: PropTypes.shape({
    // eslint-disable-next-line react/forbid-prop-types
    year: PropTypes.object.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    index: PropTypes.object.isRequired,
  }).isRequired,
  section: PropTypes.string.isRequired,
};

export default CongressRepealLegislationModalWrapper;
