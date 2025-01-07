import React from 'react';
import PropTypes from 'prop-types';
import Checkbox from 'antd/es/checkbox';
import Alert from 'antd/es/alert';
import ColorPicker from 'antd/es/color-picker';
import DatePicker from 'antd/es/date-picker';
import Divider from 'antd/es/divider';
import Flex from 'antd/es/flex';
import Form from 'antd/es/form';
import InputNumber from 'antd/es/input-number';
import Radio from 'antd/es/radio';
import Space from 'antd/es/space';
import Splitter from 'antd/es/splitter';
import Password from 'antd/es/input/Password';
import Paragraph from 'antd/es/typography/Paragraph';
import Title from 'antd/es/typography/Title';
import Input from 'antd/es/input';
import Button from '../components/Button/Button';
import './utils.scss';
import { newCompanyDataObject } from './defaultData';

const buildFieldName = (formKey, index, dynamicField, suffix) => (dynamicField.encryptable
  ? `${formKey}.${index}.${dynamicField.key}.${suffix}`
  : `${formKey}.${index}.${dynamicField.key}`);

function getFieldComponent(staticField) {
  if (staticField.key === 'companyType') {
    return null;
  }
  if (staticField.encryptable || staticField.type === 'checkbox') {
    return <Checkbox />;
  }
  if (staticField.type === 'date') {
    return <DatePicker />;
  }
  if (staticField.type === 'color') {
    return <ColorPicker />;
  }
  if (staticField.type === 'month') {
    return <DatePicker picker="month" />;
  }
  if (staticField.type === 'week') {
    return <DatePicker picker="week" />;
  }
  if (staticField.type === 'time') {
    return <DatePicker picker="time" />;
  }
  if (staticField.type === 'number') {
    return <InputNumber controls={false} placeholder={staticField.display} />;
  }
  if (staticField.type === 'password') {
    return <Password />;
  }
  return (
    <Input
      type={staticField.type}
      placeholder={staticField.display}
    />
  );
}

export function blockchainDataToFormObject(blockchainDataRaw) {
  const blockchainData = blockchainDataRaw.toJSON ? blockchainDataRaw.toJSON() : blockchainDataRaw;
  const supportedObject = JSON.parse(JSON.stringify(newCompanyDataObject));
  const staticFields = [];
  const dynamicFields = [];

  supportedObject.staticFields.forEach((staticField) => {
    if (staticField.key in blockchainData || staticField.type === 'checkbox') {
      const fieldObject = staticField;
      fieldObject.display = blockchainData[staticField.key];
      staticFields.push(fieldObject);
    }
  });

  supportedObject.dynamicFields.forEach((dynamicField) => {
    if (dynamicField.key in blockchainData) {
      const fieldObject = dynamicField;
      const fieldObjectData = [];
      blockchainData[dynamicField.key].forEach((dynamicFieldDataArray) => {
        // Format using fields data
        const crossReferencedFieldDataArray = [];
        for (const key in dynamicFieldDataArray) {
          if (Object.prototype.hasOwnProperty.call(dynamicFieldDataArray, key)) {
            const pushObject = {};
            pushObject.key = key;
            if (dynamicFieldDataArray[key].isEncrypted !== undefined) {
              pushObject.display = dynamicFieldDataArray[key].value;
              pushObject.isEncrypted = dynamicFieldDataArray[key].isEncrypted;
            } else {
              pushObject.display = dynamicFieldDataArray[key];
              pushObject.isEncrypted = false;
            }
            crossReferencedFieldDataArray.push(JSON.parse(JSON.stringify(pushObject)));
          }
        }
        fieldObjectData.push(crossReferencedFieldDataArray);
      });

      fieldObject.data = JSON.parse(JSON.stringify(fieldObjectData));
      dynamicFields.push(fieldObject);
    }
  });
  blockchainData.staticFields = JSON.parse(JSON.stringify(staticFields));
  blockchainData.dynamicFields = JSON.parse(JSON.stringify(dynamicFields));
  return blockchainData;
}

export function GetFieldsForm({
  formKey, displayName, dynamicFieldData,
}) {
  return (
    <Splitter.Panel>
      <Form.List name="formKey">
        {(fields, { add, remove }) => (
          <div>
            {fields.map((field, index) => (
              <div key={field.key}>
                <Flex wrap gap="15px">
                  <Title level={4}>
                    {displayName}
                    {' '}
                    {index + 1}
                  </Title>

                  {dynamicFieldData.fields.map((dynamicField) => {
                    const fieldName = buildFieldName(formKey, index, dynamicField, 'value');

                    return (
                      <Form.Item name={fieldName} label={dynamicField.display}>
                        {getFieldComponent(dynamicField)}
                      </Form.Item>
                    );
                  })}
                  <Button small red type="button" onClick={() => remove(field.name)}>
                    Delete
                    {' '}
                    {displayName}
                  </Button>
                </Flex>
                <Divider />
              </div>
            ))}
            <Flex wrap gap="15px">
              <Button type="button" onClick={add} small green>
                Add
                {' '}
                {displayName}
              </Button>
            </Flex>
          </div>
        )}
      </Form.List>
    </Splitter.Panel>
  );
}

