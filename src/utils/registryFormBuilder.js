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
import Password from 'antd/es/input/Password';
import Paragraph from 'antd/es/typography/Paragraph';
import Title from 'antd/es/typography/Title';
import Input from 'antd/es/input';
import List from 'antd/es/list';
import Card from 'antd/es/card';
import Row from 'antd/es/row';
import Col from 'antd/es/col';
import TextArea from 'antd/es/input/TextArea';
import Divider from 'antd/es/divider';
import { useHistory } from 'react-router-dom';
import dayjs from 'dayjs';
import { useMediaQuery } from 'usehooks-ts';
import Button from '../components/Button/Button';
import './utils.scss';
import { newCompanyDataObject } from './defaultData';
import { useHideTitle } from '../components/Layout/HideTitle';
import FormSection from '../components/FormSection';
import router from '../router';

const buildFieldName = (index, dynamicField, suffix) => (dynamicField.encryptable
  ? [index, dynamicField.key, suffix]
  : [index, dynamicField.key]);

const fieldDateTypes = {
  date: true,
  month: true,
  week: true,
  time: true,
};

const staticFieldOrder = {
  name: 0,
  logoURL: 1,
  charterURL: 2,
  purpose: 3,
  totalCapitalCurrency: 4,
  totalCapitalAmount: 5,
  numberOfShares: 6,
};

const staticFieldSpan = {
  name: 8,
  logoURL: 8,
  charterURL: 8,
  purpose: 24,
  totalCapitalCurrency: 8,
  totalCapitalAmount: 8,
  numberOfShares: 8,
};

