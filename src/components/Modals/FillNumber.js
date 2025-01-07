import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Form from 'antd/es/form';
import Flex from 'antd/es/flex';
import InputNumber from 'antd/es/input-number';
import Select from 'antd/es/select';
import Title from 'antd/es/typography/Title';
import Paragraph from 'antd/es/typography/Paragraph';
import ModalRoot from './ModalRoot';
import Button from '../Button/Button';
import { valueToBN } from '../../utils/walletHelpers';

function FillNumber({
  closeModal, textData, onAccept, higherThanZero, itemList,
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
    closeModal();
  };

  return (
    <Form
      onFinish={formSubmit}
      form={form}
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
            validator: (val) => {
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
          onClick={closeModal}
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

FillNumber.defaultProps = {
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

FillNumber.propTypes = {
  closeModal: PropTypes.func.isRequired,
  ...commonProps,
};

function FillNumberWrapper({
  isMint,
  onAccept,
  higherThanZero,
  itemList,
  textData,
}) {
  const [show, setShow] = useState();
  return (
    <>
      <Button
        onClick={() => setShow(true)}
        primary
      >
        {isMint ? 'Mint NFT' : 'Set Price'}
      </Button>
      {show && (
        <ModalRoot onClose={() => setShow(false)}>
          <FillNumber
            closeModal={() => setShow(false)}
            onAccept={onAccept}
            higherThanZero={higherThanZero}
            itemList={itemList}
            textData={textData}
          />
        </ModalRoot>
      )}
    </>
  );
}

FillNumberWrapper.propTypes = {
  ...commonProps,
  isMint: PropTypes.bool,
};

export default FillNumberWrapper;