GetFieldsForm.propTypes = {
  formKey: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  dynamicFieldData: PropTypes.any.isRequired,
};

export const getDefaultValuesFromDataObject = (formObject, editMode = false) => {
  const defaultValues = {};
  if (editMode) {
    formObject?.staticFields?.forEach((staticField) => {
      defaultValues[staticField.key] = staticField.display;
    });
  }
  formObject?.dynamicFields?.forEach((dynamicField) => {
    const defaultValuesForField = [];
    dynamicField?.data?.forEach((fieldValues, index) => {
      defaultValuesForField[index] = {};
      fieldValues?.forEach((field) => {
        const encryptable = dynamicField.fields.find((v) => v.key === field.key)?.encryptable;
        if (editMode) {
          defaultValuesForField[index][field.key] = {
            value: field.display,
            isEncrypted: field.isEncrypted,
          };
        } else {
          defaultValuesForField[index][field.key] = encryptable
            ? {
              isEncrypted: field.isEncrypted,
            }
            : null;
        }
      });
    });
    defaultValues[dynamicField.key] = defaultValuesForField;
  });
  return defaultValues;
};

export function BuildRegistryForm({
  formObject, buttonMessage, companyId, callback,
}) {
  const [form] = Form.useForm();
  const defaultValues = getDefaultValuesFromDataObject(formObject, !!companyId);

  if (formObject.invalid) {
    return (
      <Alert
        type="error"
        message={(
          <>
            This company&apos;s registry data is corrupted. Please contact administration.
          </>
        )}
      />
    );
  }

  return (
    <Form
      form={form}
      initialValues={{
        ...defaultValues,
        registryAllowedToEdit: !!defaultValues.registryAllowedToEdit,
      }}
      onFinish={callback}
    >
      <Splitter layout="vertical">
        <Splitter.Panel>
          <h2>Register a new Liberland company</h2>
          <Paragraph>
            For full instructions, check out the
            {' '}
            <a
              href="https://docs.liberland.org/blockchain/for-citizens/how-to-run-liberland-company"
              target="_blank"
              rel="noreferrer"
            >
              Company registration guide
            </a>
          </Paragraph>
          {formObject.staticFields.map((staticField) => {
            const staticFieldName = staticField.encryptable ? `${staticField.key}.value` : staticField.key;
            return (
              <Form.Item name={staticFieldName} label={staticField.name}>
                {getFieldComponent(staticField)}
              </Form.Item>
            );
          })}
        </Splitter.Panel>
        {formObject.dynamicFields.map((dynamicField) => (
          <GetFieldsForm
            formKey={dynamicField.key}
            displayName={dynamicField.name}
            dynamicFieldData={dynamicField}
          />
        ))}
        <Splitter.Panel>
          <Form.Item
            name="companyType"
            label="Choose company type"
          >
            <Radio.Group>
              <Space direction="vertical">
                <Radio value="Dormant" label="Dormant company">
                  <Paragraph>
                    If you are registering a dormant company for reserving brand name,
                    establishing presence in Liberland,
                    using this company to drive Liberland traffic to some other business,
                    or any other reason for which you do not intend to do any transactions or hold
                    assets with this company until further notice (can change this at any time)
                  </Paragraph>
                  <Button link href="https://blockchain.liberland.org/home/contracts/overview/browser/12">
                    Sign the Dormant company contract
                  </Button>
                </Radio>
                <Radio value="Liberland" label="Pure Liberland company">
                  <Paragraph>
                    If you are registering a pure Liberland company, only operating under the jurisdiction of Liberland,
                    such as the territory of Liberland, Liberland ecosystem, Liberland blockchain, or doing business
                    only with Liberland citizens and e-residents
                  </Paragraph>
                  <Button link href="https://blockchain.liberland.org/home/contracts/overview/browser/14">
                    Pure Liberland company
                  </Button>
                </Radio>
                <Radio value="International" label="Internationally operating company">
                  <Paragraph>
                    If you are registering a Liberland company intended to do business internationally,
                    within jurisdictions other than Liberland,
                    you will need to comply with additional requirements and sign the
                    &quot;GoodBoi&quot; contract
                  </Paragraph>
                  <Button link href="https://blockchain.liberland.org/home/contracts/overview/browser/13">
                    Sign the International Liberland &quot;GoodBoi&quot; company contract
                  </Button>
                </Radio>
              </Space>
            </Radio.Group>
          </Form.Item>
        </Splitter.Panel>
        <Splitter.Panel>
          <input
            type="checkbox"
            name="signedContract"
          />
          {' '}
          <b>I have signed the relevant company type contract</b>
          <br />
          <br />
          <br />
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <Button
              primary
              type="submit"
            >
              {buttonMessage}
            </Button>
          </div>
        </Splitter.Panel>
      </Splitter>
    </Form>
  );
}

BuildRegistryForm.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  formObject: PropTypes.any.isRequired,
  buttonMessage: PropTypes.string.isRequired,
  companyId: PropTypes.string.isRequired,
  callback: PropTypes.func.isRequired,
};
