import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Checkbox from 'antd/es/checkbox';
import Result from 'antd/es/result';
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
import Divider from 'antd/es/divider';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import dayjs from 'dayjs';
import { useMediaQuery } from 'usehooks-ts';
import Button from '../../Button/Button';
import styles from './styles.module.scss';
import { useHideTitle } from '../../Layout/HideTitle';
import FormSection from '../../FormSection';
import router from '../../../router';
import { walletActions } from '../../../redux/actions';
import AssetSelector from '../AssetSelector';
import MarkdownEditor from '../../MarkdownEditor';
import DeleteCompanyModal from '../../Modals/DeleteCompanyModal';
import CancelCompanyRequestModal from '../../Modals/CancelCompanyRequestModal';

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

function getFieldComponent({
  field,
  form,
  name,
  label,
  prefix,
}) {
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
      fieldComponent: <InputNumber controls={false} />,
    };
  }
  if (field.type === 'password') {
    return {
      fieldComponent: <Password />,
    };
  }
  if (field.key === 'purpose') {
    return {
      noWrapper: true,
      fieldComponent: (
        <MarkdownEditor
          label={label}
          name={name}
        />
      ),
    };
  }
  if (field.key === 'assetId') {
    return {
      noWrapper: true,
      fieldComponent: (
        <AssetSelector
          form={form}
          label={label}
          name={name}
          prefix={prefix}
        />
      ),
    };
  }
  return {
    fieldComponent: (
      <Input
        type={field.type}
      />
    ),
  };
}

export const getDefaultValuesFromDataObject = (formObject, editMode = false) => {
  const defaultValues = {
    signedContract: Boolean(formObject.id),
  };
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
            isEncrypted: field.isEncrypted || false,
          };
        } else {
          defaultValuesForField[index][field.key] = encryptable
            ? {
              isEncrypted: field.isEncrypted || false,
            }
            : null;
        }
      });
    });
    defaultValues[dynamicField.key] = defaultValuesForField;
  });
  return defaultValues;
};

