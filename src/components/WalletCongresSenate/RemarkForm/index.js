import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { SelectInput, TextInput } from '../../InputComponents';
import styles from '../../Modals/styles.module.scss';
import { encodeRemark } from '../../../api/nodeRpcCall';

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

export default function RemarkForm({
  register,
  indexItem,
  errors,
  watch,
  setValue,
}) {
  const categoryName = indexItem !== null ? `category${indexItem}` : 'category';
  const projectName = indexItem !== null ? `project${indexItem}` : 'project';
  const supplierName = indexItem !== null ? `supplier${indexItem}` : 'supplier';
  const descriptionName = indexItem !== null ? `description${indexItem}` : 'description';
  const amountInUsdName = indexItem !== null ? `amountInUsd${indexItem}` : 'amountInUsd';
  const finalDestinationName = indexItem !== null ? `finalDestination${indexItem}` : 'finalDestination';
  const combined = indexItem !== null ? `combined${indexItem}` : 'combined';

  const category = watch(categoryName);
  const project = watch(projectName);
  const supplier = watch(supplierName);
  const description = watch(descriptionName);
  const amountInUsd = watch(amountInUsdName);
  const finalDestination = watch(finalDestinationName);

  useEffect(() => {
    const remark = {
      category,
      project,
      supplier,
      description,
      finalDestination,
      amountInUSDAtDateOfPayment: Number(amountInUsd),
    };

    encodeRemark(remark).then((encoded) => setValue(combined, encoded, { shouldValidate: true }));
  }, [
    category,
    project,
    supplier,
    description,
    amountInUsd,
    finalDestination,
    setValue,
    combined,
  ]);

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
      />
      {errors?.[`${projectName}`] && (
        <div className={styles.error}>{errors?.[`${projectName}`].message}</div>
      )}

      <div className={styles.title}>Supplier</div>
      <TextInput
        register={register}
        name={supplierName}
        errorTitle="Supplier"
        placeholder="Supplier"
        required
      />
      {errors?.[`${supplierName}`] && (
        <div className={styles.error}>{errors[`${supplierName}`].message}</div>
      )}

      <div className={styles.title}>Description</div>
      <TextInput
        register={register}
        name={descriptionName}
        errorTitle="Description"
        placeholder="Description"
        required
      />
      {errors?.[`${descriptionName}`] && (
        <div className={styles.error}>
          {errors[`${descriptionName}`].message}
        </div>
      )}

      <div className={styles.title}>Final Destination</div>
      <TextInput
        register={register}
        name={finalDestinationName}
        errorTitle="Final Destination"
        placeholder="Final Destination"
        required
      />
      {errors?.[`${finalDestinationName}`] && (
        <div className={styles.error}>
          {errors?.[`${finalDestinationName}`].message}
        </div>
      )}

      <div className={styles.title}>Amount in USD at date of payment</div>
      <TextInput
        register={register}
        name={amountInUsdName}
        errorTitle="Amount in USD"
        placeholder="Amount in USD"
        required
        validate={(value) => {
          const number = Number(value);
          if (!(typeof number === 'number') || !!Number.isNaN(number)) {
            return 'Amount must be a number value';
          }
          return true;
        }}
      />
      {errors?.[`${amountInUsdName}`] && (
        <div className={styles.error}>
          {errors[`${amountInUsdName}`].message}
        </div>
      )}
      <TextInput
        className={styles.displayNone}
        register={register}
        name={combined}
        validate={(value) => {
          if (Object.keys(value).length > 256) {
            return 'Remark should have less than 256 bytes';
          }
          return true;
        }}
      />
      {errors?.[`${combined}`] && (
        <div className={styles.error}>{errors[`${combined}`].message}</div>
      )}
    </>
  );
}

RemarkForm.defaultProps = {
  indexItem: null,
};

RemarkForm.propTypes = {
  register: PropTypes.func.isRequired,
  indexItem: PropTypes.number,
  watch: PropTypes.func.isRequired,
  setValue: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  errors: PropTypes.any.isRequired,
};
