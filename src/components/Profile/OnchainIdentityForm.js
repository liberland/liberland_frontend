import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Form from 'antd/es/form';
import Title from 'antd/es/typography/Title';
import Paragraph from 'antd/es/typography/Paragraph';
import Input from 'antd/es/input';
import Alert from 'antd/es/alert';
import Checkbox from 'antd/es/checkbox';
import DatePicker from 'antd/es/date-picker';
import Flex from 'antd/es/flex';
import Select from 'antd/es/select';
import dayjs from 'dayjs';
import Button from '../Button/Button';
import styles from './styles.module.scss';
import {
  parseDOB,
  parseAdditionalFlag,
  parseCitizenshipJudgement,
  decodeAndFilter,
} from '../../utils/identityParser';

function OnchainIdentityForm({
  onSubmit,
  onClose,
  identity,
  blockNumber,
  name,
}) {
  const defaultValues = useMemo(() => {
    if (identity.isSome) {
      const { judgements, info } = identity.unwrap();
      const identityCitizen = parseAdditionalFlag(info.additional, 'citizen');
      const eResident = parseAdditionalFlag(info.additional, 'eresident');
      const company = parseAdditionalFlag(info.additional, 'company');
      const onChainIdentity = [
        identityCitizen && eResident && 'citizen',
        !identityCitizen && eResident && 'eresident',
        company && 'company',
        'neither',
      ].find(Boolean);

      const identityDOB = parseDOB(info.additional, blockNumber);
      const decodedData = decodeAndFilter(info, ['display', 'web', 'legal', 'email']);

      return {
        display: decodedData?.display ?? name,
        legal: decodedData?.legal ?? name,
        web: decodedData?.web,
        email: decodedData?.email,
        date_of_birth: dayjs(identityDOB) ?? undefined,
        older_than_15: !identityDOB,
        onChainIdentity,
        hasUserWarn: parseCitizenshipJudgement(judgements),
      };
    }
    return {
      hasUserWarn: false,
    };
  }, [identity, blockNumber, name]);

  const [form] = Form.useForm();

  const isOlderThan15 = Form.useWatch('older_than_15', form);
  const onChainIdentity = Form.useWatch('onChainIdentity', form);
  const isUserWarnAccepted = Form.useWatch('isUserWarnAccepted', form);

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={defaultValues}
      onFinish={onSubmit}
    >
      <Title level={3}>Update on-chain identity</Title>
      <Paragraph>
        You are going to update your identity stored on blockchain. This needs
        to be up-to-date for your citizenship or e-residency.
      </Paragraph>
      <Form.Item name="display" label="Display name" rules={[{ required: true }]}>
        <Input placeholder="Display name" />
      </Form.Item>
      <Form.Item name="legal" label="Legal name" extra="Optional">
        <Input placeholder="Legal name" />
      </Form.Item>
      <Form.Item name="web" label="Web address" extra="Optional">
        <Input placeholder="Web address" />
      </Form.Item>
      <Form.Item name="email" label="E-mail" extra="Recommended, Optional">
        <Input inputMode="email" placeholder="Web address" />
      </Form.Item>
      <Form.Item
        name="onChainIdentity"
        label="I am a"
        rules={[{ required: true }]}
      >
        <Select
          options={[
            { value: 'eresident', label: 'E-resident' },
            { value: 'citizen', label: 'Citizen' },
            { value: 'company', label: 'Company' },
            { value: 'neither', label: 'Neither' },
          ]}
        />
      </Form.Item>

      {onChainIdentity === 'citizen' && (
        <>
          <Form.Item
            name="older_than_15"
            label="I'm 15 or older"
            layout="horizontal"
            valuePropName="checked"
          >
            <Checkbox />
          </Form.Item>
          {!isOlderThan15 && (
            <Form.Item
              name="date_of_birth"
              label="Date of birth"
              getValueProps={(value) => ({ value: value ? dayjs(value) : '' })}
            >
              <DatePicker />
            </Form.Item>
          )}
        </>
      )}
      {defaultValues.hasUserWarn && !isUserWarnAccepted && (
        <Paragraph>
          <Alert
            type="warning"
            message={(
              <>
                Warning! Your identity is currently confirmed by citizenship office
                as valid. Changing it will require reapproval - you&apos;ll
                temporarily lose citizenship or e-resident rights onchain.
                Until its manually handled by ministry of interior which takes about two days.
              </>
            )}
          />
        </Paragraph>
      )}
      {defaultValues.hasUserWarn && (
        <Form.Item
          layout="horizontal"
          name="isUserWarnAccepted"
          label="I want to change my identity"
          valuePropName="checked"
          rules={[{
            validator: (_, val) => (
              val ? Promise.resolve() : Promise.reject('Check if identity changes are intentional')
            ),
          }]}
        >
          <Checkbox />
        </Form.Item>
      )}
      <Flex wrap gap="15px">
        <Button className={styles.button} onClick={onClose}>
          Cancel
        </Button>
        <Button className={styles.button} primary type="submit">
          Set identity
        </Button>
      </Flex>
    </Form>
  );
}

OnchainIdentityForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  identity: PropTypes.shape({
    isSome: PropTypes.bool.isRequired,
    unwrap: PropTypes.func.isRequired,
  }).isRequired,
  blockNumber: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
};

export default OnchainIdentityForm;
