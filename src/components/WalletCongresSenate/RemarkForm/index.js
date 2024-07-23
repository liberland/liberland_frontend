import React from 'react';
import PropTypes from 'prop-types';
import { SelectInput, TextInput } from '../../InputComponents';
import styles from '../../Modals/styles.module.scss';

const remarkOptions = {
  category: [
    {
      value: 'marketingAndPr',
      display: 'Marketing and PR',
      index: 0,
    },
    {
      value: 'diplomacy',
      display: 'Diplomacy',
      index: 1,
    },
    {
      value: 'it',
      display: 'It',
      index: 2,
    },
    {
      value: 'legal',
      display: 'Legal',
      index: 3,
    },
    {
      value: 'administration',
      display: 'Administration',
      index: 4,
    },
    {
      value: 'settlement',
      display: 'Settlement',
      index: 5,
    },
    {
      value: 'other',
      display: 'Other',
      index: 6,
    },
  ],
};

export default function RemarkForm({ register, indexItem, errors }) {
  const categoryName = indexItem ? `category${indexItem}` : 'category';
  const projectName = indexItem ? `project${indexItem}` : 'project';
  const supplierName = indexItem ? `supplier${indexItem}` : 'supplier';
  const descriptionName = indexItem ? `description${indexItem}` : 'description';
  const amountInUsd = indexItem ? `amountInUsd${indexItem}` : 'amountInUsd';
  return (
    <>
      <div className={styles.title}>Category</div>
      <SelectInput
        register={register}
        options={remarkOptions.category}
        name={categoryName}
        selected={remarkOptions.category[0]}
      />

      <div className={styles.title}>Project</div>
      <TextInput
        register={register}
        name={projectName}
        errorTitle="Project"
        placeholder="Project"
        required
        maxLength={{ value: 256, message: 'Max Project length is 256 chars' }}
      />
      {errors?.[`${projectName}`]
          && <div className={styles.error}>{errors?.[`${projectName}`].message}</div>}

      <div className={styles.title}>Supplier</div>
      <TextInput
        register={register}
        name={supplierName}
        errorTitle="Supplier"
        placeholder="Supplier"
        required
        maxLength={{ value: 256, message: 'Max Supplier length is 256 chars' }}
      />
      {errors?.[`${supplierName}`]
          && <div className={styles.error}>{errors[`${supplierName}`].message}</div>}

      <div className={styles.title}>Description</div>
      <TextInput
        register={register}
        name={descriptionName}
        errorTitle="Description"
        placeholder="Description"
        required
        maxLength={{ value: 256, message: 'Max description length is 256 chars' }}
      />
      {errors?.[`${descriptionName}`]
          && <div className={styles.error}>{errors[`${descriptionName}`].message}</div>}

      <div className={styles.title}>Amount in USD at date of payment</div>
      <TextInput
        register={register}
        name={amountInUsd}
        errorTitle="Amount in USD"
        placeholder="Amount in USD"
        required
        validate={(value) => {
          const number = Number(value);
          if (!(typeof number === 'number') || !(!Number.isNaN(number))) {
            return 'Amount must be a number value';
          }
          return true;
        }}
      />
      {errors?.[`${amountInUsd}`]
          && <div className={styles.error}>{errors[`${amountInUsd}`].message}</div>}
    </>
  );
}

RemarkForm.defaultProps = {
  indexItem: null,
};

RemarkForm.propTypes = {
  register: PropTypes.func.isRequired,
  indexItem: PropTypes.number,
  // eslint-disable-next-line react/forbid-prop-types
  errors: PropTypes.any.isRequired,
};
