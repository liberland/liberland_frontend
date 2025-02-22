import React from 'react';
import Form from 'antd/es/form';
import Flex from 'antd/es/flex';
import InputNumber from 'antd/es/input-number';
import { ethers } from 'ethers';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { blockchainSelectors } from '../../../../redux/selectors';
import { officesActions } from '../../../../redux/actions';
import identityJudgementEnums from '../../../../constants/identityJudgementEnums';
import Button from '../../../Button/Button';

function SubmitForm({
  identity, backendMerits, backendDollars, hash,
}) {
  const dispatch = useDispatch();
  const sender = useSelector(blockchainSelectors.userWalletAddressSelector);
  const defaultValues = {
    amountLLM: ethers.utils.formatUnits(backendMerits, 12),
    amountLLD: ethers.utils.formatUnits(backendDollars, 12),
  };
  const [form] = Form.useForm();

  const provideJudgementAndSendTokens = (values) => {
    dispatch(
      officesActions.provideJudgementAndAssets.call({
        walletAddress: sender,
        address: identity.address,
        id: identity.backend?.id,
        hash,
        merits: values.amountLLM,
        dollars: values.amountLLD,
        judgementType: identityJudgementEnums.KNOWNGOOD,
      }),
    );
  };
  const provideLowQualityJudgement = () => {
    dispatch(
      officesActions.provideJudgementAndAssets.call({
        walletAddress: sender,
        address: identity.address,
        id: identity.backend?.id,
        hash,
        merits: '0',
        dollars: '0',
        judgementType: identityJudgementEnums.LOWQUALITY,
      }),
    );
  };

  return (
    <Form form={form} layout="vertical" initialValues={defaultValues} onFinish={provideJudgementAndSendTokens}>
      <Form.Item
        label="Amount LLM"
        name="amountLLM"
        rules={[{ required: true }]}
      >
        <InputNumber stringMode controls={false} />
      </Form.Item>
      <Form.Item
        label="Amount LLD"
        name="amountLLD"
        rules={[{ required: true }]}
      >
        <InputNumber stringMode controls={false} />
      </Form.Item>
      <Flex wrap gap="15px">
        <Button primary type="submit">
          Provide KnownGood judgement and transfer staked LLM and liquid LLD
        </Button>
        <Button primary onClick={() => { provideLowQualityJudgement(); }}>
          Provide LowQuality judgement
        </Button>
      </Flex>
    </Form>
  );
}

SubmitForm.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  identity: PropTypes.object.isRequired,
  backendMerits: PropTypes.instanceOf(ethers.BigNumber).isRequired,
  backendDollars: PropTypes.instanceOf(ethers.BigNumber).isRequired,
  hash: PropTypes.string.isRequired,
};

export default SubmitForm;
