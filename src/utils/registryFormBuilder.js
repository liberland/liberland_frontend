import React from 'react';
import PropTypes from 'prop-types';
import { useForm, useFieldArray } from 'react-hook-form';
import { TextInput } from '../components/InputComponents';
import Button from '../components/Button/Button';
import Card from '../components/Card';
import './utils.scss';

const buildFieldName = (formKey, index, dynamicField, suffix) => (dynamicField.encryptable
  ? `${formKey}.${index}.${dynamicField.key}.${suffix}`
  : `${formKey}.${index}.${dynamicField.key}`);

export function GetFieldsForm({
  formKey, displayName, register, control, dynamicFieldData,
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

              {dynamicFieldData.fields.map((dynamicField) => (
                <div key={dynamicField.key} style={{ margin: '16px 0' }}>
                  <div>
                    {dynamicField.display}
                    :
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ flex: '1 1 0%', margin: '0 16px' }}>
                      {dynamicField.type === 'text'
                        ? (
                          <TextInput
                            name={buildFieldName(formKey, index, dynamicField, 'value')}
                            register={register}
                            placeholder={dynamicField.display}
                          />
                        )
                        : (
                          <input
                            type={dynamicField.type}
                            {...register(buildFieldName(formKey, index, dynamicField, 'value'))}
                            placeholder={dynamicField.display}
                          />
                        )}
                    </div>
                    <div style={{ margin: '0 16px' }}>
                      {dynamicField.encryptable ? <span>Encrypt Field? </span> : null }
                      {dynamicField.encryptable
                        ? (
                          <input
                            {...register(buildFieldName(formKey, index, dynamicField, 'isEncrypted'))}
                            type="checkbox"
                          />
                        ) : null }
                    </div>
                  </div>
                </div>
              ))}
              <div style={{ display: 'flex', margin: '16px', justifyContent: 'flex-end' }}>
                <Button medium red type="button" onClick={() => remove(index)}>Delete</Button>
              </div>
            </div>
          </Card>
        ))}
        <div style={{ display: 'flex', margin: '16px', justifyContent: 'flex-end' }}>
          <Button type="button" onClick={() => append({})} medium green>
            Append
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
};

export const getDefaultValuesFromDataObject = (formObject) => {
  const defaultValues = {};
  formObject?.dynamicFields?.forEach((dynamicField) => {
    const defaultValuesForField = [];
    dynamicField?.data?.forEach((fieldValues, index) => {
      defaultValuesForField[index] = {};
      fieldValues?.forEach((field) => {
        const encryptable = dynamicField.fields.find((v) => v.key === field.key)?.encryptable;
        defaultValuesForField[index][field.key] = encryptable
          ? {
            isEncrypted: field.isEncrypted,
          }
          : null;
      });
    });
    defaultValues[dynamicField.key] = defaultValuesForField;
  });
  return defaultValues;
};
export function BuildRegistryForm({
  formObject, buttonMessage, companyId, callback,
}) {
  const defaultValues = getDefaultValuesFromDataObject(formObject);
  const { handleSubmit, register, control } = useForm({
    defaultValues,
  });

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
                <label style={{ fontWeight: 'bold', fontSize: '1.05rem' }}>{staticField.display}</label>
                <br />
                {staticField.type === 'text'
                  ? (
                    <TextInput
                      name={staticField.key}
                      register={register}
                      style={{ width: '50%' }}
                      placeholder={staticField.display}
                    />
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
        />
      ))}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          primary
          medium
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
