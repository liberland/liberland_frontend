import React from 'react';
import PropTypes from 'prop-types';
import { useForm, useFieldArray } from 'react-hook-form';
import { TextInput } from '../components/InputComponents';
import Button from '../components/Button/Button';
import Card from '../components/Card';
import './utils.scss';
import { newCompanyDataObject } from './defaultData';

const buildFieldName = (formKey, index, dynamicField, suffix) => (dynamicField.encryptable
  ? `${formKey}.${index}.${dynamicField.key}.${suffix}`
  : `${formKey}.${index}.${dynamicField.key}`);

export function blockchainDataToFormObject(blockchainDataRaw) {
  const blockchainData = blockchainDataRaw.toJSON ? blockchainDataRaw.toJSON() : blockchainDataRaw;
  const supportedObject = JSON.parse(JSON.stringify(newCompanyDataObject));
  const staticFields = [];
  const dynamicFields = [];

  supportedObject.staticFields.forEach((staticField) => {
    if (staticField.key in blockchainData) {
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
  formKey, displayName, register, control, dynamicFieldData, errors,
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: formKey,
  });
  return (
    <div id={`programmatic${formKey}`} style={{ marginBottom: '1rem' }}>
      <Card>
        {fields.map((_, index) => (
          <Card className="dynamicFieldsEntityCard">
            <div style={{ width: '100%', marginBottom: '0.25rem' }}>
              <div>
                <h4>
                  {displayName}
                  {' '}
                  {index + 1}
                </h4>
              </div>

              {dynamicFieldData.fields.map((dynamicField) => {
                const fieldName = buildFieldName(formKey, index, dynamicField, 'value');

                return (
                  <div key={dynamicField.key} style={{ margin: '16px 0' }}>
                    <div>
                      {dynamicField.display}
                      :
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                      <div style={{ flex: '1', margin: '0 16px' }}>
                        {dynamicField.type === 'text'
                          ? (
                            <>
                              <TextInput
                                name={fieldName}
                                register={register}
                                placeholder={dynamicField.display}
                                validate={(v) => v !== '' || `${dynamicField.name} cannot be empty`}
                              />
                              <div className="error">
                                {dynamicField.encryptable
                                  ? errors?.[formKey]?.[index]?.[dynamicField.key]?.value?.message
                                  : errors?.[formKey]?.[index]?.[dynamicField.key]?.message}
                              </div>
                            </>
                          )
                          : (
                            <input
                              type={dynamicField.type}
                              {...register(fieldName)}
                              placeholder={dynamicField.display}
                            />
                          )}
                      </div>

                    </div>
                  </div>
                );
              })}
              <div style={{ display: 'flex', margin: '16px', justifyContent: 'flex-end' }}>
                <Button small red type="button" onClick={() => remove(index)}>Delete</Button>
              </div>
            </div>
          </Card>
        ))}
        <div style={{ display: 'flex', margin: '16px', justifyContent: 'flex-end' }}>
          <Button type="button" onClick={() => append({})} small green>
            Add
            {' '}
            {displayName}
          </Button>
        </div>
      </Card>
    </div>
  );
}

GetFieldsForm.propTypes = {
  formKey: PropTypes.string.isRequired,
  register: PropTypes.func.isRequired,
  displayName: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  dynamicFieldData: PropTypes.any.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  control: PropTypes.any.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  errors: PropTypes.any.isRequired,
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
          defaultValuesForField[index][field.key] = encryptable
            ? {
              value: field.display,
              isEncrypted: field.isEncrypted,
            }
            : field.display;
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
  const defaultValues = getDefaultValuesFromDataObject(formObject, !!companyId);
  const {
    handleSubmit, register, control, formState: { errors },
  } = useForm({
    defaultValues,
  });

  if (formObject.invalid) {
    return <div>This company&apos;s registry data is corrupted. Please contact administration.</div>;
  }

  return (
    <form onSubmit={handleSubmit((result) => {
      callback(result);
    })}
    >
      <div id="static">
        <Card>
          {formObject.staticFields.map((staticField) => {
            const staticFieldName = staticField.encryptable ? `${staticField.key}.value` : staticField.key;
            const staticFieldEncryptedName = `${staticField.key}.isEncrypted`;
            return (
              <div style={{ marginBottom: '0.5rem' }}>
                <label style={{ fontWeight: 'bold', fontSize: '1.05rem' }}>{staticField.name}</label>
                <br />
                {staticField.type === 'text'
                  ? (
                    <>
                      <TextInput
                        name={staticField.key}
                        register={register}
                        style={{ width: '50%' }}
                        placeholder={staticField.name}
                        validate={(v) => v !== '' || `${staticField.name} cannot be empty`}
                      />
                      <div className="error">{errors?.[staticField.key]?.message}</div>
                    </>
                  )
                  : (
                    <input
                      type={staticField.type}
                      name={staticField.key}
                      {...register(staticFieldName)}
                      placeholder={staticField.display}
                    />
                  )}

                {staticField.encryptable ? <input {...register(staticFieldEncryptedName)} type="checkbox" /> : null }
              </div>
            );
          })}
        </Card>
      </div>
      {formObject.dynamicFields.map((dynamicField) => (
        <GetFieldsForm
          formKey={dynamicField.key}
          displayName={dynamicField.name}
          register={register}
          control={control}
          dynamicFieldData={dynamicField}
          errors={errors}
        />
      ))}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          primary
          small
          type="submit"
        >
          {buttonMessage}
        </Button>
      </div>
    </form>
  );
}

BuildRegistryForm.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  formObject: PropTypes.any.isRequired,
  buttonMessage: PropTypes.string.isRequired,
  companyId: PropTypes.string.isRequired,
  callback: PropTypes.func.isRequired,
};

export function RenderRegistryItemDetails({ mainDataObject, showAll = false }) {
  return (
    <div>
      <ul>
        {mainDataObject?.staticFields.map((staticField) => (
          <li>
            {staticField?.name}
            :
            {' '}
            {staticField?.display}
          </li>
        ))}
        {showAll
          ? mainDataObject?.dynamicFields.map((dynamicField) => (
            <div>
              <b>{dynamicField?.name}</b>
              <ul>
                {dynamicField?.data?.map((formObjects, index) => (
                  <div>
                    <li>
                      {dynamicField?.name}
                      {' '}
                      {index + 1}
                    </li>
                    <ul>
                      {formObjects.map((formObject) => (
                        <li>
                          {formObject?.display}
                          {' '}
                          {formObject?.isEncrypted ? '(Encrypted)' : ''}
                        </li>

                      ))}
                    </ul>
                  </div>
                ))}
              </ul>
            </div>
          ))
          : <div />}
      </ul>
    </div>
  );
}

RenderRegistryItemDetails.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  mainDataObject: PropTypes.any.isRequired,
  showAll: PropTypes.bool.isRequired,
};