export default function CompaniesForm({
  formObject, buttonMessage, companyId, callback,
}) {
  const [form] = Form.useForm();
  const defaultValues = getDefaultValuesFromDataObject(formObject, !!companyId);
  const isRequest = Boolean(formObject.registryAllowedToEdit);
  const companyType = Form.useWatch('companyType', form);
  const isLargerThanWideScreen = useMediaQuery('(min-width: 1500px)');
  const isLargerThanHdScreen = useMediaQuery('(min-width: 1600px)');
  const history = useHistory();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(walletActions.getAdditionalAssets.call());
  }, [dispatch]);

  useHideTitle();

  if (formObject.invalid) {
    return (
      <Result
        title="Corrupted data"
        status="error"
        subTitle={(
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
      <Card
        className={styles.registryCard}
        title={(
          <Title className={styles.registryTitle} level={1}>
            {companyId
              ? defaultValues.name
              : 'Register a new Liberland company'}
          </Title>
        )}
      >
        <Card.Meta
          description={(
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
          )}
        />
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
                    noWrapper,
                  } = getFieldComponent({
                    field: staticField,
                    form,
                    label: staticField.name,
                    name: staticFieldName,
                  });
                  if (!fieldComponent) {
                    return null;
                  }
                  return (
                    <Col
                      span={isLargerThanWideScreen ? staticFieldSpan[staticField.key] : 24}
                      key={staticFieldName}
                    >
                      {noWrapper ? fieldComponent : (
                        <Form.Item
                          name={staticFieldName}
                          label={staticField.name}
                          layout={layout}
                          getValueProps={getValueProps}
                          valuePropName={valuePropName}
                          extra={staticField.description && (
                            <div className={styles.extra}>{staticField.description}</div>
                          )}
                        >
                          {fieldComponent}
                        </Form.Item>
                      )}
                    </Col>
                  );
                })}
            </Row>
          </FormSection>
          {formObject.dynamicFields.map((dynamicField) => (
            <React.Fragment key={dynamicField.key}>
              <Divider />
              <Form.List name={dynamicField.key}>
                {(fields, { add, remove }) => (
                  <FormSection
                    title={dynamicField.name}
                    extra={(
                      <Button className={styles.add} type="button" onClick={add} green>
                        Add
                        {' '}
                        {dynamicField.name}
                      </Button>
                    )}
                  >
                    <List
                      dataSource={fields}
                      locale={{ emptyText: 'No data found' }}
                      header={dynamicField.display}
                      renderItem={(field, index) => (
                        <Card
                          title={`${dynamicField.name} ${index + 1}`}
                          key={field.key}
                          className={styles.dynamicFieldsEntityCard}
                          actions={[
                            <Flex wrap gap="15px" justify="start" className={styles.delete}>
                              <Button red type="button" onClick={() => remove(field.name)}>
                                Delete
                                {' '}
                                {dynamicField.name}
                                {' '}
                                {index + 1}
                              </Button>
                            </Flex>,
                          ]}
                        >
                          <Row gutter={16}>
                            {dynamicField.fields.map((singleField) => {
                              const fieldName = buildFieldName(index, singleField, 'value');
                              const label = singleField.name;
                              const {
                                fieldComponent,
                                layout,
                                getValueProps,
                                valuePropName,
                                noWrapper,
                              } = getFieldComponent({
                                field: singleField,
                                form,
                                label,
                                name: fieldName,
                                prefix: dynamicField.key,
                              });
                              if (!fieldComponent) {
                                return null;
                              }
                              return (
                                <Col key={fieldName} span={isLargerThanWideScreen ? 7 : 24}>
                                  {noWrapper ? fieldComponent : (
                                    <Form.Item
                                      name={fieldName}
                                      label={label}
                                      extra={singleField.display && (
                                        <div className={styles.extra}>{singleField.display}</div>
                                      )}
                                      layout={layout}
                                      getValueProps={getValueProps}
                                      valuePropName={valuePropName}
                                    >
                                      {fieldComponent}
                                    </Form.Item>
                                  )}
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
            </React.Fragment>
          ))}
        </Flex>
        <Divider />
        <Form.Item
          name="companyType"
          label="Choose company type"
          rules={[{ required: true }]}
        >
          <Radio.Group>
            <Row gutter={16}>
              <Col span={isLargerThanHdScreen ? 8 : 23}>
                <Card
                  title={(
                    <Radio value="Dormant">
                      Dormant company
                    </Radio>
                  )}
                >
                  <Flex vertical gap="5px" align="stretch">
                    <Paragraph className={styles.signature}>
                      If you are registering a dormant company for reserving brand name,
                      establishing presence in Liberland,
                      using this company to drive Liberland traffic to some other business,
                      or any other reason for which you do not intend to do any transactions or hold
                      assets with this company until further notice (can change this at any time)
                    </Paragraph>
                    <Button flex primary href="https://blockchain.liberland.org/home/contracts/overview/browser/12">
                      Sign contract
                    </Button>
                  </Flex>
                </Card>
              </Col>
              {!isLargerThanHdScreen ? <Divider /> : null}
              <Col span={isLargerThanHdScreen ? 8 : 23}>
                <Card
                  title={(
                    <Radio value="Liberland">
                      Pure Liberland company
                    </Radio>
                  )}
                >
                  <Flex vertical gap="5px" align="stretch">
                    <Paragraph className={styles.signature}>
                      If you are registering a pure Liberland company,
                      only operating under the jurisdiction of Liberland,
                      such as the territory of Liberland, Liberland ecosystem, Liberland blockchain, or doing business
                      only with Liberland citizens and e-residents
                    </Paragraph>
                    <Button flex primary href="https://blockchain.liberland.org/home/contracts/overview/browser/14">
                      Sign contract
                    </Button>
                  </Flex>
                </Card>
              </Col>
              {!isLargerThanHdScreen ? <Divider /> : null}
              <Col span={isLargerThanHdScreen ? 8 : 23}>
                <Card
                  title={(
                    <Radio value="International">
                      Internationally operating company
                    </Radio>
                  )}
                >
                  <Flex vertical gap="5px" align="stretch">
                    <Paragraph className={styles.signature}>
                      If you are registering a Liberland company intended to do business internationally,
                      within jurisdictions other than Liberland,
                      you will need to comply with additional requirements and sign the
                      &quot;GoodBoi&quot; contract
                    </Paragraph>
                    <Button flex primary href="https://blockchain.liberland.org/home/contracts/overview/browser/13">
                      Sign contract
                    </Button>
                  </Flex>
                </Card>
              </Col>
            </Row>
          </Radio.Group>
        </Form.Item>
        <Divider />
        <Form.Item
          label="Signed company contract"
          name="signedContract"
          rules={[{ required: true }]}
          layout="horizontal"
          valuePropName="checked"
          className="big-checkbox-item"
        >
          <Checkbox disabled={!companyType} className="big-checkbox" />
        </Form.Item>
        <Flex wrap gap="15px">
          <Button onClick={() => history.push(router.companies.allCompanies)}>
            Cancel
          </Button>
          {companyId && (isRequest ? (
            <CancelCompanyRequestModal companyId={companyId} />
          ) : (
            <DeleteCompanyModal companyId={companyId} />
          ))}
          <Button
            primary
            type="submit"
          >
            {buttonMessage}
          </Button>
        </Flex>
      </Card>
    </Form>
  );
}

CompaniesForm.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  formObject: PropTypes.any.isRequired,
  buttonMessage: PropTypes.string.isRequired,
  companyId: PropTypes.string,
  callback: PropTypes.func.isRequired,
};
