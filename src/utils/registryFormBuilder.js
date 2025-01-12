import React from 'react';
import PropTypes from 'prop-types';
import Checkbox from 'antd/es/checkbox';
import Alert from 'antd/es/alert';
import ColorPicker from 'antd/es/color-picker';
import DatePicker from 'antd/es/date-picker';
import Flex from 'antd/es/flex';
import Form from 'antd/es/form';
import InputNumber from 'antd/es/input-number';
import Radio from 'antd/es/radio';
import Space from 'antd/es/space';
import Password from 'antd/es/input/Password';
import Paragraph from 'antd/es/typography/Paragraph';
import Title from 'antd/es/typography/Title';
import Input from 'antd/es/input';
import List from 'antd/es/list';
import Card from 'antd/es/card';
import dayjs from 'dayjs';
import Button from '../components/Button/Button';
import './utils.scss';
import { newCompanyDataObject } from './defaultData';

const buildFieldName = (index, dynamicField, suffix) => (dynamicField.encryptable
  ? [index, dynamicField.key, suffix]
  : [index, dynamicField.key]);

const fieldDateTypes = {
  date: true,
  month: true,
  week: true,
  time: true,
};

function getFieldComponent(staticField) {
  if (staticField.key === 'companyType') {
    return {
      fieldComponent: null,
    };
  }
  if (staticField.type === 'checkbox') {
    return {
      fieldComponent: <Checkbox />,
      layout: 'horizontal',
      valuePropName: 'checked',
    };
  }
  if (staticField.type === 'date') {
    return {
      fieldComponent: <DatePicker />,
      getValueProps: (value) => ({ value: value ? dayjs(value) : '' }),
    };
  }
  if (staticField.type === 'color') {
    return {
      fieldComponent: <ColorPicker />,
    };
  }
  if (staticField.type === 'month') {
    return {
      fieldComponent: <DatePicker picker="month" />,
      getValueProps: (value) => ({ value: value ? dayjs(value) : '' }),
    };
  }
  if (staticField.type === 'week') {
    return {
      fieldComponent: <DatePicker picker="week" />,
      getValueProps: (value) => ({ value: value ? dayjs(value) : '' }),
    };
  }
  if (staticField.type === 'time') {
    return {
      fieldComponent: <DatePicker picker="time" />,
      getValueProps: (value) => ({ value: value ? dayjs(value) : '' }),
    };
  }
  if (staticField.type === 'number') {
    return {
      fieldComponent: <InputNumber controls={false} placeholder={staticField.display} />,
    };
  }
  if (staticField.type === 'password') {
    return {
      fieldComponent: <Password />,
    };
  }
  return {
    fieldComponent: (
      <Input
        type={staticField.type}
        placeholder={staticField.display}
      />
    ),
  };
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
    <Form.List name={formKey}>
      {(fields, { add, remove }) => (
        <Card
          title={displayName}
          className="dynamicFieldsEntityCard"
          actions={[
            <Button type="button" onClick={add} green>
              Add
            </Button>,
          ]}
        >
          <List
            dataSource={fields}
            locale={{ emptyText: 'No items added' }}
            renderItem={(field, index) => (
              <Card
                title={`${displayName} ${index + 1}`}
                key={field.key}
                className="dynamicFieldsEntityCard"
                actions={[
                  <Button red type="button" onClick={() => remove(field.name)}>
                    Delete
                    {' '}
                    {displayName}
                  </Button>,
                ]}
              >
                <Flex vertical gap="15px">
                  {dynamicFieldData.fields.map((dynamicField) => {
                    const fieldName = buildFieldName(index, dynamicField, 'value');
                    const {
                      fieldComponent,
                      layout,
                      getValueProps,
                      valuePropName,
                    } = getFieldComponent(dynamicField);
                    if (!fieldComponent) {
                      return null;
                    }
                    return (
                      <Form.Item
                        name={fieldName}
                        label={dynamicField.display}
                        layout={layout}
                        getValueProps={getValueProps}
                        valuePropName={valuePropName}
                      >
                        {fieldComponent}
                      </Form.Item>
                    );
                  })}
                </Flex>
              </Card>
            )}
          />
        </Card>
      )}
    </Form.List>
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
      defaultValues[staticField.key] = fieldDateTypes[staticField.type]
        ? dayjs(staticField.display)
        : staticField.display;
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
            value: fieldDateTypes[field.type] ? dayjs(field.display) : field.display,
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
  const companyType = Form.useWatch('companyType', form);

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
      layout="vertical"
    >
      <Title level={2}>Register a new Liberland company</Title>
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
      <List
        dataSource={formObject.staticFields}
        renderItem={(staticField) => {
          const staticFieldName = staticField.encryptable ? `${staticField.key}.value` : staticField.key;
          const {
            fieldComponent,
            layout,
            getValueProps,
            valuePropName,
          } = getFieldComponent(staticField);
          if (!fieldComponent) {
            return null;
          }
          return (
            <Form.Item
              name={staticFieldName}
              label={staticField.name}
              layout={layout}
              getValueProps={getValueProps}
              valuePropName={valuePropName}
            >
              {fieldComponent}
            </Form.Item>
          );
        }}
      />
      <List
        dataSource={formObject.dynamicFields}
        renderItem={(dynamicField) => (
          <GetFieldsForm
            formKey={dynamicField.key}
            displayName={dynamicField.name}
            dynamicFieldData={dynamicField}
          />
        )}
      />
      <Form.Item
        name="companyType"
        label="Choose company type"
        rules={[{ required: true }]}
      >
        <Radio.Group>
          <Space direction="vertical">
            <Radio value="Dormant">
              Dormant company
            </Radio>
            <Radio value="Liberland">
              Pure Liberland company
            </Radio>
            <Radio value="International">
              Internationally operating company
            </Radio>
          </Space>
        </Radio.Group>
      </Form.Item>
      {companyType === 'Dormant' && (
        <Alert
          type="info"
          message={(
            <>
              <div>
                If you are registering a dormant company for reserving brand name,
                establishing presence in Liberland,
                using this company to drive Liberland traffic to some other business,
                or any other reason for which you do not intend to do any transactions or hold
                assets with this company until further notice (can change this at any time)
              </div>
              <a href="https://blockchain.liberland.org/home/contracts/overview/browser/12">
                Sign the Dormant company contract
              </a>
            </>
          )}
        />
      )}
      {companyType === 'Liberland' && (
        <Alert
          type="info"
          message={(
            <>
              <div>
                If you are registering a pure Liberland company, only operating under the jurisdiction of Liberland,
                such as the territory of Liberland, Liberland ecosystem, Liberland blockchain, or doing business
                only with Liberland citizens and e-residents
              </div>
              <a href="https://blockchain.liberland.org/home/contracts/overview/browser/14">
                Sign the Pure Liberland company contract
              </a>
            </>
          )}
        />
      )}
      {companyType === 'International' && (
        <Alert
          type="info"
          message={(
            <>
              <div>
                If you are registering a Liberland company intended to do business internationally,
                within jurisdictions other than Liberland,
                you will need to comply with additional requirements and sign the
                &quot;GoodBoi&quot; contract
              </div>
              <a href="https://blockchain.liberland.org/home/contracts/overview/browser/13">
                Sign the International Liberland &quot;GoodBoi&quot; company contract
              </a>
            </>
          )}
        />
      )}
      <Form.Item
        label="I have signed the relevant company type contract"
        name="signedContract"
        rules={[{ required: true }]}
        layout="horizontal"
        valuePropName="checked"
      >
        <Checkbox disabled={!companyType} />
      </Form.Item>
      <Flex wrap gap="15px">
        <Button
          primary
          type="submit"
        >
          {buttonMessage}
        </Button>
      </Flex>
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
