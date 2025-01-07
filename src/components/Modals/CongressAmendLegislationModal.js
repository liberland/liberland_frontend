import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Form from 'antd/es/form';
import Title from 'antd/es/typography/Title';
import TextArea from 'antd/es/input/TextArea';
import Flex from 'antd/es/flex';
import { useDispatch, useSelector } from 'react-redux';
import ModalRoot from './ModalRoot';
import Button from '../Button/Button';
import { congressActions } from '../../redux/actions';
import { legislationSelectors } from '../../redux/selectors';
import DisplayOnlyLegislation from '../Congress/DisplayOnlyLegislation';

function CongressAmendLegislationModal({
  closeModal, tier, id, section,
}) {
  const dispatch = useDispatch();
  const allLegislation = useSelector(legislationSelectors.legislation);
  const legislation = allLegislation[tier][id.year][id.index];
  const sectionContent = legislation.sections?.[section]?.content.toHuman() ?? '';
  const [form] = Form.useForm();

  const onSubmit = ({ content }) => {
    dispatch(congressActions.congressAmendLegislation.call({
      tier, id, section, content,
    }));
    closeModal();
  };

  return (
    <Form
      form={form}
      initialValues={{
        tier,
        year: id.year,
        index: id.index,
        section,
        content: sectionContent,
      }}
      onSubmit={onSubmit}
    >
      <Title level={3}>
        Propose a Motion -
        {legislation?.sections?.[section] ? 'amend legislation' : 'add legislation section'}
      </Title>
      <DisplayOnlyLegislation section={section} />
      <Form.Item name="content" label="Legislation content" rules={[{ required: true }]}>
        <TextArea />
      </Form.Item>

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

CongressAmendLegislationModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  tier: PropTypes.string.isRequired,
  id: PropTypes.shape({
    year: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired,
  }).isRequired,
  section: PropTypes.string.isRequired,
};

function CongressAmendLegislationModalWrapper({
  tier,
  id,
  section,
  add,
}) {
  const [show, setShow] = useState();
  return (
    <>
      <Button link multiline onClick={() => setShow(true)}>
        {add ? 'Add section as congress' : 'Amend as congress'}
      </Button>
      {show && (
        <ModalRoot onClose={() => setShow(false)}>
          <CongressAmendLegislationModal
            closeModal={() => setShow(false)}
            id={id}
            tier={tier}
            section={section}
          />
        </ModalRoot>
      )}
    </>
  );
}

CongressAmendLegislationModalWrapper.propTypes = {
  tier: PropTypes.string.isRequired,
  id: PropTypes.shape({
    year: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired,
  }).isRequired,
  section: PropTypes.string.isRequired,
  add: PropTypes.bool,
};

export default CongressAmendLegislationModalWrapper;