function getFieldComponent(field, index) {
  if (field.key === 'companyType') {
    return {
      fieldComponent: null,
    };
  }
  if (field.type === 'checkbox') {
    return {
      fieldComponent: <Checkbox />,
      layout: 'horizontal',
      valuePropName: 'checked',
    };
  }
  if (field.type === 'date') {
    return {
      fieldComponent: <DatePicker />,
      getValueProps: (value) => ({ value: value ? dayjs(value) : '' }),
    };
  }
  if (field.type === 'color') {
    return {
      fieldComponent: <ColorPicker />,
    };
  }
  if (field.type === 'month') {
    return {
      fieldComponent: <DatePicker picker="month" />,
      getValueProps: (value) => ({ value: value ? dayjs(value) : '' }),
    };
  }
  if (field.type === 'week') {
    return {
      fieldComponent: <DatePicker picker="week" />,
      getValueProps: (value) => ({ value: value ? dayjs(value) : '' }),
    };
  }
  if (field.type === 'time') {
    return {
      fieldComponent: <DatePicker picker="time" />,
      getValueProps: (value) => ({ value: value ? dayjs(value) : '' }),
    };
  }
  if (field.type === 'number') {
    return {
      fieldComponent: <InputNumber controls={false} placeholder={field.display} />,
    };
  }
  if (field.type === 'password') {
    return {
      fieldComponent: <Password />,
    };
  }
  if (field.key === 'purpose') {
    return {
      fieldComponent: <TextArea className="slimTextArea" />,
    };
  }
  return {
    fieldComponent: (
      <Input
        type={field.type}
        placeholder={typeof index === 'number' ? `${field.display} ${index}` : field.display}
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
        const crossReferencedFieldDataArray = [{}];
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
  const isLargerThanWideScreen = useMediaQuery('(min-width: 1200px)');
  return (
    <Form.List name={formKey}>
      {(fields, { add, remove }) => (
        <FormSection
          title={displayName}
          extra={(
            <Button type="button" onClick={add} green>
              Add
              {' '}
              {displayName}
            </Button>
          )}
        >
          <List
            dataSource={fields}
            renderItem={(field, index) => (
              <Card
                title={`${displayName} ${index + 1}`}
                key={field.key}
                className="dynamicFieldsEntityCard"
                actions={[
                  <Flex wrap gap="15px" justify="end" className="delete">
                    <Button red type="button" onClick={() => remove(field.name)}>
                      Delete
                      {' '}
                      {displayName}
                      {' '}
                      {index + 1}
                    </Button>
                  </Flex>,
                ]}
              >
                <Row gutter={16}>
                  {dynamicFieldData.fields.map((dynamicField) => {
                    const fieldName = buildFieldName(index, dynamicField, 'value');
                    const {
                      fieldComponent,
                      layout,
                      getValueProps,
                      valuePropName,
                    } = getFieldComponent(dynamicField, index);
                    if (!fieldComponent) {
                      return null;
                    }
                    const span = Math.max(6, Math.floor(24 / dynamicFieldData.fields.length));
                    return (
                      <Col key={fieldName} span={isLargerThanWideScreen ? span : 24}>
                        <Form.Item
                          name={fieldName}
                          label={(
                            `${dynamicField.display.length > 40
                              ? `${dynamicField.display.slice(0, 40)}...`
                              : dynamicField.display} ${index + 1}`
                          )}
                          extra={dynamicField.display.length > 40 ? (
                            dynamicField.display
                          ) : undefined}
                          layout={layout}
                          getValueProps={getValueProps}
                          valuePropName={valuePropName}
                        >
                          {fieldComponent}
                        </Form.Item>
                      </Col>
                    );
                  })}
                </Row>
              </Card>
            )}
          />
        </FormSection>
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
  Object.values(defaultValues).forEach((value) => {
    if (Array.isArray(value) && value.length === 0) {
      value.push({});
    }
  });
  return defaultValues;
};

export function BuildRegistryForm({
  formObject, buttonMessage, companyId, callback,
}) {
  const [form] = Form.useForm();
  const defaultValues = getDefaultValuesFromDataObject(formObject, !!companyId);
  const companyType = Form.useWatch('companyType', form);
  const isLargerThanWideScreen = useMediaQuery('(min-width: 1200px)');
  const isLargerThanHdScreen = useMediaQuery('(min-width: 1600px)');
  const history = useHistory();

  useHideTitle();

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
      <Flex vertical gap="30px">
        <Flex vertical>
          <Title level={1}>
            {companyId
              ? defaultValues.name
              : 'Register a new Liberland company'}
          </Title>
          <Paragraph className="description">
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
        </Flex>
        <Flex vertical gap="40px">
          <FormSection title="Basic information">
            <Row gutter={16} wrap>
              {[
                ...formObject.staticFields,
              ].sort((aField, bField) => staticFieldOrder[aField.key] - staticFieldOrder[bField.key])
                .map((staticField) => {
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
                    <Col
                      span={isLargerThanWideScreen ? staticFieldSpan[staticField.key] : 24}
                      key={staticFieldName}
                    >
                      <Form.Item
                        name={staticFieldName}
                        label={staticField.name}
                        layout={layout}
                        getValueProps={getValueProps}
                        valuePropName={valuePropName}
                      >
                        {fieldComponent}
                      </Form.Item>
                    </Col>
                  );
                })}
            </Row>
          </FormSection>
          {formObject.dynamicFields.map((dynamicField) => (
            <React.Fragment key={dynamicField.key}>
              <Divider />
              <GetFieldsForm
                formKey={dynamicField.key}
                displayName={dynamicField.name}
                dynamicFieldData={dynamicField}
              />
            </React.Fragment>
          ))}
        </Flex>
      </Flex>
      <Form.Item
        name="companyType"
        label="Choose company type"
        rules={[{ required: true }]}
      >
        <Radio.Group>
          <Row gutter={16}>
            <Col span={isLargerThanHdScreen ? 8 : 24}>
              <Card
                title={(
                  <Radio value="Dormant">
                    Dormant company
                  </Radio>
                )}
              >
                <Flex vertical gap="5px" align="stretch">
                  <Paragraph className="signature">
                    If you are registering a dormant company for reserving brand name,
                    establishing presence in Liberland,
                    using this company to drive Liberland traffic to some other business,
                    or any other reason for which you do not intend to do any transactions or hold
                    assets with this company until further notice (can change this at any time)
                  </Paragraph>
                  <Button flex primary href="https://blockchain.liberland.org/home/contracts/overview/browser/12">
                    Sign the Dormant Company contract
                  </Button>
                </Flex>
              </Card>
            </Col>
            <Col span={isLargerThanHdScreen ? 8 : 24}>
              <Card
                title={(
                  <Radio value="Liberland">
                    Pure Liberland company
                  </Radio>
                )}
              >
                <Flex vertical gap="5px" align="stretch">
                  <Paragraph className="signature">
                    If you are registering a pure Liberland company, only operating under the jurisdiction of Liberland,
                    such as the territory of Liberland, Liberland ecosystem, Liberland blockchain, or doing business
                    only with Liberland citizens and e-residents
                  </Paragraph>
                  <Button flex primary href="https://blockchain.liberland.org/home/contracts/overview/browser/14">
                    Sign the Pure Liberland Company contract
                  </Button>
                </Flex>
              </Card>
            </Col>
            <Col span={isLargerThanHdScreen ? 8 : 24}>
              <Card
                title={(
                  <Radio value="International">
                    Internationally operating company
                  </Radio>
                )}
              >
                <Flex vertical gap="5px" align="stretch">
                  <Paragraph className="signature">
                    If you are registering a Liberland company intended to do business internationally,
                    within jurisdictions other than Liberland,
                    you will need to comply with additional requirements and sign the
                    &quot;GoodBoi&quot; contract
                  </Paragraph>
                  <Button flex primary href="https://blockchain.liberland.org/home/contracts/overview/browser/13">
                    Sign the International Operating Company contract
                  </Button>
                </Flex>
              </Card>
            </Col>
          </Row>
        </Radio.Group>
      </Form.Item>
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
        <Button onClick={() => history.push(router.companies.allCompanies)}>
          Cancel
        </Button>
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
