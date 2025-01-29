import React from 'react';
import PropTypes from 'prop-types';
import Form from 'antd/es/form';
import Title from 'antd/es/typography/Title';
import TextArea from 'antd/es/input/TextArea';
import Flex from 'antd/es/flex';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../Button/Button';
import { congressActions } from '../../redux/actions';
import { legislationSelectors } from '../../redux/selectors';
import ReadOnlyLegislation from '../Congress/ReadOnlyLegislation';
import OpenModalButton from './components/OpenModalButton';
import modalWrapper from './components/ModalWrapper';

function CongressAmendLegislationForm({
  onClose, tier, id, section,
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
    onClose();
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        tier,
        year: dayjs(new Date(id.year.toString(), 0, 1)),
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
      <ReadOnlyLegislation section={section} />
      <Form.Item name="content" label="Legislation content" rules={[{ required: true }]}>
        <TextArea />
      </Form.Item>

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

CongressAmendLegislationForm.propTypes = {
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
  const { add } = props;
  const text = add ? 'Add section as congress' : 'Amend as congress';
  return (
    <OpenModalButton text={text} {...props} />
  );
}

ButtonModal.propTypes = {
  add: PropTypes.bool,
};

const CongressAmendLegislationModal = modalWrapper(CongressAmendLegislationForm, ButtonModal);

export default CongressAmendLegislationModal;
