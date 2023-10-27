import React from 'react';
import {useForm, useFieldArray} from "react-hook-form";
import {TextInput} from "../components/InputComponents";
import Button from "../components/Button/Button";
import Card from "../components/Card";
import "./utils.scss"

const buildFieldName = (formKey, index, dynamicField, suffix) => {
  return dynamicField.encryptable ?
    `${formKey}.${index}.${dynamicField.key}.${suffix}`
    :
    `${formKey}.${index}.${dynamicField.key}`;
}

export const getFieldsForm = (formKey, displayName, register, control, dynamicFieldData) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: formKey
  });
  return (
    <div id={"programmatic" + formKey} style={{marginBottom:'1rem'}}>
      <Card>
        <h3>{formKey}</h3>
          {fields.map((item, index) => {
            return(
              <Card className={'dynamicFieldsEntityCard'}>
                <table key={item.id} style={{ width: "100%", marginBottom:'0.25rem'}}>
                  <thead>
                    <tr>
                      <td><h4>{displayName} {index + 1}</h4></td>
                    </tr>
                  </thead>
                  <tbody>
                    {dynamicFieldData.fields.map(dynamicField => {
                      return (
                          <tr style={{borderWidth: '1px', borderStyle: 'solid', borderColor:"black"}}>
                            <td style={{width:'20%'}}>
                              <label>{dynamicField.display}: </label>
                            </td>
                            <td style={{width:'65%'}}>
                              {dynamicField.type === 'text' ?
                                <TextInput
                                  name={buildFieldName(formKey, index, dynamicField, 'value')}
                                  register={register}
                                  style={{width:'95%'}}
                                />
                                :
                                <input
                                  type={dynamicField.type}
                                  {...register(buildFieldName(formKey, index, dynamicField, 'value'))}
                                  style={{width: '95%'}}
                                />}
                            </td>
                            <td style={{width:'15%'}}>
                              {dynamicField.encryptable ? <label>Encrypt Field? </label> : null }
                              {dynamicField.encryptable ?
                                <input
                                  {...register(buildFieldName(formKey, index, dynamicField, 'isEncrypted'))}
                                  type="checkbox"
                                /> : null }
                            </td>
                          </tr>
                      )})}
                    <tr><td><Button medium red type="button" onClick={() => remove(index)}>Delete {displayName} {index+1}</Button></td></tr>
                  </tbody>
                </table>
              </Card>
          )})}
        <Button type="button" onClick={() => append({})} medium green>
          Append {displayName}
        </Button>
      </Card>
    </div>
  )
}
export const getDefaultValuesFromDataObject = (dataObject) => {
  let defaultValues = {}
  dataObject?.staticFields?.forEach(staticField => {
    defaultValues[staticField.key] = staticField.display
  })
  dataObject?.dynamicFields?.forEach(dynamicField => {
    let defaultValuesForField = []
    dynamicField?.data?.forEach((fieldValues, index) => {
      defaultValuesForField[index] = {}
      fieldValues?.forEach(field => {
        const encryptable = dynamicField.fields.find(v => v.key == field.key)?.encryptable;
        defaultValuesForField[index][field.key] = encryptable ?
          {
            value: field.display,
            isEncrypted: field.isEncrypted,
          }
          :
          field.display;
      })
    })
    defaultValues[dynamicField.key] = defaultValuesForField
  })
  return defaultValues
}
export const buildRegistryForm = (dataObject, buttonMessage, companyId, callback) => {
  const defaultValues = getDefaultValuesFromDataObject(dataObject)
  const { handleSubmit, register, control } = useForm({
    defaultValues: defaultValues
  });

  return (
    <form onSubmit={handleSubmit((result)=>{
      callback(result)
    })}>
      <div id="static">
        <Card>
          {dataObject.staticFields.map(staticField => {
            const staticFieldName = staticField.encryptable ? `${staticField.key}.value` : staticField.key;
            const staticFieldEncryptedName = `${staticField.key}.isEncrypted`
            return (
              <div style={{marginBottom: '0.5rem'}}>
                <label style={{fontWeight: 'bold', fontSize:'1.05rem'}}>{staticField.display}</label>
                <br/>
                {staticField.type === 'text' ? <TextInput name={staticField.key} register={register} style={{width:'50%'}} /> : <input type={staticField.type} name={staticField.key} {...register(staticFieldName)} style={{width:'50%'}} />}

                {staticField.encryptable ? <input {...register(staticFieldEncryptedName)} type="checkbox" /> : null }
              </div>
            )
          })}
        </Card>
      </div>
      {dataObject.dynamicFields.map(dynamicField => {
        return getFieldsForm(dynamicField.key, dynamicField.name, register, control, dynamicField)
      })}
      <Button
        primary
        medium
        type="submit"
      >
        {buttonMessage}
      </Button>
    </form>
  )
}

export const renderRegistryItemDetails = (dataObject, showAll = false) => {
  return (<div>
    <ul>
      {dataObject?.staticFields.map(staticField => {
        return (
          <li>{staticField?.name}: {staticField?.display}</li>
        )
      })}
      {showAll ?
        dataObject?.dynamicFields.map(dynamicField => {
          return (
            <div>
              <b>{dynamicField?.name}</b>
              <ul>
                {dynamicField?.data?.map((dataObjects, index) => {
                  return (
                    <div>
                      <li>{dynamicField?.name} {index + 1}</li>
                      <ul>
                        {dataObjects.map(dataObject => {
                          return(
                            <li>{dataObject?.display} {dataObject?.isEncrypted ? "(Encrypted)" : ''}</li>
                          )
                        })}
                      </ul>
                    </div>
                  )
                })}
              </ul>
            </div>
          )
        })
        : <div></div>
      }
    </ul>
  </div>)
}
