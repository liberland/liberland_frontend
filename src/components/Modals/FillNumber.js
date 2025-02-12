import React from 'react';
import PropTypes from 'prop-types';
import Form from 'antd/es/form';
import Flex from 'antd/es/flex';
import InputNumber from 'antd/es/input-number';
import Select from 'antd/es/select';
import Title from 'antd/es/typography/Title';
import Paragraph from 'antd/es/typography/Paragraph';
import Button from '../Button/Button';
import { valueToBN } from '../../utils/walletHelpers';
import OpenModalButton from './components/OpenModalButton';
import modalWrapper from './components/ModalWrapper';

function FillNumberForm({
  onClose, textData, onAccept, higherThanZero, itemList,
}) {
  const {
    nft,
    collection,
    title = 'Set price of NFT',
    description = `You are going to set price nft ${nft.name || ''}  (${nft.nftId})
     of collection ${collection.name || ''} (${collection.collectionId}) to...`,
    submitButtonText = 'Make transfer',
    amount = null,
  } = textData;

  const [form] = Form.useForm();

  const formSubmit = async (data) => {
    if (itemList?.length) {
      await onAccept(data.collection, data.amount);
    } else {
      await onAccept(data.amount);
    }
    onClose();
  };

  return (
    <Form
      onFinish={formSubmit}
      form={form}
      layout="vertical"
      initialValues={{
        amount,
      }}
    >
      <Title level={3}>
        {title}
      </Title>
      <Paragraph>
        {description}
      </Paragraph>
      {itemList?.length ? (
        <Form.Item name="collection" label="Choose a collection" rules={[{ required: true }]}>
          <Select
            options={itemList.map(({ collectionId }) => ({
              value: collectionId,
              label: collectionId,
            }))}
            placeholder="Choose a collection"
          />
        </Form.Item>
      ) : null}
      <Form.Item
        name="amount"
        label="Amount"
        rules={[
          { required: true },
          {
            validator: (_, val) => {
              if (val) {
                try {
                  const value = valueToBN(val);
                  if (higherThanZero && value.lt(valueToBN(0))) {
                    return Promise.reject('Amount must be greater than zero');
                  }
                } catch {
                  return Promise.reject('Amount must be a number');
                }
              }
              return Promise.resolve();
            },
          },
        ]}
      >
        <InputNumber stringMode controls={false} />
      </Form.Item>
      <Flex wrap gap="15px">
        <Button
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          disabled={itemList?.length < 1}
          primary
          type="submit"
        >
          {submitButtonText}
        </Button>
      </Flex>
    </Form>
  );
}

FillNumberForm.defaultProps = {
  // eslint-disable-next-line react/default-props-match-prop-types
  textData: {
    title: 'Transfer to',
    description: 'You are going to transfer nft to...',
    submitButtonText: 'Make transfer',
    nft: null,
    collection: null,
    amount: null,
  },
  // eslint-disable-next-line react/default-props-match-prop-types
  higherThanZero: true,
  // eslint-disable-next-line react/default-props-match-prop-types
  itemList: null,
};

const commonProps = {
  onAccept: PropTypes.func.isRequired,
  higherThanZero: PropTypes.bool,
  // eslint-disable-next-line react/forbid-prop-types
  itemList: PropTypes.array,
  textData: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    submitButtonText: PropTypes.string,
    amount: PropTypes.number,
    nft: PropTypes.shape({
      nftId: PropTypes.string,
      name: PropTypes.string,
    }),
    collection: PropTypes.shape({
      collectionId: PropTypes.string,
      name: PropTypes.string,
    }),
  }),
};

FillNumberForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  ...commonProps,
};

function ButtonModal(props) {
  const { isMint } = props;
  const text = isMint ? 'Mint NFT' : 'Set Price';
  return <OpenModalButton text={text} primary {...props} />;
}

ButtonModal.propTypes = {
  isMint: PropTypes.bool.isRequired,
};

const FillNumberModal = modalWrapper(FillNumberForm, ButtonModal);

export default FillNumberModal;
