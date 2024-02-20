import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { useFieldArray } from 'react-hook-form';

import { TextArea } from '../../../../InputComponents';
import Button from '../../../../Button/Button';
import styles from './styles.module.scss';
import { markdown2sections } from '../../../../../utils/legislation';

export function AddLegislationFields({
  control,
  register,
  errors,
  watch,
}) {
  const {
    fields, append, remove, replace,
  } = useFieldArray({
    control,
    name: 'sections',
    rules: {
      minLength: 1,
    },
  });
  const sections = watch('sections');

  const handlePaste = (e) => {
    const data = e.clipboardData.getData('text');
    const newSections = markdown2sections(data);
    if (sections.length === 1) {
      replace([...newSections.map((value) => ({ value }))]);
    } else if (newSections.length > 1) {
      // Process the paste event only if there are no existing sections or if there's more than one new section
      replace([...sections, ...newSections.map((value) => ({ value }))]);
    }
  };

  return (
    <>
      <div className={styles.title}>Legislation Content</div>
      {fields.map((field, index) => (
        <Fragment key={field.id}>
          <div className={styles.title}>
            Section #
            {index}
          </div>
          <TextArea
            watch={watch}
            onPaste={handlePaste}
            required
            errorTitle="Section #{index}"
            register={register}
            name={`sections.${index}.value`}
          />
          <Button nano secondary onClick={() => remove(index)}>Delete</Button>
        </Fragment>
      ))}
      {errors?.sections?.message ? <div className={styles.error}>{errors.sections.message}</div> : null}
      <Button nano secondary onClick={() => append({ value: '' })}>Add</Button>
    </>
  );
}

AddLegislationFields.propTypes = {
  control: PropTypes.shape({}).isRequired,
  register: PropTypes.func.isRequired,
  errors: PropTypes.shape({
    sections: PropTypes.shape({
      message: PropTypes.string.isRequired,
    }),
  }).isRequired,
  watch: PropTypes.func.isRequired,
};
